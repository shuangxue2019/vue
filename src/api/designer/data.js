import { req } from '#/req'

// 获取设计菜单
export const getMenu = () => {
    return req({
        url: '/designer/data/menu'
    });
}