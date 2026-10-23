const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const usersRouter = require('./routes/users');
const cropsRouter = require('./routes/crops');
const irrigationRouter = require('./routes/irrigation');
const settingsRouter = require('./routes/settings');
const devicesRouter = require('./routes/devices');
const farmRouter = require('./routes/farm');
const aiRouter = require('./routes/ai');
const { MQTTServer, SensorSimulator } = require('./services/mqtt');
const { initializeData } = require('./data/storage');
const iotModule = require('./routes/iot');
const iotRouter = iotModule;
const { setIoTServices } = iotModule;

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: '请求过于频繁，请稍后再试' }
});

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '后端服务正常运行' });
});

app.use('/api/settings', settingsRouter);
app.use('/api/crops', cropsRouter);
app.use('/api/irrigation', irrigationRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/farm', farmRouter);
app.use('/api/ai', aiRouter);
app.use('/api/iot', iotRouter);
app.use('/api', usersRouter);

initializeData();

const sensorData = {
  soilMoisture: 65,
  soilTemperature: 22,
  soilPh: 6.5,
  soilNutrient: 1200,
  airTemperature: 25,
  airHumidity: 60,
  lightIntensity: 80000,
  windSpeed: 3.5,
  waterTemperature: 20,
  dissolvedOxygen: 8.5,
  waterPh: 7.0,
  conductivity: 500
};

const irrigationStatus = {
  status: '待机',
  lastIrrigation: '2026-03-09 08:00',
  nextIrrigation: '2026-03-09 18:00',
  todayWaterUsage: 120,
  manualMode: false
};

io.on('connection', (socket) => {
  console.log('客户端已连接:', socket.id);

  socket.emit('initData', { sensorData, irrigationStatus });

  socket.on('updateSensorData', (data) => {
    Object.assign(sensorData, data);
    io.emit('sensorDataUpdate', sensorData);
  });

  socket.on('updateIrrigationStatus', (data) => {
    Object.assign(irrigationStatus, data);
    io.emit('irrigationStatusUpdate', irrigationStatus);
  });

  socket.on('controlIrrigation', (command) => {
    if (command.action === 'start') {
      irrigationStatus.status = '运行中';
    } else if (command.action === 'stop') {
      irrigationStatus.status = '待机';
    }
    io.emit('irrigationStatusUpdate', irrigationStatus);
  });

  socket.on('disconnect', () => {
    console.log('客户端已断开:', socket.id);
  });
});

setInterval(() => {
  sensorData.soilMoisture = 60 + Math.random() * 10;
  sensorData.soilTemperature = 20 + Math.random() * 5;
  sensorData.airTemperature = 23 + Math.random() * 4;
  sensorData.airHumidity = 55 + Math.random() * 10;
  sensorData.lightIntensity = 70000 + Math.random() * 20000;
  io.emit('sensorDataUpdate', sensorData);
}, 3000);

const mqttServer = new MQTTServer();
const sensorSimulator = new SensorSimulator(mqttServer);

mqttServer.initialize(io);

mqttServer.startBroker().then(() => {
  console.log('MQTT Broker 已启动，端口: 1883');
  sensorSimulator.start();
}).catch(err => {
  console.error('MQTT Broker 启动失败:', err);
});

mqttServer.startWebSocketBridge();

setIoTServices(mqttServer, sensorSimulator);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器正在运行，地址: http://0.0.0.0:${PORT}`);
  console.log(`WebSocket服务已启动`);
  console.log(`API文档地址: http://0.0.0.0:${PORT}/api/health`);
});