import moment from 'moment'
// 表系统定义字段
export const TABLE_SYS_DATA = [
    {
        name: "_id",
        display: "id",
        type: "uuid",
        nullable: false,
        description: "唯一标识，只读，不可改写",
        unique: true,
        index: false,
        primaryKey: true,
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
        index: false,
        primaryKey: false,
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
        index: false,
        primaryKey: false,
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
        index: false,
        primaryKey: false,
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
        index: false,
        primaryKey: false,
        system: true,
        _disabled: true
    }
];

export const OPERATION_HISTORY_DFI = {
    columns: [
        {
            title: 'No',
            key: 'no',
            width: 60,
            minWidth: 60
        },
        {
            title: '操作类型',
            key: 'type',
            width: 100,
            minWidth: 100
        },
        {
            title: '操作对象',
            key: 'target',
            width: 260,
            minWidth: 260
        },
        {
            title: '操作员',
            key: 'authorName',
            width: 100,
            minWidth: 100
        },
        {
            title: '操作员ID',
            key: 'author',
            width: 100,
            minWidth: 100
        },
        {
            title: '操作时间',
            key: 'createDatetime',
            width: 150,
            minWidth: 150,
            render: (h, o) => {
                const data = moment(o.row["createDatetime"])
                return h('span', data.format("YYYY-MM-DD hh:mm:ss"));
            }
        },
        {
            title: '是否应用',
            key: 'isApply',
            width: 100,
            minWidth: 100
        },
        {
            title: ' '
        }
    ],
    data: [],
    height: 200,
    pagenav: {
        total: 10,
        pageSize: 30
    }
}