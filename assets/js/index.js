$(function () {
  // 获取用户基本信息并渲染用户头像
  getUserInfo();

  // 实现退出功能
  $('#logout').on('click', function () {
    // console.log(123);
    // 添加弹出选项卡框
    layui.layer.confirm('确定要退出吗', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 清除本地存储的token值
      localStorage.removeItem('token');
      location.href = '/bigEvent/study/login.html';
      layer.close(index);
    });

  });
});

// ajax请求获取用户的基本信息
function getUserInfo() {
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    // headers: { Authorization: localStorage.getItem('token') || '' },
    success(res) {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg('用户申请失败！')
      }
      renderAvatar(res.data);
    },
  });
}

// 渲染用户头像
function renderAvatar(user) {
  // 如果用户有昵称，就优先渲染昵称
  let name = user.nickname || user.username
  $('.welcome_user').html('欢迎&nbsp;&nbsp;' + name);
  // 用户有上传头象，就优先使用上传的头像，不然就把用户名首字符渲染出来
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show().siblings('.text_avatar').hide();
  } else {
    let first = name[0].toUpperCase();
    $('.text_avatar').html(first).show().siblings('.layui-nav-img').hide();
  }
}
