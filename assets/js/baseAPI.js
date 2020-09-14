// 利用jQuery中的$.ajaxPrefilter()方法，在每次发起ajax请求之前
// 先调用此函数，拼接真正的url地址
$.ajaxPrefilter(function (options) {
  options.url = 'http://ajax.frontend.itheima.net' + options.url;
  console.log(options.url);
});