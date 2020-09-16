$(function () {
  let layer = layui.layer;
  let form = layui.form;
  // layui layer.open()方法的返回值，用来关闭open弹出层
  let layerIndexDel = null;
  let layerIndexEdit = null;

  // 发请求获取文章列表
  function getArticleList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success(res) {
        // console.log(res);
        // 用模板渲染页面
        let htmlStr = template('temp_art', res);
        $('#tbd').html(htmlStr);
      }
    });
  }
  getArticleList();

  // 添加文章类别弹出层
  $('#addArtCase').on('click', function () {
    layerIndexDel = layer.open({
      type: 1,
      title: '添加文章类别',
      area: ['500px', '240px'],
      closeBtn: 1,
      content: $('#contant').html()
    });

  });
  // 因为弹出层是用js生成的，所以需要用事件委托来绑定事件
  $('body').on('submit', '#reAdd', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          layer.msg('添加类别失败！');
        }
        getArticleList();
        layer.msg('添加类别成功！');
        layer.close(layerIndexDel);
      }
    });
  });

  // 删除文章类别事件
  $('#tbd').on('click', '.del', function () {
    let id = $(this).attr('data-id');
    // console.log(id);
    layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + id,
        success(res) {
          // console.log(res);
          if (res.status !== 0) {
            return layer.msg('删除分类失败！');
          }
          getArticleList();
          layer.msg('删除分类成功！');
          layer.close(index);
        }
      });
    });
  });

  // 编辑文章类别事件
  $('#tbd').on('click', '.edit', function () {
    let id = $(this).attr('data-id');
    // console.log(id);
    // 添加弹出层
    layerIndexEdit = layer.open({
      type: 1,
      title: '修改文章类别',
      area: ['500px', '240px'],
      closeBtn: 1,
      content: $('#editArticle').html()
    });
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + id,
      success(res) {
        // console.log(res);
        form.val('formEdit', res.data);
      }
    });
  });
  // 确认修改文章类别事件
  // 因为弹出层是用js生成的，所以需要用事件委托来绑定事件
  $('body').on('submit', '#reEdit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success(res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('修改文章类别失败！');
        }
        layer.msg('修改文章类别成功！');
        layer.close(layerIndexEdit);
        getArticleList();
      }
    });
  });
})
