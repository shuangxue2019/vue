import { req } from '#/req'

// 获取设计菜单
export const getMenu = () => {
    return req({
        url: '/designer/data/menu'
    });
}

// 获取表定义数据，传入表编码
export const getTable = code => {
    return req({
        url: '/designer/data/gettable',
        params: {
            code
        }
    });
}

// 获取表操作记录，传入表编码
export const getTableHis = code => {
    return req({
        url: '/designer/data/gettablehis',
        params: {
            code
        }
    });
}

// 获取快捷查询，传入编码
export const getQuery = code => {
    return req({
        url: '/designer/data/getquery',
        params: {
            code
        }
    });
}

// 执行查询测试，传入编码
// get
export const exeQueryTest = code =>{
    return req({
        url: '/designer/data/exequerytest',
        params: {
            code
        }
    });
}

// 保存快捷查询
// post
export const saveQuery = model =>{
    return req({
        url: '/designer/data/savequery',
        data: model,
        method: 'post'
    });
}

// 快捷查询另存为
// post
export const saveQueryAs = model =>{
    return req({
        url: '/designer/data/savequeryas',
        data: model,
        method: 'post'
    });
}