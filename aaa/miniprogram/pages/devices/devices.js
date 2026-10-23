const { farmApi } = require('../../utils/api')

const defaultDevices = [
  { id: 'D001', name: '土壤湿度传感器-东1', type: '传感器', location: '东区-1号地块', status: 'online', lastUpdate: '2分钟前', battery: 85 },
  { id: 'D002', name: '土壤温度传感器-东2', type: '传感器', location: '东区-2号地块', status: 'online', lastUpdate: '5分钟前', battery: 72 },
  { id: 'D003', name: '灌溉控制器-西1', type: '控制器', location: '西区-1号地块', status: 'warning', lastUpdate: '1小时前', battery: 45 },
  { id: 'D004', name: '气象站-北1', type: '气象站', location: '北区-中央广场', status: 'online', lastUpdate: '1分钟前', battery: 90 },
  { id: 'D005', name: '水质监测仪-南1', type: '监测仪', location: '南区-水库', status: 'offline', lastUpdate: '3天前', battery: 20 },
  { id: 'D006', name: '光照传感器-东3', type: '传感器', location: '东区-3号地块', status: 'online', lastUpdate: '3分钟前', battery: 68 },
  { id: 'D007', name: '灌溉控制器-西2', type: '控制器', location: '西区-2号地块', status: 'online', lastUpdate: '10分钟前', battery: 80 },
  { id: 'D008', name: 'CO2传感器-温室A', type: '传感器', location: '温室A区', status: 'warning', lastUpdate: '30分钟前', battery: 55 }
]

Page({
  data: {
    currentFilter: 'all',
    searchText: '',
    filteredDevices: defaultDevices
  },

  onLoad() {
    this.devices = defaultDevices
    this.loadDevices()
  },

  loadDevices() {
    farmApi.devices().then((res) => {
      const list = Array.isArray(res) ? res : (res.data || [])
      const mapped = list.map((d, i) => ({
        id: String(d.deviceId || d.id || ('D' + (i + 1))),
        name: d.name || d.deviceName || ('设备-' + (i + 1)),
        type: d.type || d.deviceType || '传感器',
        location: d.location || d.installLocation || '未设置',
        status: ['online', 'offline', 'warning'].includes(d.status) ? d.status : 'online',
        lastUpdate: d.lastUpdate || d.updatedAt || '刚刚',
        battery: d.battery != null ? d.battery : 80
      })).filter((d) => d.id && d.name)
      if (mapped.length > 0) {
        this.devices = mapped
        this.updateFiltered()
      }
    }).catch(() => {
      console.log('设备接口不可用，使用默认设备列表')
    })
  },

  updateFiltered() {
    const filter = this.data.currentFilter
    const keyword = (this.data.searchText || '').trim().toLowerCase()
    let list = this.devices
    if (filter !== 'all') {
      list = list.filter((d) => d.status === filter)
    }
    if (keyword) {
      list = list.filter((d) => (d.name + d.id + d.location).toLowerCase().includes(keyword))
    }
    this.setData({ filteredDevices: list })
  },

  onSearchInput(e) {
    this.setData({ searchText: e.detail.value })
    this.updateFiltered()
  },

  setFilter(e) {
    this.setData({ currentFilter: e.currentTarget.dataset.filter })
    this.updateFiltered()
  },

  viewDevice(e) {
    const deviceId = e.currentTarget.dataset.id
    wx.showToast({ title: '查看设备 ' + deviceId, icon: 'none' })
  },

  controlDevice(e) {
    const deviceId = e.currentTarget.dataset.id
    wx.showToast({ title: '控制设备 ' + deviceId, icon: 'none' })
  },

  addDevice() {
    wx.scanCode({
      success: () => {
        wx.showToast({ title: '绑定成功', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '扫码失败', icon: 'none' })
      }
    })
  }
})
