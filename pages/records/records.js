const app = getApp(),
      _api = app.api;
Page({
  data: {
    tableData: {
      userd_status: '2',
      use_status: '0',
    },
    defaleStore:'../../assets/shops.png'
  },
  onLoad: function() {
  },
  onShow: function () {
    this.getData()
  },
  getData: function () {
    let _self = this;
    app.showLoading()
    wx.request({
      url: _api + '/mini/rights/exchange/record',
      data:{
        param: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:'POST',
      success: function(res) {
        wx.hideLoading()
        if (res.data.code === '0') {
          _self.setData({
            tableData: res.data.result
          })
        } else {
          app.modalTip(res.data.message)
        }
      }
    })
  }
})