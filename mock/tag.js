const tags = [
  {
    id: 1,
    name: "seata"
  },
  {
    id: 2,
    name: "apollo"
  }
];

export default [
  //tag list
  {
    url: "/fxblog/tag/list",
    type: "get",
    response: () => {
      return tags;
    }
  },
  //tag detail
  {
    url: "/fxblog/tag/detail",
    type: "get",
    response: (config) => {
      const { id } = config.id;
      return tags[id];
    }
  }
];
