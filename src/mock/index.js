import Mock from 'mockjs';
import { getDesignerDataMenu, getTable as getTableDfi, getTableHis, getQuery, exeQueryTest, saveQuery, saveQueryAs } from './designer/data'

// 配置拦截 ajax 的请求时的行为，模拟网络延时
Mock.setup({
    timeout: '200 - 500'
})

Mock.mock(/\/designer\/data\/menu/, getDesignerDataMenu)
Mock.mock(/\/designer\/data\/gettablehis/, getTableHis)
Mock.mock(/\/designer\/data\/gettable/, getTableDfi)
Mock.mock(/\/designer\/data\/getquery/, getQuery)
Mock.mock(/\/designer\/data\/exequerytest/, exeQueryTest)
Mock.mock(/\/designer\/data\/savequeryas/, saveQueryAs)
Mock.mock(/\/designer\/data\/savequery/, saveQuery)