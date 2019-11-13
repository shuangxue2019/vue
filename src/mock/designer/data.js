export const getDesignerDataMenu = req => {
    req = JSON.parse(req.body)

    return {
        isOk: true,
        message: '',
        data: [
            {
                text: "数据表",
                type: "tables",
                children: [
                    {
                        text: "Users",
                        tooltip: "用户表",
                        type: "table"
                    },
                    {
                        text: "Infos",
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
                        text: "query1",
                        tooltip: "查询测试1",
                        type: "query"
                    },
                    {
                        text: "query2",
                        tooltip: "查询测试2",
                        type: "query"
                    }
                ]
            }
        ],
        code: 's000000'
    }
}