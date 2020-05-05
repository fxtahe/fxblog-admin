const authors =[
    {
        id:1,
        name:'fxtahe'
    },
    {
        id:2,
        name:'yang'
    }
]


export default[
    //author list
    {
      url: '/fxblog/author/list',
      type: 'get',
      response: () => {
        return authors;
      }

    },
    //author detail
    {
        url: '/fxblog/author/detail',
        type: 'get',
        response: config=>{
            const {id} = config.id
            return authors[id];
        }
    }
]