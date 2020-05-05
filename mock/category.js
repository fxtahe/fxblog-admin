var categories = [
  {
    id: 1,
    name: "java",
    description: "这是一段感人肺腑的经历",
    cover:
      "https://resource.shirmy.me/blog/screenshot/2019-07-20/smile-blog-admin-01.png"
  },
  {
    id: 2,
    name: "python",
    description: "这是一段喜极而泣的经历",
    cover:
      "https://resource.shirmy.me/blog/screenshot/2019-07-20/smile-blog-admin-01.png"
  }
];

export default [
  //category list
  {
    url: "/fxblog/category/categories",
    type: "get",
    response: () => {
      return categories;
    }
  },
  //category detail
  {
    url: "/fxblog/category/detail",
    type: "get",
    response: (id) => {
      for (var category in categories) {
        if (category.id === id) {
          return category;
        }
      }
      return null;
    }
  },
  {
    url: "/fxblog/category/add",
    type: "post",
    response: (category) => {
      return { errorCode: 0, msg: "添加分类成功" };
    }
  }
];
