const app = getApp()

Page({
  data: {
    isConnected: false,
    sensorData: {
      soilMoistureDisplay: '65.0',
      soilTemperatureDisplay: '22.0',
      soilPh: '6.5',
      soilNutrient: 1200,
      airTemperatureDisplay: '25.0',
      airHumidityDisplay: '60.0',
      lightDisplay: '80',
      windSpeedDisplay: '3.5',
      waterTemperatureDisplay: '20.0',
      dissolvedOxygenDisplay: '8.5',
      waterPh: '7.0',
      conductivity: 500
    },
    soilMoistureHeight: 65,
    soilTempHeight: 63,
    airTempHeight: 71,
    humidityHeight: 60,
    lightHeight: 80
  },

  onLoad() {
    this.socketTask = app.createSocket({
      initData: (data) => {
        if (data.sensorData) this.applySensorData(data.sensorData)
      },
      sensorDataUpdate: (data) => this.applySensorData(data)
    })

    this.socketTask.onOpen(() => {
      this.setData({ isConnected: true })
    })

    this.socketTask.onClose(() => {
      this.setData({ isConnected: false })
    })

    this.socketTask.onError(() => {
      this.setData({ isConnected: false })
    })
  },

  onUnload() {
    if (this.socketTask) this.socketTask.close()
  },

  applySensorData(d) {
    this.setData({
      sensorData: {
        soilMoistureDisplay: Number(d.soilMoisture).toFixed(1),
        soilTemperatureDisplay: Number(d.soilTemperature).toFixed(1),
        soilPh: String(d.soilPh),
        soilNutrient: d.soilNutrient,
        airTemperatureDisplay: Number(d.airTemperature).toFixed(1),
        airHumidityDisplay: Number(d.airHumidity).toFixed(1),
        lightDisplay: String(Math.round(d.lightIntensity / 1000)),
        windSpeedDisplay: Number(d.windSpeed).toFixed(1),
        waterTemperatureDisplay: Number(d.waterTemperature).toFixed(1),
        dissolvedOxygenDisplay: Number(d.dissolvedOxygen).toFixed(1),
        waterPh: String(d.waterPh),
        conductivity: d.conductivity
      },
      soilMoistureHeight: Math.min(100, d.soilMoisture),
      soilTempHeight: Math.min(100, (d.soilTemperature / 35) * 100),
      airTempHeight: Math.min(100, (d.airTemperature / 35) * 100),
      humidityHeight: Math.min(100, d.airHumidity),
      lightHeight: Math.min(100, (d.lightIntensity / 100000) * 100)
    })
  }
})
