const express = require('express');
const router = express.Router();

let mqttService = null;
let sensorSimulator = null;

const deviceRegistry = {
  sensors: [
    {
      id: 'soil_001',
      name: '土壤传感器-东区',
      type: 'soil',
      location: { zone: '东区', x: -12, y: -8 },
      status: 'online',
      lastUpdate: new Date().toISOString(),
      config: { interval: 5000, enabled: true }
    },
    {
      id: 'weather_001',
      name: '气象站-北区',
      type: 'weather',
      location: { zone: '北区', x: 8, y: 7 },
      status: 'online',
      lastUpdate: new Date().toISOString(),
      config: { interval: 8000, enabled: true }
    },
    {
      id: 'water_001',
      name: '水质监测-南区',
      type: 'water',
      location: { zone: '南区', x: -12, y: 8 },
      status: 'online',
      lastUpdate: new Date().toISOString(),
      config: { interval: 10000, enabled: true }
    },
    {
      id: 'soil_002',
      name: '土壤传感器-西区',
      type: 'soil',
      location: { zone: '西区', x: 2, y: -8 },
      status: 'offline',
      lastUpdate: new Date().toISOString(),
      config: { interval: 5000, enabled: false }
    }
  ],
  devices: [
    {
      id: 'irr_pump_001',
      name: '灌溉水泵-主',
      type: 'pump',
      location: { zone: '控制室' },
      status: 'idle',
      lastUpdate: new Date().toISOString(),
      config: { maxFlowRate: 50, enabled: true }
    },
    {
      id: 'irr_valve_001',
      name: '灌溉阀门-东区',
      type: 'valve',
      location: { zone: '东区' },
      status: 'closed',
      lastUpdate: new Date().toISOString(),
      config: { flowRate: 10, enabled: true }
    },
    {
      id: 'irr_valve_002',
      name: '灌溉阀门-西区',
      type: 'valve',
      location: { zone: '西区' },
      status: 'closed',
      lastUpdate: new Date().toISOString(),
      config: { flowRate: 12, enabled: true }
    },
    {
      id: 'light_001',
      name: '补光灯-育苗棚',
      type: 'light',
      location: { zone: '育苗区' },
      status: 'off',
      lastUpdate: new Date().toISOString(),
      config: { intensity: 100, enabled: true }
    },
    {
      id: 'fan_001',
      name: '通风扇-大棚1',
      type: 'fan',
      location: { zone: '大棚1' },
      status: 'off',
      lastUpdate: new Date().toISOString(),
      config: { speed: 3, enabled: true }
    }
  ],
  alerts: []
};

function setIoTServices(mqtt, simulator) {
  mqttService = mqtt;
  sensorSimulator = simulator;
  console.log('[IoT] 服务已初始化');
}

router.get('/devices', (req, res) => {
  res.json({
    status: 'success',
    data: {
      sensors: deviceRegistry.sensors,
      devices: deviceRegistry.devices,
      total: deviceRegistry.sensors.length + deviceRegistry.devices.length
    }
  });
});

router.get('/sensors', (req, res) => {
  res.json({
    status: 'success',
    data: deviceRegistry.sensors
  });
});

router.get('/devices/control', (req, res) => {
  res.json({
    status: 'success',
    data: deviceRegistry.devices
  });
});

router.get('/sensors/:id', (req, res) => {
  const sensor = deviceRegistry.sensors.find(s => s.id === req.params.id);
  if (!sensor) {
    return res.status(404).json({ status: 'error', message: '传感器不存在' });
  }
  res.json({ status: 'success', data: sensor });
});

router.get('/devices/control/:id', (req, res) => {
  const device = deviceRegistry.devices.find(d => d.id === req.params.id);
  if (!device) {
    return res.status(404).json({ status: 'error', message: '设备不存在' });
  }
  res.json({ status: 'success', data: device });
});

router.put('/sensors/:id/config', (req, res) => {
  const sensor = deviceRegistry.sensors.find(s => s.id === req.params.id);
  if (!sensor) {
    return res.status(404).json({ status: 'error', message: '传感器不存在' });
  }

  const { interval, enabled } = req.body;
  if (interval !== undefined) sensor.config.interval = interval;
  if (enabled !== undefined) sensor.config.enabled = enabled;
  sensor.lastUpdate = new Date().toISOString();

  if (mqttService) {
    mqttService.publishSensorConfig(sensor.id, sensor.config);
  }

  res.json({ status: 'success', data: sensor });
});

router.post('/devices/control/:id/command', (req, res) => {
  const device = deviceRegistry.devices.find(d => d.id === req.params.id);
  if (!device) {
    return res.status(404).json({ status: 'error', message: '设备不存在' });
  }

  const { command, params } = req.body;

  if (mqttService) {
    mqttService.publishDeviceCommand(device.id, { command, params });
  }

  switch (device.type) {
    case 'valve':
      if (command === 'open') device.status = 'open';
      else if (command === 'close') device.status = 'closed';
      break;
    case 'pump':
      if (command === 'start') device.status = 'running';
      else if (command === 'stop') device.status = 'idle';
      break;
    case 'light':
      if (command === 'on') device.status = 'on';
      else if (command === 'off') device.status = 'off';
      if (params && params.intensity) device.config.intensity = params.intensity;
      break;
    case 'fan':
      if (command === 'start') device.status = 'running';
      else if (command === 'stop') device.status = 'off';
      if (params && params.speed) device.config.speed = params.speed;
      break;
  }

  device.lastUpdate = new Date().toISOString();

  res.json({
    status: 'success',
    data: {
      deviceId: device.id,
      command,
      result: '命令已发送',
      deviceStatus: device.status
    }
  });
});

router.post('/irrigation/:zone/command', (req, res) => {
  const { zone } = req.params;
  const { action, duration, waterAmount } = req.body;

  if (mqttService) {
    mqttService.publishIrrigationCommand(zone, action, { duration, waterAmount });
  }

  const zoneDevices = deviceRegistry.devices.filter(d => d.location.zone === zone);
  zoneDevices.forEach(device => {
    if (device.type === 'valve') {
      device.status = action === 'start' ? 'open' : 'closed';
    } else if (device.type === 'pump') {
      device.status = action === 'start' ? 'running' : 'idle';
    }
    device.lastUpdate = new Date().toISOString();
  });

  res.json({
    status: 'success',
    data: {
      zone,
      action,
      result: '灌溉命令已发送',
      timestamp: new Date().toISOString()
    }
  });
});

router.get('/alerts', (req, res) => {
  const { limit = 50, type, severity } = req.query;

  let alerts = [...deviceRegistry.alerts];

  if (type) {
    alerts = alerts.filter(a => a.type === type);
  }
  if (severity) {
    alerts = alerts.filter(a => a.severity === severity);
  }

  alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    status: 'success',
    data: alerts.slice(0, parseInt(limit))
  });
});

router.post('/alerts/:id/acknowledge', (req, res) => {
  const alert = deviceRegistry.alerts.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ status: 'error', message: '告警不存在' });
  }

  alert.acknowledged = true;
  alert.acknowledgedAt = new Date().toISOString();

  res.json({ status: 'success', data: alert });
});

router.get('/statistics', (req, res) => {
  const onlineSensors = deviceRegistry.sensors.filter(s => s.status === 'online').length;
  const totalSensors = deviceRegistry.sensors.length;

  const onlineDevices = deviceRegistry.devices.filter(d => d.status !== 'offline').length;
  const totalDevices = deviceRegistry.devices.length;

  const unacknowledgedAlerts = deviceRegistry.alerts.filter(a => !a.acknowledged).length;

  res.json({
    status: 'success',
    data: {
      sensors: {
        total: totalSensors,
        online: onlineSensors,
        offline: totalSensors - onlineSensors,
        onlineRate: ((onlineSensors / totalSensors) * 100).toFixed(1)
      },
      devices: {
        total: totalDevices,
        online: onlineDevices,
        offline: totalDevices - onlineDevices,
        onlineRate: ((onlineDevices / totalDevices) * 100).toFixed(1)
      },
      alerts: {
        total: deviceRegistry.alerts.length,
        unacknowledged: unacknowledgedAlerts,
        critical: deviceRegistry.alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length
      },
      simulator: sensorSimulator ? sensorSimulator.isRunning : false
    }
  });
});

router.post('/simulator/start', (req, res) => {
  if (sensorSimulator) {
    sensorSimulator.start();
    res.json({ status: 'success', message: '模拟器已启动' });
  } else {
    res.status(500).json({ status: 'error', message: '模拟器未初始化' });
  }
});

router.post('/simulator/stop', (req, res) => {
  if (sensorSimulator) {
    sensorSimulator.stop();
    res.json({ status: 'success', message: '模拟器已停止' });
  } else {
    res.status(500).json({ status: 'error', message: '模拟器未初始化' });
  }
});

router.get('/simulator/status', (req, res) => {
  res.json({
    status: 'success',
    data: {
      running: sensorSimulator ? sensorSimulator.isRunning : false
    }
  });
});

function addAlert(type, severity, message, deviceId) {
  const alert = {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    message,
    deviceId,
    timestamp: new Date().toISOString(),
    acknowledged: false
  };
  deviceRegistry.alerts.unshift(alert);

  if (deviceRegistry.alerts.length > 1000) {
    deviceRegistry.alerts = deviceRegistry.alerts.slice(0, 1000);
  }

  return alert;
}

function updateDeviceStatus(deviceId, status) {
  const device = deviceRegistry.devices.find(d => d.id === deviceId);
  if (device) {
    device.status = status;
    device.lastUpdate = new Date().toISOString();
  }
}

function updateSensorStatus(sensorId, status) {
  const sensor = deviceRegistry.sensors.find(s => s.id === sensorId);
  if (sensor) {
    sensor.status = status;
    sensor.lastUpdate = new Date().toISOString();
  }
}

module.exports = router;
module.exports.deviceRegistry = deviceRegistry;
module.exports.addAlert = addAlert;
module.exports.updateDeviceStatus = updateDeviceStatus;
module.exports.updateSensorStatus = updateSensorStatus;
module.exports.setIoTServices = setIoTServices;