$(function () {
  // 获取layui内置对象
  let form = layui.form;
  let layer = layui.layer;
  // layui的表单验证代码
  // 自定义表单验证规则
  form.verify({
    // 定义密码校验规则
    password: [
      /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    // 定义确认密码校验规则
    resetPwd: function (val) {
      if ($('.layui-form .newPwd').val() !== val) {
        return '两次密码不一致';
      }
    }
  });

  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    if ($('.layui-form .newPwd').val() === $('.layui-form .oldPwd').val()) {
      return layer.msg('两次密码不能一致！');
    }
    $.ajax({
      type: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('重置密码失败！');
        }
        layer.msg('重置密码成功！');
        $('.layui-form')[0].reset();
      }
    });
  });
})