$(function () {
  let form = layui.form;
  let layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！';
      }
    }
  });

  initUserInfo();
  // 获取用户信息，并把用户信息的值赋值给表单
  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      success(res) {
        // layui内置方法，给表单快速赋值
        form.val("userInfo", res.data);
      }
    });
  }

  // 重置用户信息
  $('#btnReset').on('click', function (e) {
    e.preventDefault();
    initUserInfo();
  });

  // 提交修改
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！');
        }

        layer.msg('更新用户信息成功！');
        // 调用父页面的方法，同步更新欢迎信息
        window.parent.getUserInfo();
      }
    });
  });
})