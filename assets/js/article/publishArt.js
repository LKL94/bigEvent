$(function () {
  let form = layui.form;
  let layer = layui.layer;
  // 获取文章类别分类下拉菜单数据
  artCate();
  // 初始化富文本编辑器
  initEditor();
  function artCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success(res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！');
        }
        let htmlStr = template('art_cate', res);
        $('#cate_id').html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      }
    });
  }

  // 1. 初始化图片裁剪器
  let $image = $('#image');

  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 模拟文件上传事件
  $('#chooseImg').on('click', function () {
    $('#cover_img').click();
  });

  // 文件上传框的change事件
  $('#cover_img').on('change', function (e) {
    // console.log($(this)[0].files);
    if (this.files.length === 0) {
      return layer.msg('请选择封面图片！');
    }
    // 获取用户选择的图片文件
    let img = this.files[0];
    // console.log(img);
    // 把文件转换为URL地址
    var newImgURL = URL.createObjectURL(img);
    // console.log(newImgURL);
    $image.cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options);      // 重新初始化裁剪区域

  });

  // 发布文章请求参数为FormData格式
  // 把发表文章的状态存到一个变量里面
  let art_state = '已发布';
  $('#btnSaveTo').on('click', function () {
    art_state = '草稿';
  })
  // 先利用表单快速格式化FormData
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    let fd = new FormData($(this)[0]);
    // 把发布状态追加到fm对象中
    fd.append('state', art_state);

    // 把图片转换为二进制格式，追加到fm对象里
    $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      fd.append('cover_img', blob);
      // for (let k of fd.entries()) {
      //   console.log(k);
      // }
      // 所有参数都已经追加到fm对象中，可以发起请求了
      publishArt(fd);
    });

  });
  function publishArt(fd) {
    $.ajax({
      type: 'POST',
      url: '/my/article/add',
      data: fd,
      // 当请求的请求体是FormData格式时，必须要有下面两个配置对象
      processData: false,
      contentType: false,
      success(res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('发布文章失败！');
        }
        layer.msg('发布文章成功！');
        // 跳转到文章列表页
        location.href = '/bigEvent/study/article/artList.html';
      }
    });
  }
})