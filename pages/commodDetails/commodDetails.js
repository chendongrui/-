const app = getApp(),
      _api = app.api;
Page({
  data: {
    isChanges: false,
    againChange: false,
    failChange: false,
    noenough: false,
    tableData:{}, //页面绑定数据
    searchDataBuffer: {}, //页面查询数据缓存
    defaulImg: app.globalData.imageUrl,
    showModal:false
  },
  onLoad: function(options){
    wx.setStorageSync('commId', options.id)
    this.onInit()
  },
  onshow: function(){
     this.onInit()
  },
  onInit: function () {
    var _self= this,
        _commId = wx.getStorageSync('commId');
    app.showLoading();
    wx.request({
      url: _api + '/mini/rights/detail',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        param: _commId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success (res) {
        if(res.data.code === '0'){
          _self.setData({
            tableData: {
             commodData: res.data.result
            }
          })
          wx.hideLoading();
        } else {
          app.modalTip(res.data.message)
        }
      }
    })
  },
  // 未登录跳转小程序
  shutJump () {
    wx.navigateToMiniProgram({
      appId: 'wx7a6de25bce74d9c5', 
      path: '/supermarket/pages/home/user/center',
      extraData: {},
      envVersion: 'trial', //开发develop 体验trial 正式release
      success(res) {
           // 打开成功
        }
    }) 
  },
  shutDown: function(e) {
    this.setData({
      showModal: false
    })
  },
  // 立即兑换
  onChange: function (e) {
    var isLogin = wx.getStorageSync('isLogin'),
        isReginter = wx.getStorageSync('isReginter');
    if (isLogin == true && isReginter == true) {
      this.setData({
        isChanges: true,
        againChange: false,
        failChange: false,
        noenough: false,
        showModal:false,
      })
    } else {
       this.setData({
        showModal:true,
        isChanges: false,
        againChange: false,
        failChange: false,
        noenough: false
      })
    }
  },
  // 取消兑换
  cancleChange: function () {
    this.setData({
      isChanges: false,
      againChange: false,
      failChange: false,
      noenough: false
    })
  },
  // 确认兑换
  sureChanges: function () {
    app.showLoading();
    let _self = this,
        id = wx.getStorageSync('commId');
    wx.request({
      url: _api + '/mini/rights/receive',
      data:{
        param: {
          wxUserId: 2,
          rightsId: id
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success (res) {
        wx.hideLoading();
        if (res.data.code === '0'){
          _self.setData({
            againChange: true,
            isChanges: false,
            failChange: false,
            noenough: false
          })
        } else if (res.data.code === '-1022012001'){
          _self.setData({
            isChanges: false,
            againChange: false,
            failChange: false,
            noenough: true
          })
        } else {
          _self.setData({
            isChanges: false,
            againChange: false,
            failChange: true,
            noenough: false
          })
        }
      }
    })
  },
  //继续兑换
  againFn: function () {
    this.sureChanges()
  },
  // 兑换失败
  failFn: function () {
    this.setData({
      againChange: false,
      isChanges: false,
      failChange: false,
      noenough: false
    })
    this.onInit()
  }
})