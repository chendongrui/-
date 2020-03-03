const app = getApp(),
      _api = app.api;
Page({
  data: {
    cityList:[],
    isStopPull: false,
    pageSize: 1,
    isHasData: true,
    cityVal: '',
    pageVal: ''
  },
  onLoad: function (options) {
    this.setData({
      pageVal: options.pageVal
    })
  },
  getData: function () {
   let _self = this,
   _pageSize = _self.data.pageSize,
   _isStopPull = _self.data.isStopPull;
   if (_isStopPull) {
     return
   }
    app.showLoading();
    wx.request({
      url: _api + '/mini/page',
      data:{
        param: {
          pageNo: _pageSize,
          pageSize: 8,
          regionName: _self.data.cityVal != '' ? _self.data.cityVal : ''
        }
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code === '0'){
          let _count = res.data.result.totalCount,   // 数据总条数
              _list = res.data.result.result,    // 数据
              _listArr = _self.data.cityList,   // 空数组
              _totalCount = _pageSize * 8,   // 每页条数
              _isConcat = true; 
              if (_count == 0) {
                _self.setData({
                  isStopPull: true,
                  isHasData: false
                })
                _isConcat = false;
              } else if (_totalCount < _count) {
                _self.setData({
                  isHasData: true,
                  pageSize: _pageSize + 1
                })
              } else if (_totalCount >= _count) {
                _self.setData({
                  isStopPull: true,
                  isHasData: true
                })
              }
              if (_isConcat) {
                let _listConcat = _listArr.concat(_list);
                  _self.setData({
                    cityList: _listConcat
                  })
              }
        } else {
          _self.setData({
            isStopPull: true,
            isHasData: false
          })
          app.modalTip(res.data.message)
        }
      }
    })
  },
  onShow: function () {
    this.setData({
      pageSize: 1
    })
    this.getData()
  },
  onReachBottom: function () {
    let _self = this,
       _isStopPull = _self.data.isStopPull;
      if (_isStopPull) {
        return
      }
      _self.getData()
  },
  citySearch: function () {
    let _self = this;
        _self.setData({
          pageSize: 1
        });
      _self.getData();
  },
  blurInputEventName: function (e) {
    let _self = this,
        _search = e.detail.value;
        console.log(_search,111)
    _self.setData({
      cityVal: _search ? _search : ''
    })
  },
  cityInfoFn(e) {
    let _names = e.currentTarget.dataset.names,
       _addressId = e.currentTarget.dataset.id;
    wx.setStorageSync('addressTxt', _names);
    wx.setStorageSync('addressId', _addressId);
    if (this.data.pageVal == '2') {
      wx.navigateTo({
        url: '../commodityType/commodityType'
      })
    } else {
      wx.navigateTo({
        url: '../index/index'
      })
    }
  },
})