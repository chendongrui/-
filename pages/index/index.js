//index.js
//获取应用实例
const app = getApp(),
      _api = app.api;
import  barcode  from '../../utils/barcode.js';
Page({
  data: {
    showModal: false,
    arr: [],
    code: 'E01181016286106',
    tableData:{}, //页面绑定数据
    defaulImg: app.globalData.imageUrl,
    isHasData: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isReginter: false,
    defaluteHead: '../../assets/index_user.png',
    isLogin: wx.getStorageSync('isLogin') == '' ||　wx.getStorageSync('isLogin') == 'undefined' || wx.getStorageSync('isLogin') == 'false' ? false : true,
    addressTxt: '',
    addressId: '',
    loginInfo:{}
  },
  onLoad: function (options) {
  },
  onShow: function () {
    let _self = this,
        addResSSval = wx.getStorageSync('addressTxt'),
        addressIdVal = wx.getStorageSync('addressId');
      _self.setData({
        addressTxt: addResSSval == ''　|| addResSSval == 'undefined' ? '' : addResSSval,
        addressId:  addressIdVal == '' || addressIdVal == 'undefined' ? '' : addressIdVal
      })
      _self.bannerFn();
      _self.commoedTypeFn();
      if (_self.data.isReginter == true && _self.data.isLogin == true) {
        _self.barCodeFn()
      }
  },
  barCodeFn: function () {
    let _self = this,
        barCodeVal = _self.data.loginInfo.memberCard;
    wx.request({
      url: _api + '/auth/getBarCode',
      data: {
        content: barCodeVal
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:'GET',
      success: function (res) {
        if (res.data.code === '0') {
          barcode.code128(wx.createCanvasContext('barcode'), barCodeVal, 15, 14);
        } else {
          // app.modalTip(res.data.message)
        }
      }
    })
  },
  // 用户登录，不是会员弹出框
  onLogin: function(e) {
    this.setData({
      showModal: true
    })
  },
  shutDown: function(e) {
    let _self = this,
      encryptedData = wx.getStorageSync('encryptedData'),
      iv = wx.getStorageSync('iv');
      _self.setData({
        showModal: false
      })
      _self.bindUserRequest(encryptedData, iv);
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
  // 初始化banner
  bannerFn: function () {
    app.showLoading();
    var _self = this;
    wx.request({
      url: _api + '/mini/banner/list', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success (res) {
        if (res.data.code === '0') {
        wx.hideLoading();
          _self.setData({
            bannerData: res.data.result.data
          })
        } else {
          app.modalTip(res.data.message)
        }
      }
    })
  },
  // 商品类型
  commoedTypeFn: function () {
    app.showLoading();
    var _self = this,
       _addressId = wx.getStorageSync('addressId');
       _self.setData({
        addressId: _addressId
       })
    wx.request({
      url: _api + '/mini/rights/list', 
      data:{
        param: _self.data.addressId == '' ? 1 : _self.data.addressId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success (res) {
        wx.hideLoading();
        if (res.data.code === '0') {
          _self.setData({
            tableData: {
              lifeServiceList: res.data.result.data.lifeServiceList, //生活服务
              storeShopsList: res.data.result.data.storeShopsList, //门店商铺
              thisMonthRecommendList: res.data.result.data.thisMonthRecommendList, //本月推荐
              wmdjExclusiveList: res.data.result.data.wmdjExclusiveList //沃家专属
            },
            isHasData: ( res.data.result.data.lifeServiceList.length != 0 || res.data.result.data.storeShopsList.length != 0 || res.data.result.data.thisMonthRecommendList.length != 0 || res.data.result.data.wmdjExclusiveList.length != 0) ? false : true
           })
        } else {
          _self.setData({
            isHasData: true
          })
          app.modalTip(res.data.message)
        }
      }
    })
  },
  navFn(e) {
    let _url = e.currentTarget.dataset.url;
    if (_url.bannerUrlType == 1) {
      var _id = wx.setStorageSync('commId', _url.bannerUrl)
         wx.navigateTo({
           url: '../commodDetails/commodDetails?id=' + _url.bannerUrl,
         })
    } else {
      wx.navigateTo({
        url: '../outPage/outPage?url=' + _url.bannerUrl
      })
    }
  },
  wmdjExclusiveFn: function () {
    if (this.data.tableData.wmdjExclusiveList.length != 0) {
      const query = wx.createSelectorQuery()
      query.select('.wmdjExclusive').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res){
        wx.pageScrollTo({
          scrollTop: res[0].top,
          duration: 300
        })
      })
    } else {
      app.modalTip('沃家专属商品暂无数据')
    }
  },
  lifeServiceFn: function () {
    if (this.data.tableData.lifeServiceList.length != 0) {
      const query = wx.createSelectorQuery()
      query.select('.lifeService').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res){
        wx.pageScrollTo({
          scrollTop: res[0].top,
          duration: 300
        })
      })
    } else {
      app.modalTip('生活服务商品暂无数据')
    }
  },
  storeShopsFn: function () {
    if (this.data.tableData.storeShopsList.length != 0) {
      const query = wx.createSelectorQuery()
      query.select('.storeShops').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res){
        wx.pageScrollTo({
          scrollTop: res[0].top,
          duration: 300
        })
      })
    } else {
      app.modalTip('门店商铺商品暂无数据')
    }
  },
    // 获取用户信息
    onGotUserInfo: function (e) {
      let that = this,
          _errMsg = e.detail.errMsg,
          encryptedData = '',
          iv = '';
      if (_errMsg == 'getUserInfo:ok') {
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function(res) {
                encryptedData = res.encryptedData;
                iv = res.iv;
                that.bindUserRequest(encryptedData,iv);
                wx.setStorageSync('encryptedData', encryptedData),
                wx.setStorageSync('iv', iv);
          }
        })
      }
    },
    // 点击登录
    bindUserRequest(encryptedData,iv) {
      let that = this;
      wx.login({
        success: function (res) {
          let _code = res.code;
          console.log(_code,'code')
          if (_code) {
            wx.request({
              url: _api + '/auth/login',
              header: {
                'content-type': 'application/json' // 默认值
              },
              data: {
               param: {
                appId: app.appId,
                code: res.code,
                encryptedData: encryptedData,
                iv: iv,
                loginAccount: "",
                password: "",
                state: 31
               }
              },
              method:'POST',
              success: function (res) {
                console.log(11111,res)
                if (res.data.code === '0') {
                  that.setData({
                    isReginter: true,
                    isLogin:true,
                    loginInfo: res.data.result.data
                  })
                  wx.setStorageSync('isReginter', that.data.isReginter);
                  wx.setStorageSync('userId', res.data.result.data.id);
                  wx.setStorageSync('isLogin', true);
                  wx.setStorageSync('loginInfo', res.data.result.data);
                } else if (res.data.code === '-10500') {
                  that.setData({
                    isReginter: false,
                    isLogin:true
                  })
                  wx.setStorageSync('isReginter', that.data.isReginter);
                  wx.setStorageSync('isLogin', true)
                } else {
                   that.setData({
                    isReginter: false,
                    isLogin:false
                  })
                  wx.setStorageSync('isLogin', false);
                  wx.setStorageSync('isReginter', that.data.isReginter);
                  app.modalTip(res.data.message)
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
    } 
})
