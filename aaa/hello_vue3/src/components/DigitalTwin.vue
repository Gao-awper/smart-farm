<template>
  <div class="visualization-container">
    <div class="scene-container" ref="sceneContainer"></div>

    <div class="control-panel">
      <h3>🎮 场景控制</h3>
      <div class="control-group">
        <label>视角</label>
        <button @click="setCameraView('top')">俯视图</button>
        <button @click="setCameraView('front')">正视图</button>
        <button @click="setCameraView('isometric')">等距视图</button>
      </div>
      <div class="control-group">
        <label>显示</label>
        <button @click="toggleLayer('fields')" :class="{ active: showFields }">地块</button>
        <button @click="toggleLayer('devices')" :class="{ active: showDevices }">设备</button>
        <button @click="toggleLayer('labels')" :class="{ active: showLabels }">数据标签</button>
      </div>
      <div class="control-group">
        <label>动画</label>
        <button @click="toggleRotation" :class="{ active: isRotating }">
          {{ isRotating ? '停止旋转' : '自动旋转' }}
        </button>
      </div>
    </div>

    <div class="data-overlay">
      <div class="data-card">
        <h4>🌡️ 环境数据</h4>
        <div class="data-row">
          <span>空气温度</span>
          <span class="value">{{ sensorData.airTemperature.toFixed(1) }}°C</span>
        </div>
        <div class="data-row">
          <span>空气湿度</span>
          <span class="value">{{ sensorData.airHumidity.toFixed(1) }}%</span>
        </div>
        <div class="data-row">
          <span>光照强度</span>
          <span class="value">{{ Math.round(sensorData.lightIntensity / 1000) }}klux</span>
        </div>
      </div>

      <div class="data-card">
        <h4>💧 土壤数据</h4>
        <div class="data-row">
          <span>土壤湿度</span>
          <span class="value">{{ sensorData.soilMoisture.toFixed(1) }}%</span>
        </div>
        <div class="data-row">
          <span>土壤温度</span>
          <span class="value">{{ sensorData.soilTemperature.toFixed(1) }}°C</span>
        </div>
        <div class="data-row">
          <span>土壤pH</span>
          <span class="value">{{ sensorData.soilPh }}</span>
        </div>
      </div>

      <div class="data-card">
        <h4>灌溉状态</h4>
        <div class="status-indicator" :class="irrigationStatus.status === '运行中' ? 'active' : 'idle'">
          {{ irrigationStatus.status }}
        </div>
        <div class="data-row">
          <span>今日用水</span>
          <span class="value">{{ irrigationStatus.todayWaterUsage }}吨</span>
        </div>
      </div>
    </div>

    <div class="legend">
      <h4>图例</h4>
      <div class="legend-item">
        <span class="legend-color field"></span>
        <span>农田地块</span>
      </div>
      <div class="legend-item">
        <span class="legend-color sensor"></span>
        <span>传感器</span>
      </div>
      <div class="legend-item">
        <span class="legend-color irrigation"></span>
        <span>灌溉设备</span>
      </div>
      <div class="legend-item">
        <span class="legend-color warning"></span>
        <span>告警设备</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import webSocketService from '../utils/websocket';

const sceneContainer = ref(null);
const showFields = ref(true);
const showDevices = ref(true);
const showLabels = ref(true);
const isRotating = ref(false);

const sensorData = reactive({
  airTemperature: 25,
  airHumidity: 60,
  lightIntensity: 80000,
  soilMoisture: 65,
  soilTemperature: 22,
  soilPh: 6.5
});

const irrigationStatus = reactive({
  status: '待机',
  todayWaterUsage: 120
});

let dataSyncInterval = null;

// 从localStorage加载传感器数据
const loadSensorDataFromStorage = () => {
  const saved = localStorage.getItem('sensor_data');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.assign(sensorData, data);
      updateFieldColors();
    } catch (e) {
      console.error('加载传感器数据失败:', e);
    }
  }
};

// 从localStorage加载灌溉状态
const loadIrrigationStateFromStorage = () => {
  const saved = localStorage.getItem('irrigation_state');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.irrigationStatus) {
        irrigationStatus.status = data.irrigationStatus;
      }
      if (data.todayWaterUsage !== undefined) {
        irrigationStatus.todayWaterUsage = data.todayWaterUsage;
      }
    } catch (e) {
      console.error('加载灌溉状态失败:', e);
    }
  }
};

let scene, camera, renderer, controls;
let fieldGroup, deviceGroup, labelGroup;
let animationId = null;

const fields = [
  { id: 1, name: '东区小麦', x: -15, z: -10, width: 12, depth: 8, crop: 'wheat', moisture: 65 },
  { id: 2, name: '西区玉米', x: 5, z: -10, width: 14, depth: 8, crop: 'corn', moisture: 55 },
  { id: 3, name: '南区水稻', x: -15, z: 5, width: 12, depth: 10, crop: 'rice', moisture: 70 },
  { id: 4, name: '北区蔬菜', x: 5, z: 5, width: 14, depth: 10, crop: 'vegetable', moisture: 60 }
];

const devices = [
  { id: 'D001', name: '土壤传感器-东1', x: -12, z: -8, type: 'sensor', status: 'online' },
  { id: 'D002', name: '气象站-北1', x: 8, z: 7, type: 'weather_station', status: 'online' },
  { id: 'D003', name: '灌溉控制器-西1', x: 2, z: -8, type: 'irrigation', status: 'warning' },
  { id: 'D004', name: '水质监测-南1', x: -12, z: 8, type: 'water_sensor', status: 'online' }
];

const initScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);
  scene.fog = new THREE.Fog(0x1a1a2e, 50, 150);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(30, 40, 30);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  sceneContainer.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.2;

  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(30, 50, 30);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 150;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  scene.add(directionalLight);

  const gridHelper = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
  scene.add(gridHelper);

  fieldGroup = new THREE.Group();
  deviceGroup = new THREE.Group();
  labelGroup = new THREE.Group();
  scene.add(fieldGroup);
  scene.add(deviceGroup);
  scene.add(labelGroup);

  createFields();
  createDevices();
  createEnvironment();
};

const createFields = () => {
  fieldGroup.clear();

  fields.forEach(field => {
    const fieldGeometry = new THREE.BoxGeometry(field.width, 0.5, field.depth);
    const fieldColor = getCropColor(field.crop, field.moisture);
    const fieldMaterial = new THREE.MeshStandardMaterial({
      color: fieldColor,
      roughness: 0.8,
      metalness: 0.1
    });
    const fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
    fieldMesh.position.set(field.x, 0.25, field.z);
    fieldMesh.castShadow = true;
    fieldMesh.receiveShadow = true;
    fieldMesh.userData = { fieldData: field };
    fieldGroup.add(fieldMesh);

    const edgesGeometry = new THREE.EdgesGeometry(fieldGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x4ade80, opacity: 0.6, transparent: true });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    edges.position.copy(fieldMesh.position);
    fieldGroup.add(edges);

    const label = createTextSprite(field.name);
    label.position.set(field.x, 2, field.z);
    label.userData = { fieldId: field.id };
    labelGroup.add(label);
  });
};

const getCropColor = (crop, moisture) => {
  const baseColors = {
    wheat: 0xd4a574,
    corn: 0x7cb342,
    rice: 0x66bb6a,
    vegetable: 0x43a047
  };
  const baseColor = baseColors[crop] || 0x4ade80;
  const moistureFactor = moisture / 100;
  return new THREE.Color(baseColor).lerp(new THREE.Color(0x2d5016), 1 - moistureFactor);
};

const createDevices = () => {
  deviceGroup.clear();

  devices.forEach(device => {
    let deviceMesh;
    const isWarning = device.status === 'warning';

    switch (device.type) {
      case 'sensor':
        deviceMesh = createSensorModel(isWarning);
        break;
      case 'weather_station':
        deviceMesh = createWeatherStationModel();
        break;
      case 'irrigation':
        deviceMesh = createIrrigationModel(isWarning);
        break;
      case 'water_sensor':
        deviceMesh = createWaterSensorModel();
        break;
      default:
        deviceMesh = createSensorModel(false);
    }

    deviceMesh.position.set(device.x, 0, device.z);
    deviceMesh.userData = { deviceData: device };
    deviceGroup.add(deviceMesh);
  });
};

const createSensorModel = (isWarning) => {
  const group = new THREE.Group();

  const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 1;
  pole.castShadow = true;
  group.add(pole);

  const sensorGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.4);
  const sensorColor = isWarning ? 0xff4444 : 0x00ff88;
  const sensorMaterial = new THREE.MeshStandardMaterial({
    color: sensorColor,
    emissive: sensorColor,
    emissiveIntensity: 0.3
  });
  const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
  sensor.position.y = 2.2;
  sensor.castShadow = true;
  group.add(sensor);

  return group;
};

const createWeatherStationModel = () => {
  const group = new THREE.Group();

  const poleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 8);
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 1.5;
  pole.castShadow = true;
  group.add(pole);

  const boxGeometry = new THREE.BoxGeometry(1, 0.8, 0.6);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.y = 3.4;
  box.castShadow = true;
  group.add(box);

  const solarGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.5);
  const solarMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.9 });
  const solar = new THREE.Mesh(solarGeometry, solarMaterial);
  solar.position.set(0.6, 3.9, 0);
  solar.rotation.z = -0.3;
  group.add(solar);

  return group;
};

const createIrrigationModel = (isWarning) => {
  const group = new THREE.Group();

  const baseGeometry = new THREE.BoxGeometry(1.5, 0.5, 1.5);
  const baseColor = isWarning ? 0xff4444 : 0x4488ff;
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: baseColor,
    emissive: baseColor,
    emissiveIntensity: 0.2
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.25;
  base.castShadow = true;
  group.add(base);

  const pipeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
  const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
  pipe.position.set(0, 1.5, 0);
  group.add(pipe);

  const sprinklerGeometry = new THREE.ConeGeometry(0.3, 0.5, 8);
  const sprinklerMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const sprinkler = new THREE.Mesh(sprinklerGeometry, sprinklerMaterial);
  sprinkler.position.set(0, 2.75, 0);
  group.add(sprinkler);

  return group;
};

const createWaterSensorModel = () => {
  const group = new THREE.Group();

  const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 0.75;
  pole.castShadow = true;
  group.add(pole);

  const floatGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const floatMaterial = new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.8
  });
  const float = new THREE.Mesh(floatGeometry, floatMaterial);
  float.position.y = 1.75;
  group.add(float);

  return group;
};

const createEnvironment = () => {
  const treePositions = [
    [-30, 20], [30, 20], [-30, -20], [30, -20],
    [0, 30], [0, -30], [-25, 0], [25, 0]
  ];

  treePositions.forEach(([x, z]) => {
    const tree = createTree();
    tree.position.set(x, 0, z);
    scene.add(tree);
  });

  const pathShape = new THREE.Shape();
  pathShape.moveTo(-40, 0);
  pathShape.lineTo(40, 0);
  pathShape.lineTo(40, 3);
  pathShape.lineTo(-40, 3);
  pathShape.lineTo(-40, 0);

  const pathGeometry = new THREE.ShapeGeometry(pathShape);
  const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const path = new THREE.Mesh(pathGeometry, pathMaterial);
  path.position.set(0, 0.05, 0);
  path.rotation.x = -Math.PI / 2;
  scene.add(path);
};

const createTree = () => {
  const group = new THREE.Group();

  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 1.5;
  trunk.castShadow = true;
  group.add(trunk);

  const foliageGeometry = new THREE.SphereGeometry(2, 8, 8);
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.y = 4.5;
  foliage.castShadow = true;
  group.add(foliage);

  return group;
};

const createTextSprite = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;

  context.fillStyle = 'rgba(0, 0, 0, 0.7)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = 'bold 24px Arial';
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(4, 1, 1);

  return sprite;
};

const animate = () => {
  animationId = requestAnimationFrame(animate);

  if (isRotating.value) {
    scene.rotation.y += 0.002;
  }

  deviceGroup.children.forEach((device, index) => {
    device.children.forEach(child => {
      if (child.geometry && child.geometry.type === 'SphereGeometry') {
        child.position.y = 1.75 + Math.sin(Date.now() * 0.003 + index) * 0.1;
      }
    });
  });

  controls.update();
  renderer.render(scene, camera);
};

const handleResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

const setCameraView = (view) => {
  switch (view) {
    case 'top':
      camera.position.set(0, 80, 0);
      camera.lookAt(0, 0, 0);
      break;
    case 'front':
      camera.position.set(0, 20, 80);
      camera.lookAt(0, 0, 0);
      break;
    case 'isometric':
      camera.position.set(40, 40, 40);
      camera.lookAt(0, 0, 0);
      break;
  }
  controls.update();
};

const toggleLayer = (layer) => {
  switch (layer) {
    case 'fields':
      showFields.value = !showFields.value;
      fieldGroup.visible = showFields.value;
      break;
    case 'devices':
      showDevices.value = !showDevices.value;
      deviceGroup.visible = showDevices.value;
      break;
    case 'labels':
      showLabels.value = !showLabels.value;
      labelGroup.visible = showLabels.value;
      break;
  }
};

const toggleRotation = () => {
  isRotating.value = !isRotating.value;
};

const handleSensorDataUpdate = (data) => {
  Object.assign(sensorData, data);
  updateFieldColors();
};

const handleIrrigationStatusUpdate = (data) => {
  Object.assign(irrigationStatus, data);
};

const updateFieldColors = () => {
  fieldGroup.children.forEach(child => {
    if (child.userData.fieldData) {
      const field = child.userData.fieldData;
      const moisture = sensorData.soilMoisture + (Math.random() - 0.5) * 10;
      const newColor = getCropColor(field.crop, moisture);
      child.material.color = newColor;
    }
  });
};

onMounted(() => {
  initScene();
  animate();
  window.addEventListener('resize', handleResize);

  // 加载已保存的数据
  loadSensorDataFromStorage();
  loadIrrigationStateFromStorage();

  // 每2秒同步一次数据（备用方案）
  dataSyncInterval = setInterval(() => {
    loadSensorDataFromStorage();
    loadIrrigationStateFromStorage();
  }, 2000);

  webSocketService.connect('http://localhost:3000');
  webSocketService.on('sensorDataUpdate', handleSensorDataUpdate);
  webSocketService.on('irrigationStatusUpdate', handleIrrigationStatusUpdate);
  webSocketService.on('initData', (data) => {
    if (data.sensorData) handleSensorDataUpdate(data.sensorData);
    if (data.irrigationStatus) handleIrrigationStatusUpdate(data.irrigationStatus);
  });
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (dataSyncInterval) {
    clearInterval(dataSyncInterval);
  }
  if (renderer) {
    renderer.dispose();
  }
  window.removeEventListener('resize', handleResize);
  webSocketService.off('sensorDataUpdate', handleSensorDataUpdate);
  webSocketService.off('irrigationStatusUpdate', handleIrrigationStatusUpdate);
});
</script>

<style scoped>
.visualization-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a1a2e;
}

.scene-container {
  width: 100%;
  height: 100%;
}

.scene-container canvas {
  display: block;
}

.control-panel {
  position: absolute;
  top: 80px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  min-width: 200px;
}

.control-panel h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #4ade80;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #aaa;
}

.control-group button {
  background: #333;
  border: 1px solid #555;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.control-group button:hover {
  background: #444;
}

.control-group button.active {
  background: #2d5016;
  border-color: #4ade80;
}

.data-overlay {
  position: absolute;
  top: 80px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 250px;
}

.data-card {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 1rem;
  color: white;
}

.data-card h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: #4ade80;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  font-size: 0.85rem;
}

.data-row span:first-child {
  color: #aaa;
}

.data-row .value {
  color: #fff;
  font-weight: bold;
}

.status-indicator {
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.status-indicator.active {
  background: #22c55e;
  color: white;
}

.status-indicator.idle {
  background: #666;
  color: white;
}

.legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  min-width: 150px;
}

.legend h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: #4ade80;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0;
  font-size: 0.85rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.field {
  background: linear-gradient(135deg, #7cb342, #2d5016);
}

.legend-color.sensor {
  background: #00ff88;
}

.legend-color.irrigation {
  background: #4488ff;
}

.legend-color.warning {
  background: #ff4444;
}

@media (max-width: 768px) {
  .control-panel {
    top: auto;
    bottom: 100px;
    left: 10px;
    right: 10px;
    min-width: auto;
  }

  .data-overlay {
    top: 80px;
    right: 10px;
    left: 10px;
    max-width: none;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .data-card {
    flex: 1;
    min-width: 150px;
  }

  .legend {
    bottom: 20px;
    left: 10px;
    right: 10px;
    min-width: auto;
  }
}
</style>