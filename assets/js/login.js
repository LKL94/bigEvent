$(function () {
  // 登录切换到注册
  $('#link_reg').on('click', function () {
    $('.login_box').hide();
    $('.reg_box').show();
  });
  // 登录切换到注册
  $('#link_login').on('click', function () {
    $('.login_box').show();
    $('.reg_box').hide();
  });
});