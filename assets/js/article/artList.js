$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  //  配置获取文章列表数据发起请求的参数项
  let q = {
    pagenum: 1,  // 页码值,默认为1
    pagesize: 2, // 每页显示多少条数据 ,默认为2
    cate_id: '', // 文章分类的 Id
    state: ''    // 文章的状态，可选值有：已发布、草稿
  }
  renderArtList();
  artCate();
  // 获取渲染文章列表数据
  function renderArtList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success(res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        let htmlStr = template('art_table', res);
        $('#tbd').html(htmlStr);
        // 文章列表渲染出来之后，分页功能根据返回的数据total属性，渲染分页
        renderPage(res.total);
      }
    });
  }

  // 渲染分页，在每次更新文章列表的时候 都要渲染分页，所以在renderArtList()调用
  function renderPage(total) {
    //执行一个laypage实例
    laypage.render({
      elem: 'page',  // 渲染区域的ID
      count: total,   //数据总数
      limit: q.pagesize, // 每页显示的条数
      curr: q.pagenum, // 默认显示的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 自定义排版
      limits: [2, 3, 5, 10], // 自定义选择的显示数据条数
      // 利用layui render()方法的回调函数，进行分页的切换，和数据的渲染
      // 1.当页面一加载会执行回调
      // 2. 当切换分页和选择显示的条数也会执行回调
      // 首次不能执行，会无限递归
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数
        //得到当前页，以便向服务端请求对应页的数据
        q.pagenum = obj.curr;
        //得到每页显示的条数
        q.pagesize = obj.limit;
        //首次不执行,并根据最新的q配置参数，发起请求
        if (!first) {
          renderArtList();
        }
      }
    });
  }

  // 获取渲染文章分类下拉菜单数据
  function artCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success(res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！');
        }
        let htmlStr = template('art_cate', res);
        $('#cate_id').html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      }
    });
  }

  // 时间格式转换函数A
  template.defaults.imports.dateFormat = function (data) {
    let day = new Date(data),
      y = day.getFullYear(),
      m = (day.getMonth() + 1) < 10 ? '0' + (day.getMonth() + 1) : (day.getMonth() + 1),
      d = day.getDate() < 10 ? '0' + day.getDate() : day.getDate(),
      hh = day.getHours() < 10 ? '0' + day.getHours() : day.getHours(),
      mm = day.getMinutes() < 10 ? '0' + day.getMinutes() : day.getMinutes(),
      ss = day.getSeconds() < 10 ? '0' + day.getSeconds() : day.getSeconds();
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }

  // 点击筛选，根据下拉菜单所选类别，为参数项赋值，重新渲染数据
  $('#filter').on('submit', function (e) {
    e.preventDefault();
    // console.log(111);
    let cate_id = $('[name=cate_id]').val();
    let state = $('[name=state]').val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    renderArtList();
  });

  // 给所有的删除键绑定事件，利用事件委托的方式
  $('#tbd').on('click', '.del', function () {
    // console.log(111);
    // 获取当前删除的数据id
    let id = $(this).attr('data-id');
    // 判断当前页数据项还有几条
    let len = $('.del').length;
    // console.log(len);
    // console.log(id);
    // 显示弹出层
    layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function (index) {
      // 发起请求
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + id,
        success(res) {
          // console.log(res);
          if (res.status !== 0) {
            return layer.msg('删除文章失败！');
          }
          // 判断当前页数据项还有几条，如果只有一条，说明当点击删除后就要把页码数减一，加载上一页的数据
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          layer.msg('删除文章成功！');
          renderArtList();
        }
      });
      layer.close(index);
    });
  });
})