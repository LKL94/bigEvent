// 利用jQuery中的$.ajaxPrefilter()方法，在每次发起ajax请求之前
// 先调用此函数，拼接真正的url地址
$.ajaxPrefilter(function (options) {
  options.url = 'http://ajax.frontend.itheima.net' + options.url;
  // console.log(options.url);
  if (options.url.includes('/my')) {

    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }

    options.complete = function (res) {
      // 用户如果没有没有登陆就拒绝访问主界面
      // console.log(res.responseJSON);
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        localStorage.removeItem('token');
        location.href = '/bigEvent/study/login.html';
      }
    }
  }
});