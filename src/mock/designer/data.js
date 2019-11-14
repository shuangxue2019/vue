import { getParams } from '@/libs/util'
import Mock from 'mockjs'
const Random = Mock.Random

/*
数据库设计方案：
全局通用数据库：sys
用户数据库：u{userid}

数据表名解释：
tables                  表定义相关表，用于显示在设计器中的，不是真正使用中的定义内容
tables_published        已发布的表定义的表，用于真正使用中的，tables中的表如果应用后，将更新这里的内容
tables_history          表操作记录表，用于记录表中的操作记录
*/

const RES = {
    isOk: true,
    message: '',
    code: 's000000'
}
// 获取数据设计表菜单
// get方法
export const getDesignerDataMenu = req => {
    // 直接来源与用户数据库中的菜单表
    req = JSON.parse(req.body)

    return {
        ...RES,
        data: [
            {
                text: "数据表",
                type: "tables",
                children: [
                    {
                        text: "用户表",
                        value: "USERS",
                        tooltip: "用户表",
                        type: "table"
                    },
                    {
                        text: "信息表",
                        value: "INFOMATION",
                        tooltip: "信息表",
                        type: "table"
                    }
                ]
            },
            {
                text: "快捷查询",
                type: "querys",
                children: [
                    {
                        text: "查询测试1",
                        value: "QUERY1",
                        tooltip: "查询测试1",
                        type: "query"
                    },
                    {
                        text: "查询测试2",
                        value: "QUERY2",
                        tooltip: "查询测试2",
                        type: "query"
                    }
                ]
            }
        ]
    }
}

// 获取数据表
// get方法
export const getTable = req => {
    const params = getParams(req.url)
    const TABLE_SYS_DATA = [
        {
            name: "_id",
            display: "id",
            type: "uuid",
            nullable: false,
            description: "唯一标识，只读，不可改写",
            unique: true,
            index: false,
            primaryKey: true,
            system: true
        },
        {
            name: "title",
            display: "标题",
            type: "string",
            nullable: false,
            description: "标题",
            unique: false,
            index: false,
            primaryKey: false,
            system: true
        },
        {
            name: "createDatetime",
            display: "创建时间",
            type: "datetime",
            nullable: false,
            description: "创建时间",
            unique: false,
            index: false,
            primaryKey: false,
            system: true
        },
        {
            name: "updateDatetime",
            display: "更新时间",
            type: "datetime",
            nullable: false,
            description: "更新时间",
            unique: false,
            index: false,
            primaryKey: false,
            system: true
        },
        {
            name: "author",
            display: "创建人",
            type: "string",
            nullable: false,
            description: "创建人",
            unique: false,
            index: false,
            primaryKey: false,
            system: true
        }
    ];

    // 测试数据
    // 从用户数据库中的tables表中获取数据
    const exData = {
        USERS: {
            descr: {
                code: 'USERS',
                name: '用户表',
                comment: '用户表：用于保存用户信息'
            },
            columns: [
                ...TABLE_SYS_DATA,
                {
                    name: "userName",
                    display: "用户名",
                    type: "string",
                    nullable: false,
                    description: "用户名",
                    unique: false,
                    index: false,
                    primaryKey: false,
                    system: false
                },
                {
                    name: "password",
                    display: "密码",
                    type: "string",
                    nullable: false,
                    description: "密码",
                    unique: false,
                    index: false,
                    primaryKey: false,
                    system: false
                }
            ]
        },
        INFOMATION: {
            descr: {
                code: 'INFOMATION',
                name: '信息表',
                comment: '信息表'
            },
            columns: [
                ...TABLE_SYS_DATA
            ]
        }
    };

    const db = exData[params.code];

    return {
        ...RES,
        data: db || {},
        isOk: !!db
    }
}

// 获取表操作记录
// get方法
export const getTableHis = req => {
    const params = getParams(req.url)
    console.log("请求参数code", params.code)

    // 数据解释
    // type: 操作类型：[add-添加, delete-删除, update-修改]
    return {
        ...RES,
        data: [
            {
                no: 1,
                type: 'add',
                target: '【字段】用户名 username',
                authorName: '张三',
                author: 'zsan',
                createDatetime: new Date(),
                isApply: true
            },
            {
                no: 2,
                type: 'add',
                target: '【字段】密码 password',
                authorName: '张三',
                author: 'zsan',
                createDatetime: new Date(),
                isApply: true
            },
            {
                no: 3,
                type: 'update',
                target: '【字段】密码 password',
                authorName: '张三',
                author: 'zsan',
                createDatetime: new Date(),
                isApply: true
            },
            {
                no: 4,
                type: 'delete',
                target: '【字段】联系电话 phone',
                authorName: '张三',
                author: 'zsan',
                createDatetime: new Date(),
                isApply: true
            }
        ]
    }
}

// 获取快捷查询
// get方法
export const getQuery = req => {
    const params = getParams(req.url)
    const exData = {
        QUERY1: {
            name: "查询测试1",
            code: 'QUERY1',
            body: 'use db;\nlet a = 123;\nreturn;',
            comment: "查询测试1",
            template: 'QUERY1();'
        },
        QUERY2: {
            name: "查询测试2",
            code: 'QUERY2',
            body: 'use db;\nlet a = 0;\nreturn;',
            comment: "查询测试2",
            template: 'QUERY2();'
        }
    };

    const db = exData[params.code];

    return {
        ...RES,
        data: db || {},
        isOk: !!db
    }
}

// 执行查询测试，传入编码
// get
// 最多显示2000行
export const exeQueryTest = code => {
    const INIT_COLUMN = {
        width: 100,
        minWidth: 100,
        ellipsis: true
    };
    const arr = [];
    const len = Random.integer(1, 2000)

    for (let i = 0; i < len; i++) {
        arr.push({
            code: Random.guid(),
            title: Random.csentence(6, 15),
            author: Random.string(5, 10)
        })
    }

    const db = {
        columns: [
            { ...INIT_COLUMN, title: "编码", key: "code" },
            { ...INIT_COLUMN, title: "标题", key: "title" },
            { ...INIT_COLUMN, title: "创建人", key: "author" },
            { title: ' ' }
        ],
        data: arr
    };

    return {
        ...RES,
        data: db
    }
}

// 保存快捷查询
// post
export const saveQuery = model => {
    const r = Random.boolean() ? {
        message: "保存成功",
        isOk: true
    } : {
            message: "保存失败",
            isOk: false
        }
    return {
        ...RES,
        ...r
    }
}

// 快捷查询另存为
// post
export const saveQueryAs = model => {
    const r = Random.boolean() ? {
        message: "保存成功",
        isOk: true
    } : {
            message: "保存失败",
            isOk: false
        }
    return {
        ...RES,
        ...r
    }
}