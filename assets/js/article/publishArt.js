$(function () {
  let form = layui.form;
  // 获取文章类别分类下拉菜单数据
  artCate();
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
})