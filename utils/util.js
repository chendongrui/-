const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*  判断值是否为空，空：传回null  */
const getValue = val => {
  if (val === undefined || val === null || (val === '' && val !== 0)) {
    return null
  }
  return $.trim(val)
}
/*  判断值是否为空  */
const checkEmptyTrim = val => {
  if (val === undefined || val === null || (val === '' && val !== 0)) {
    return true
  }
  val = $.trim(val)
  if (val === null || (val === '' && val !== 0)) {
    return true
  }
  return false
}
/*  判断数组的长度  */
const checkListEmpty = val => {
  if (val === undefined || val === null) {
    return true
  }
  if (val.length < 1) {
    return true
  }
  return false
}
/*  判断数组是否有空的值  */
const checkHasEmptyAttr = val => {
  for (const i in val) {
    if (val[i] === undefined || val[i] === null || val[i] === '') {
      return true
    }
  }
  return false
}
/*  判断值的长度  */
const checkStringSize = (val, maxSize) => {
  if (val.length > maxSize) {
    return true
  }
  return false
}
/*  校验手机号码格式  */
const checkPhone = val => {
  // var reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$/
  var reg = /^1[34578]\d{9}$/
  if (reg.test(val)) {
    return false
  } else {
    return true
  }
}
module.exports = {
  formatTime: formatTime,
  getValue: getValue, 	// 【input】判断单个值是否为空，true传回 null ，false传回 去掉两端空格的值
  checkPhone: checkPhone, // 判断手机号码是否正确
  checkStringSize: checkStringSize, // 判断值的长度，传参（data，maxsize）	true
  checkHasEmptyAttr: checkHasEmptyAttr, 	// 判断数组是否有空的值	true
  checkListEmpty: checkListEmpty, // 判断数组值是否为空，数组的长度 true
  checkEmptyTrim: checkEmptyTrim  	// 判断值是否为空,去掉空格是否为空 true
}
 