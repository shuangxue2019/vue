import Mock from 'mockjs';
import { getDesignerDataMenu } from './designer/data'

// 配置拦截 ajax 的请求时的行为，模拟网络延时
Mock.setup({
    timeout: '200 - 500'
})

Mock.mock(/\/designer\/data\/menu/, getDesignerDataMenu)