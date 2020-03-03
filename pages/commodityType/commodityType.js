const app = getApp(),
      _api = app.api;
Page({
  data:{
    showDialog: false,
    cityName: '',
    defaulImg: app.globalData.imageUrl,
    isStopPull: false,
    pageSize: 1,
    listArr: [],
    isHasData: true,
    isCommend: true,  // 推荐
    isSortTop: false,  // 升序
    isSortDown: false, // 降序
    isType: false, // 商品类型
    sortVal: '',
    searchData: [],
    typeId: '',
    typeTxt: ''
  }, 
  // 获取商品分类Id
  getTypeShop: function (e) {
    let _self = this,
        typeInfo = e.currentTarget.dataset,
        _typeId = typeInfo.typeid,
        _typeTxt = typeInfo.txt,
        _index = typeInfo.index,
        _eleIndex = _self.data.searchData[_index],
        _isSelected = _eleIndex.selecteds;
        if (_isSelected) {
          _eleIndex.selected = false;
        } else {
          for (let item of _self.data.searchData) {
            item.selected = false;
          }
          _eleIndex.selected = true;
        }
        _self.setData({
          searchData: _self.data.searchData,
          typeId: _typeId,
          typeTxt: _typeTxt
        })
  },
  // 获取商品重置
  resetRefer: function(){
    let _self = this,
        dataReseat = _self.data.searchData;
    for (let item of dataReseat) {
      item.selected = false;
    }
    _self.setData({
      searchData: _self.data.searchData,
      typeTxt: '',
      typeId: ''
    })
  },
  // 推荐
  CommendFn: function () {
     this.setData({
      isCommend: true,  // 推荐
      isSortTop: false,  // 升序
      isSortDown: false, // 降序
      isType: false, // 商品类型
      showDialog: false,
      sortVal: '',
      typeId: '',
      typeTxt: '',
      isStopPull: false,
      pageSize: 1,
      listArr: []
     })
     this.onSearch();
  }, 
  SortTopFn: function (e) {
    this.setData({
     isCommend: false,  // 推荐
     isSortTop: true,  // 升序
     isSortDown: false, // 降序
     isType: false,// 商品类型
     showDialog: false,
     sortVal: e.currentTarget.dataset.sort,
     typeId: '',
     isStopPull: false,
     typeTxt: '',
     pageSize: 1,
     listArr: []
    })
    this.onSearch();
 },
 SortDownFn: function (e) {
  this.setData({
   isCommend: false,  // 推荐
   isSortTop: false,  // 升序
   isSortDown: true, // 降序
   isType: false, // 商品类型
   showDialog: false,
   sortVal: e.currentTarget.dataset.sort,
   typeId: '',
   typeTxt: '',
   isStopPull: false,
   pageSize: 1,
   listArr: []
  })
  this.onSearch();
},
  onLoad: function(options){
    let _self = this;
    wx.setStorageSync('goodsType',options.goodsType)
    _self.titleFn();
  },
  onShow: function () {
    this.setData({
      addressTxt: wx.getStorageSync('addressTxt') != '' ? wx.getStorageSync('addressTxt') : ''
    })
    this.onSearch();
  },
  // 动态设置标题
  titleFn: function () {
    let valTitle = wx.getStorageSync('goodsType');
     if (valTitle == '4') {
        wx.setNavigationBarTitle({
          title: '本月推荐'
        })
     } else if (valTitle == '1'){
        wx.setNavigationBarTitle({
          title: '沃家专属'
        })
     } else if (valTitle == '2'){
        wx.setNavigationBarTitle({
          title: '生活服务'
        })
   } else if (valTitle == '3'){
      wx.setNavigationBarTitle({
        title: '门店商铺'
      })
 }
  },
  commodTypeFn: function () {
    let _self = this;
    _self.setData({
      isStopPull: false,
      showDialog: true,
      isCommend: false,  // 推荐
      isSortTop: false,  // 升序
      isSortDown: false, // 降序
      isType: true, // 商品类型
      sortVal: ''
    })
    _self.commendType()
  },
  // 商品分类接口
  commendType: function () {
    var _self = this;
    wx.request({
      url: _api + '/mini/rights/classify/list',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      // method:'GET',
      method:'POST',
      success: function (res) {
        if (res.data.code === '0') {
          for (let item of res.data.result.data) {
            item.selected = false;
          }
           _self.setData({
             searchData: res.data.result.data
           })
        } else {
          app.modalTip(res.data.message)
        }
      }
    })
  },
  //商品分类确定
  commodSure: function(){
    this.setData({
      showDialog: false,
      listArr: [],
      pageSize: 1
    })
    this.onSearch();
  },
 // 页面搜索方法
  onSearch: function () {
    let _self = this,
      _pageSize = _self.data.pageSize,
      _isStopPull = _self.data.isStopPull,
      _addressId = wx.getStorageSync('addressId');
      if (_isStopPull) {
        return
      }
      app.showLoading();
      wx.request({
        url: _api + '/mini/rights/second/page',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data:{
          param:{
            cityId: _addressId != '' ? _addressId : 1,  // 城市参数
            classifyId: _self.data.typeTxt === '' ? '' : _self.data.typeId,  // 商品分类
            goodsType: wx.getStorageSync('goodsType'),  // 商品分类标识
            integralSort: _self.data.sortVal != '' ? _self.data.sortVal : '',  // 排序
            pageNo: _pageSize,
            pageSize: 10
          }
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == '0') {
            let _count = res.data.result.totalCount,   // 数据总条数
              _list = res.data.result.result,    // 数据
              _listArr = _self.data.listArr,   // 空数组
              _totalCount = _pageSize * 10,   // 每页条数
              _isConcat = true;  //
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
                listArr: _listConcat
              })
            }
          } else {
            app.modalTip(res.data.message)
          }
        }
      })
  },
  onReachBottom: function () {
    let _self = this,
       _isStopPull = _self.data.isStopPull;
      if (_isStopPull) {
        return
      }
      _self.onSearch()
  }
})