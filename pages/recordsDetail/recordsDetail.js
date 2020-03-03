const app = getApp(),
      _api = app.api;
import drawQrcode from '../../utils/qresm.js'
Page({
  data: {
      recordsType: '',
      recordsId: '',
      isJump: false,
      tableData: {}
  },
  onLoad: function (options){
    this.setData({
      recordsType:  options.recordsType,
      recordsId: options.recordsId
    })
    wx.setStorageSync('recordsType', options.recordsType)
    wx.setStorageSync('recordsId', options.recordsId)
    this.getData();
  },
  onShow: function () {
    let _self =this;
    setTimeout(function () {
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: JSON.stringify(_self.data.tableData)
      })
      }, 500)
  },
  getData: function () {
    let _self = this,
        recordsType = wx.getStorageSync('recordsType'),
        recordsId = wx.getStorageSync('recordsId');
    app.showLoading();
    wx.request({
      url: _api + '/mini/rights/use',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        param: {
          goodsSubtype: recordsType,
          id:recordsId
        }
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        if(res.data.code === '0'){
          _self.setData({
            tableData: res.data.result
          })
        } else {
          app.modalTip(res.data.message)
        }
      }
    })
  },
  // 复制卡号
  cardNumFn: function (e) {
   let cardNums = e.currentTarget.dataset.cards;
    wx.setClipboardData({
      data: cardNums,
      success (res) {
        app.modalTip(res.data)
      }
    })
  },
  // 复制密码
  pwdNumFn: function (e) {
    let pwd = e.currentTarget.dataset.pwd;
     wx.setClipboardData({
       data: pwd,
       success (res) {
         app.modalTip(res.data)
       }
     })
   },
  // 取消立即使用
  cancleJump: function () {
    this.setData({
      isJump: false
     })
  },
  // 立即跳转
  sureJump: function () {
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
  useNowFn: function () {
   this.setData({
    isJump: true
   })
  }
})