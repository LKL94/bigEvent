$(function () {
  getUserInfo();
})

// ajax请求获取用户的基本信息
function getUserInfo() {
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    // headers: { Authorization: localStorage.getItem('token') || '' },
    success(res) {
      console.log(res);
      let name = res.data.nickname || res.data.username
      $('.welcome_user').html('欢迎&nbsp&nbsp' + name);
      if (res.data.user_pic !== null) {
        $('.layui-nav-img').attr('src', res.data.user_pic).show().siblings('.text_avatar').hide();
      } else {
        $('.text_avatar').show().siblings('.layui-nav-img').hide();
      }
    }
  });
}