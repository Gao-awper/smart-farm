const aedes = require('aedes');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const net = require('net');

const MQTT_PORT = process.env.MQTT_PORT || 1883;
const WS_PORT = process.env.WS_PORT || 8082;

class MQTTServer {
  constructor() {
    this.broker = aedes();
    this.sensorClients = new Map();
    this.deviceClients = new Map();
    this.subscribers = new Set();
    this.io = null;
    this.wsClients = new Set();
    this.zoneStatus = {};
    // 聚合后的传感器数据（字段与小程序页面期望一致）
    this.aggregatedSensorData = {
      soilMoisture: 65, soilTemperature: 22, soilPh: 6.5, soilNutrient: 1200,
      airTemperature: 25, airHumidity: 60, lightIntensity: 80000, windSpeed: 3.5,
      waterTemperature: 20, dissolvedOxygen: 8.5, waterPh: 7.0, conductivity: 500
    };
    this.aggregatedIrrigationStatus = {
      status: '待机', lastIrrigation: '—', nextIrrigation: '—',
      todayWaterUsage: 0, manualMode: false
    };
  }

  initialize(io) {
    this.io = io;

    this.broker.on('client', (client) => {
      console.log(`[MQTT] 客户端连接: ${client.id}`);
    });

    this.broker.on('clientDisconnect', (client) => {
      console.log(`[MQTT] 客户端断开: ${client.id}`);
      this.sensorClients.delete(client.id);
      this.deviceClients.delete(client.id);
    });

    this.broker.on('subscribe', (subscriptions, client) => {
      console.log(`[MQTT] 客户端 ${client.id} 订阅了主题:`, subscriptions.map(s => s.topic));
      subscriptions.forEach(s => this.subscribers.add(s.topic));
    });

    this.broker.on('unsubscribe', (subscriptions, client) => {
      subscriptions.forEach(topic => {
        if (!this.isTopicSubscribed(topic)) {
          this.subscribers.delete(topic);
        }
      });
    });

    this.broker.on('publish', (packet, client) => {
      // 内部 publish（如传感器模拟器）没有 client，也需要进入处理管道
      this.handleMessage(packet.topic, packet.payload, client);
    });
  }

  isTopicSubscribed(topic) {
    for (const subscribed of this.subscribers) {
      if (this.matchTopic(subscribed, topic)) {
        return true;
      }
    }
    return false;
  }

  matchTopic(pattern, topic) {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '#') {
        return true;
      }
      if (patternParts[i] === '+') {
        continue;
      }
      if (patternParts[i] !== topicParts[i]) {
        return false;
      }
    }

    return patternParts.length === topicParts.length;
  }

  handleMessage(topic, payload, client) {
    try {
      const data = JSON.parse(payload.toString());

      if (topic.startsWith('farm/sensor/')) {
        this.handleSensorData(topic, data);
      } else if (topic.startsWith('farm/device/')) {
        this.handleDeviceData(topic, data);
      } else if (topic.startsWith('farm/alert/')) {
        this.handleAlert(topic, data);
      } else if (topic.startsWith('farm/irrigation/') && topic.endsWith('/status')) {
        this.handleIrrigationData(topic, data);
      }
    } catch (error) {
      console.error('[MQTT] 消息解析错误:', error);
    }
  }

  handleSensorData(topic, data) {
    console.log(`[MQTT] 收到传感器数据: ${topic}`, data);

    const sensorType = topic.split('/')[2];
    const sensorId = topic.split('/')[3];

    const sensorUpdate = {
      type: sensorType,
      id: sensorId,
      timestamp: new Date().toISOString(),
      data: data
    };

    if (this.io) {
      this.io.emit('mqttSensorData', sensorUpdate);
    }

    // 聚合并推送给小程序原生 WebSocket 客户端
    if (sensorType === 'soil') {
      Object.assign(this.aggregatedSensorData, {
        soilTemperature: Number(data.temperature.toFixed(1)),
        soilMoisture: Number(data.moisture.toFixed(1)),
        soilPh: Number(data.ph.toFixed(2)),
        soilNutrient: Math.round((data.nitrogen || 0) + (data.phosphorus || 0) + (data.potassium || 0))
      });
    } else if (sensorType === 'weather') {
      Object.assign(this.aggregatedSensorData, {
        airTemperature: Number(data.airTemperature.toFixed(1)),
        airHumidity: Number(data.airHumidity.toFixed(1)),
        lightIntensity: Math.round(data.lightIntensity),
        windSpeed: Number(data.windSpeed.toFixed(1))
      });
    } else if (sensorType === 'water') {
      Object.assign(this.aggregatedSensorData, {
        waterTemperature: Number(data.temperature.toFixed(1)),
        dissolvedOxygen: Number(data.dissolvedOxygen.toFixed(1)),
        waterPh: Number(data.ph.toFixed(2)),
        conductivity: Math.round(data.conductivity)
      });
    }
    this.broadcastWS({ type: 'sensorDataUpdate', data: this.aggregatedSensorData });
  }

  handleIrrigationData(topic, data) {
    const zoneId = topic.split('/')[2];
    this.zoneStatus[zoneId] = data.status;

    const st = this.aggregatedIrrigationStatus;
    const anyRunning = Object.values(this.zoneStatus).some(s => s === 'running');
    st.status = anyRunning ? '运行中' : '待机';
    if (data.status === 'running') {
      st.lastIrrigation = new Date().toLocaleString('zh-CN', { hour12: false });
      st.todayWaterUsage = Number((st.todayWaterUsage + 0.5).toFixed(1));
    }

    if (this.io) {
      this.io.emit('mqttIrrigationStatus', {
        zoneId, ...data, timestamp: new Date().toISOString()
      });
    }
    this.broadcastWS({ type: 'irrigationStatusUpdate', data: st });
  }

  broadcastWS(message) {
    const payload = JSON.stringify(message);
    this.wsClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  }

  handleDeviceData(topic, data) {
    console.log(`[MQTT] 收到设备数据: ${topic}`, data);

    const deviceType = topic.split('/')[2];
    const deviceId = topic.split('/')[3];

    const deviceUpdate = {
      type: deviceType,
      id: deviceId,
      timestamp: new Date().toISOString(),
      data: data
    };

    if (this.io) {
      this.io.emit('mqttDeviceData', deviceUpdate);
    }
  }

  handleAlert(topic, data) {
    console.log(`[MQTT] 收到告警: ${topic}`, data);

    if (this.io) {
      this.io.emit('mqttAlert', {
        topic,
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  startBroker() {
    return new Promise((resolve, reject) => {
      const server = net.createServer(this.broker.handle);

      server.listen(MQTT_PORT, () => {
        console.log(`[MQTT] Broker 已启动，端口: ${MQTT_PORT}`);
        resolve();
      });

      server.on('error', (err) => {
        console.error('[MQTT] Broker 错误:', err);
        reject(err);
      });
    });
  }

  startWebSocketBridge() {
    const wss = new WebSocket.Server({ port: WS_PORT });

    wss.on('connection', (ws) => {
      console.log(`[MQTT-WS] WebSocket 客户端连接`);
      this.wsClients.add(ws);

      // 连接建立后立即推送当前聚合数据（小程序页面初始渲染用）
      ws.send(JSON.stringify({
        type: 'initData',
        data: {
          sensorData: this.aggregatedSensorData,
          irrigationStatus: this.aggregatedIrrigationStatus
        }
      }));

      ws.on('message', (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          const { action, topic, payload, command, data } = parsed;

          if (action === 'publish') {
            this.publish(topic, payload);
          } else if (action === 'subscribe') {
            this.subscribe(topic, ws);
          } else if (action === 'controlIrrigation') {
            const cmd = command && command.action;
            if (cmd === 'start' || cmd === 'stop') {
              const st = this.aggregatedIrrigationStatus;
              st.status = cmd === 'start' ? '运行中' : '待机';
              if (cmd === 'start') {
                st.lastIrrigation = new Date().toLocaleString('zh-CN', { hour12: false });
              }
              this.broadcastWS({ type: 'irrigationStatusUpdate', data: st });
              this.publish('farm/irrigation/control', { action: cmd });
            }
          } else if (action === 'updateIrrigationStatus') {
            if (data && typeof data.manualMode === 'boolean') {
              this.aggregatedIrrigationStatus.manualMode = data.manualMode;
              this.broadcastWS({
                type: 'irrigationStatusUpdate',
                data: this.aggregatedIrrigationStatus
              });
            }
          }
        } catch (error) {
          console.error('[MQTT-WS] 消息解析错误:', error);
        }
      });

      ws.on('close', () => {
        console.log(`[MQTT-WS] WebSocket 客户端断开`);
        this.wsClients.delete(ws);
      });

      ws.on('error', () => {
        this.wsClients.delete(ws);
      });
    });

    console.log(`[MQTT-WS] WebSocket 桥接已启动，端口: ${WS_PORT}`);
  }

  publish(topic, message) {
    const payload = JSON.stringify(message);
    this.broker.publish({
      topic,
      payload: Buffer.from(payload),
      qos: 0,
      retain: false,
      cmd: 'publish',
      dup: false
    }, (err) => {
      if (err) {
        console.error(`[MQTT] 发布失败 [${topic}]:`, err);
      } else {
        console.log(`[MQTT] 已发布 [${topic}]:`, message);
      }
    });
  }

  subscribe(topic, client = null) {
    this.broker.subscribe({
      topic,
      qos: 0
    }, (err) => {
      if (err) {
        console.error(`[MQTT] 订阅失败 [${topic}]:`, err);
      } else {
        console.log(`[MQTT] 已订阅 [${topic}]`);
      }
    });
  }

  publishDeviceCommand(deviceId, command) {
    const topic = `farm/device/control/${deviceId}`;
    this.publish(topic, {
      command,
      timestamp: new Date().toISOString(),
      source: 'server'
    });
  }

  publishIrrigationCommand(zoneId, action, params = {}) {
    const topic = `farm/irrigation/${zoneId}/control`;
    this.publish(topic, {
      action,
      ...params,
      timestamp: new Date().toISOString(),
      source: 'server'
    });
  }

  publishSensorConfig(sensorId, config) {
    const topic = `farm/sensor/config/${sensorId}`;
    this.publish(topic, {
      config,
      timestamp: new Date().toISOString(),
      source: 'server'
    });
  }

  getBroker() {
    return this.broker;
  }
}

class MQTTClient {
  constructor(brokerUrl, options = {}) {
    this.brokerUrl = brokerUrl;
    this.options = options;
    this.client = null;
    this.subscriptions = new Map();
    this.onMessageCallback = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(this.brokerUrl, this.options);

      this.client.on('connect', () => {
        console.log(`[MQTT-Client] 已连接到: ${this.brokerUrl}`);
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('[MQTT-Client] 连接错误:', err);
        reject(err);
      });

      this.client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          this.handleMessage(topic, payload);
        } catch (error) {
          this.handleMessage(topic, message.toString());
        }
      });

      this.client.on('offline', () => {
        console.log('[MQTT-Client] 已离线');
      });

      this.client.on('reconnect', () => {
        console.log('[MQTT-Client] 正在重连...');
      });
    });
  }

  subscribe(topic, callback) {
    this.client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`[MQTT-Client] 已订阅: ${topic}`);
        this.subscriptions.set(topic, callback);
      }
    });
  }

  unsubscribe(topic) {
    this.client.unsubscribe(topic, (err) => {
      if (!err) {
        console.log(`[MQTT-Client] 已取消订阅: ${topic}`);
        this.subscriptions.delete(topic);
      }
    });
  }

  publish(topic, message) {
    const payload = JSON.stringify(message);
    this.client.publish(topic, payload, (err) => {
      if (err) {
        console.error(`[MQTT-Client] 发布失败 [${topic}]:`, err);
      }
    });
  }

  handleMessage(topic, payload) {
    const callback = this.subscriptions.get(topic);
    if (callback) {
      callback(topic, payload);
    }
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      console.log('[MQTT-Client] 已断开连接');
    }
  }
}

class SensorSimulator {
  constructor(mqttServer) {
    this.mqttServer = mqttServer;
    this.intervals = [];
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervals.push(setInterval(() => {
      this.publishSoilSensorData();
    }, 5000));

    this.intervals.push(setInterval(() => {
      this.publishWeatherSensorData();
    }, 8000));

    this.intervals.push(setInterval(() => {
      this.publishWaterSensorData();
    }, 10000));

    this.intervals.push(setInterval(() => {
      this.publishIrrigationStatus();
    }, 15000));

    console.log('[Simulator] 传感器数据模拟器已启动');
  }

  stop() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.isRunning = false;
    console.log('[Simulator] 传感器数据模拟器已停止');
  }

  publishSoilSensorData() {
    const sensorId = 'soil_001';
    const data = {
      temperature: 20 + Math.random() * 5,
      moisture: 55 + Math.random() * 15,
      ph: 6 + Math.random() * 1.5,
      nitrogen: 80 + Math.random() * 40,
      phosphorus: 40 + Math.random() * 30,
      potassium: 150 + Math.random() * 50
    };

    this.mqttServer.publish(`farm/sensor/soil/${sensorId}`, data);
  }

  publishWeatherSensorData() {
    const sensorId = 'weather_001';
    const data = {
      airTemperature: 22 + Math.random() * 8,
      airHumidity: 50 + Math.random() * 30,
      lightIntensity: 30000 + Math.random() * 50000,
      windSpeed: 1 + Math.random() * 5,
      rainfall: Math.random() > 0.9 ? Math.random() * 10 : 0,
      uvIndex: 3 + Math.random() * 5
    };

    this.mqttServer.publish(`farm/sensor/weather/${sensorId}`, data);
  }

  publishWaterSensorData() {
    const sensorId = 'water_001';
    const data = {
      temperature: 18 + Math.random() * 4,
      dissolvedOxygen: 6 + Math.random() * 4,
      ph: 6.5 + Math.random() * 1.5,
      turbidity: 10 + Math.random() * 30,
      conductivity: 400 + Math.random() * 200
    };

    this.mqttServer.publish(`farm/sensor/water/${sensorId}`, data);
  }

  publishIrrigationStatus() {
    const zones = ['zone_a', 'zone_b', 'zone_c', 'zone_d'];

    zones.forEach(zoneId => {
      const data = {
        status: Math.random() > 0.8 ? 'running' : 'idle',
        flowRate: Math.random() > 0.8 ? 10 + Math.random() * 5 : 0,
        pressure: 2 + Math.random() * 1,
        valveStatus: Math.random() > 0.5 ? 'open' : 'closed'
      };

      this.mqttServer.publish(`farm/irrigation/${zoneId}/status`, data);
    });
  }
}

module.exports = {
  MQTTServer,
  MQTTClient,
  SensorSimulator
};