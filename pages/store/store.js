Page({
  data: {
    showModal: false
  },
  goCodeFn: function () {
    let _self = this,
      _isReginter = wx.getStorageSync('isReginter'),
      _isLogin = wx.getStorageSync('isLogin');
      if (_isReginter && _isLogin) {
         wx.navigateTo({
           url: '../codePage/codePage',
         })
      } else {
         _self.setData({
           showModal: true
         })
      }
  },
  shutDown: function() {
    this.setData({
      showModal: false
    })
  },
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
})
