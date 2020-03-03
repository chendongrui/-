const app = getApp(),
      _api = app.api;
Page({
  data: {
    tableData: {}
  },
  onLoad: function (options) {
     this.setData({
      getData: options.commodId
    })
    this.onInit();
  },
  onInit: function () {
    app.showLoading();
    let _self = this;
    wx.request({
      url: _api + '/mini/rights/usestore',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        param: _self.data.getData
      },
      method:'POST',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code === '0'){
           _self.setData({
            tableData:{
              getData: res.data.result.usableStoreContent.split(','),
              isHasData: false
            }
           })
        } else {
          app.modalTip(res.data.message)
        }
      }
    })
  }
})