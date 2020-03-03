const app = getApp();
Page({
  data: {
    path: ''
  },
  onLoad: function (options) {
    this.setData({
      path: options.url
    })
    // app.showLoading();
  },
  loadFn(e) {
    // wx.hideLoading();
  },
  errorFn(e) {
    // wx.hideLoading();
    // modalTip('加载失败')
  }
})