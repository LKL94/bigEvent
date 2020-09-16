$(function () {
  // 登录切换到注册
  $('#link_reg').on('click', function () {
    $('.login_box').hide();
    // 清空当前表单数据
    $('.login_box form')[0].reset();
    $('.reg_box').show();
  });

  // 登录切换到注册
  $('#link_login').on('click', function () {
    $('.login_box').show();
    // 清空当前表单数据
    $('.reg_box form')[0].reset();
    $('.reg_box').hide();
  });

  // 获取layui内置对象
  let form = layui.form;
  let layer = layui.layer;
  // console.log(form);
  // console.log(layer);
  // layui的表单验证代码
  // 自定义表单验证规则
  form.verify({
    // 定义密码校验规则
    password: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 定义确认密码校验规则
    repassword: function (val) {
      if ($('.reg_box .password').val() !== val) {
        return '两次密码不一致'
      }
    }
  });
  // 注册表单提交事件，发ajax请求
  $('#reg_form').on('submit', function (e) {
    // 阻止表单自己提交的默认行为
    e.preventDefault();
    // console.log(111);
    let data = {
      username: $('#reg_form [name=username]').val(),
      password: $('#reg_form [name=password]').val()
    };

    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: data,
      success(res) {
        // 如果未注册成功，就给用户提示返回来的信息
        if (res.status !== 0) {
          return layer.msg(res.message);
        } else {
          layer.msg('注册成功，去登陆');
          $('#link_login').click();
        }
      }
    });
  });

  // 登录表单提交事件，发ajax请求
  $('#login_form').on('submit', function (e) {
    // 阻止表单自己提交的默认行为
    e.preventDefault();
    // console.log(111);
    let data = $(this).serialize();
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: data,
      success(res) {
        // 如果未注册成功，就给用户提示返回来的信息
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('登陆失败');
        }
        layer.msg('登陆成功');
        // 把服务器返回来的身份验证标识保存到本地存储
        localStorage.setItem('token', res.token);
        location.href = '/bigEvent/study/index.html';
      }
    });
  });
});