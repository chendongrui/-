//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
  },
  onShow: function() {
    this.checkLogin(this);
  },
  checkLogin(_this) {
    let that = _this;
    wx.checkSession({
      success: function (res) {
        wx.getStorage({
          key: 'isLogin',
          success: function (res) {
          },
          fail: function (res) {
            that.loginFn(that)
          }
        })
      },
      fail: function (res) {
        that.loginFn(that)
      }
    })
  },
  loginFn(that) {
    wx.login({
      success: function (res) {
        let _code = res.code;
        if (_code) {
          wx.request({
            url: that.api + '/auth/login',
            data: {
             param: {
                  appId: that.appId,
                  code: _code,
                  state: 31
             }
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            method:'POST',
            success: function (res) {
              if (res.data.code === '0') {
                wx.setStorageSync('isReginter', true);
                wx.setStorageSync('isLogin', true);
              } else if (res.data.code === '-10500') {
                wx.setStorageSync('isReginter', false);
                wx.setStorageSync('isLogin', true)
              }else {
                wx.setStorageSync('isLogin', false);
                wx.setStorageSync('isReginter', false);
              }
            },
            fail: function (res) {
              app.modalTip('获取登录态失败！')
            }
          })
        } else {
          app.modalTip('获取临时登录凭证失败！')
        }
      },
      fail: function () {
        // that.modalTip('获取临时登录凭证失败！')
      }
    })
  },
  modalTip(txt, dur = 2500) {
    // 提示
    wx.showToast({
      title: txt,
      icon: 'none',
      mask: true,
      duration: dur
    })
  },
  showLoading(param = '加载中...') {
    // loading加载
    wx.showLoading({
      title: param,
      mask: true,
      success: function (res) {
      }
    })
  },
  globalData: {
    userInfo: null,
    imageUrl: '../../assets/list_things.png',
  },
  // api: 'http://192.168.10.154:8089/himapi',
  api: 'http://m1.viwor.net:11549/himapi',
  appId: "wx7a6de25bce74d9c5",
})