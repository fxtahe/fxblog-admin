import request from '@/utils/request';

export function getAuthors(){
    return request({
        url: '/fxblog/author/list',
        method: 'get'
    })
}

export function getCategoriey(id){
    return request({
        url: '/fxblog/author/detail',
        method: 'get',
        params: {id}
    })
}