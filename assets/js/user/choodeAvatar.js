$(function () {
  let layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $('#image');
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 点击上传，手动调用file点击事件
  $('#btnChooseImg').on('click', function () {
    $('#file').click();
  });

  // 更换用户选择的图片
  // 文件选择框change事件

  $('#file').on('change', function (e) {
    // 获取上传文件的列表
    let files = e.target.files;
    // 获取上传文件的列表第一项，即选择的图片文件
    let file = e.target.files[0];
    // console.log(file);
    if (files.length <= 0) {
      return layer.msg('未选择图片！');
    }
    // 将选择的图片转化为路径
    let imgURL = URL.createObjectURL(file);
    $image.cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 点击确定事件，发起请求
  $('#btnUpload').on('click', function () {
    let dataURL = $image.cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 100,
      height: 100
    }).toDataURL('image/png');// 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 2. 调用接口，把头像上传到服务器
    $.ajax({
      type: 'POST',
      url: '/my/update/avatar',
      data: { avatar: dataURL },
      success(res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('更换头像失败！');
        }
        layer.msg('更换头像成功！');
        window.parent.getUserInfo();
      }
    });
  });
})