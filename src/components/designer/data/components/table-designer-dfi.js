// 表系统定义字段
export const TABLE_SYS_DATA = [
    {
        name: "id",
        display: "id",
        type: "uuid",
        nullable: false,
        description: "唯一标识",
        unique: true,
        system: true,
        _disabled: true
    },
    {
        name: "title",
        display: "标题",
        type: "string",
        nullable: false,
        description: "标题",
        unique: false,
        system: true,
        _disabled: true
    },
    {
        name: "createDatetime",
        display: "创建时间",
        type: "datetime",
        nullable: false,
        description: "创建时间",
        unique: false,
        system: true,
        _disabled: true
    },
    {
        name: "updateDatetime",
        display: "更新时间",
        type: "datetime",
        nullable: false,
        description: "更新时间",
        unique: false,
        system: true,
        _disabled: true
    },
    {
        name: "author",
        display: "创建人",
        type: "string",
        nullable: false,
        description: "创建人",
        unique: false,
        system: true,
        _disabled: true
    }
];

export const OPERATION_HISTORY_DFI = {
    columns: [
        {
            title: 'No',
            width: 60,
            minWidth: 60
        },
        {
            title: '操作类型',
            width: 100,
            minWidth: 100
        },
        {
            title: '操作对象',
            width: 100,
            minWidth: 100
        },
        {
            title: '操作员',
            width: 100,
            minWidth: 100
        },
        {
            title: '操作员ID',
            width: 100,
            minWidth: 100
        },
        {
            title: '操作时间',
            width: 100,
            minWidth: 100
        },
        {
            title: '是否应用',
            width: 100,
            minWidth: 100
        }
    ],
    data: [],
    height: 200,
    pagenav:{
        total: 10,
        pageSize: 30
    }
}