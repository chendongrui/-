import  barcode  from '../../utils/barcode.js';
Page({
  data: {
    codeInfo: {},
    defaluteHead: '../../assets/index_user.png',
    memberCard: ''
  },
  onShow: function () {
    let _self = this,
        _codeInfo = wx.getStorageSync('loginInfo');
        _self.setData({
          codeInfo: _codeInfo,
          memberCard: _codeInfo.memberCard.substr(0, 3) + '*************' + _codeInfo.memberCard.substr(_codeInfo.memberCard.length - 2)
        })
    barcode.code128(wx.createCanvasContext('barcode'), _self.data.codeInfo.memberCard,318, 94);
  }
})