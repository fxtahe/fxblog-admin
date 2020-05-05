const articleList =[
    {
        id:'1',
        title:'测试数据',
        created_date:'2020-04-30',
        cover:'',
        like:12,
        description:'这是一段描述信息，主要是干嘛的你猜，我猜你不会猜，那就是文展描述',
        content:'content',
        authors:[{id:1,name:'fxtahe'}],
        public:1,
        status:1,
        star:2,
        tags:[{id:1,name:'test'}],
        category:{id:1,name:'java'}
    
    },
    {
        id:'2',
        title:'测试数据2',
        created_date:'2020-04-30',
        cover:'',
        like:12,
        description:'这是一段描述信息，主要是干嘛的你猜，我猜你不会猜，那就是文展描述',
        authors:[{id:1,name:'fxtahe'}],
        content:'content',
        public:1,
        status:1,
        star:2,
        tags:[{id:1,name:'test'}],
        category:{id:1,name:'java'}
    
    }
]

export default [
    // article list
    {
      url: '/fxblog/article/list',
      type: 'post',
      response: config => {
        const { categoryId, authorId,tagId,publicId,statusId,starId,page} = config.query
        
        
        return {
          code: 20000,
          data: articleList
        }
      }
    },
    // article detail
    {
        url: '/fxblog/article/detail',
        type: 'get',
        response: config => {
            const { id } = config.query
            
            
            return {
            code: 20000,
            data: articleList[id]
            }
        }
    }
  ]