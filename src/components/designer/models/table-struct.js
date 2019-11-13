// MongoDB表字段结构
/*
// 所有的定义性质的数据放到system数据库
// 后期允许客户自定义数据库，当前不允许
use system
switched to db system
db.tables.insert({
    name: "新的表",
    code: "Table_Code",
    columns: [
        {...ColumnStruct}
    ]
})
*/

/*
    关于表单的设计器：创建一个表单，将创建一个物理页面（编译相关代码，生成物理代码，加速浏览效果）
*/
const arrToDict = arr => {
    let dict = {};

    (arr || []).forEach(item => {
        dict[item.name] = item;
    });

    return dict;
};

const dictToArr = dict => {
    let arr = [];

    for (let key in dict) {
        arr.push(dict[key]);
    }

    return arr;
};

// 字段类型
export const ColumnType = [
    { text: "字符串", value: "string" },
    { text: "数值", value: "number" },
    { text: "布尔", value: "bool" },
    { text: "日期时间", value: "datetime" },
    { text: "对象", value: "object" },
    { text: "唯一标识", value: "uuid" }
];

// 字段类型 键值对形式
export const ColumnTypeDic = (() => {
    let dic = {};

    ColumnType.forEach(item => {
        dic[item.value] = item.text;
    })

    return dic;
})();

// 格式验证
export const RULE_FORMAT = [
    "email",    // 电子邮箱
    "mobilephone",  // 移动电话
    "idcard",   // 身份证
    "date", // 日期
    "datetime", //日期时间
    "number",   // 数字
    "digits",   // 整数
    "url"   // url
]

// 字段校验法则
// 是否必填已经有字段验证
export const FIELD_RULE_DFI = [
    { name: 'rangelength', label: '长度范围', type: 'range', enabled: false, comment: '长度范围' },
    { name: 'range', label: '取值范围', type: 'range', enabled: false, comment: '取值范围，仅对数值类型的有效' },
    { name: 'email', label: '电子邮箱', enabled: false, comment: '电子邮箱' },
    { name: 'mobilephone', label: '移动电话', enabled: false, comment: '移动电话' },
    { name: 'idcard', label: '身份证', enabled: false, comment: '身份证' },
    { name: 'date', label: '日期', enabled: false, comment: '日期' },
    { name: 'datetime', label: '日期时间', enabled: false, comment: '日期时间' },
    { name: 'number', label: '数字', enabled: false, comment: '数字' },
    { name: 'digits', label: '整数', enabled: false, comment: '整数' },
    { name: 'url', label: 'url', enabled: false, comment: 'url' },
];

export const FIELD_RULE_DFI_DICT = arrToDict(FIELD_RULE_DFI);
// {

//     rangelength: { min: 0, max: 50 },  // 长度范围，null则不验证
//     range: { min: null, max: null },      // 取值范围，null不验证，仅对数值类型的有效
//     format: [],    // 验证格式，暂定支持email,mobilephone,idcard(身份证),date,datetime,number,digits,url
// }

const ComponentTypeBaseDfi = {
    // 基础属性
    baseProps: {
        _title: "基础属性",
        _icon: "ios-options",
        defaultValue: undefined, // 默认值
        placeholder: null, // 占位符
        comment: null, // 描述信息
        editable: true, // 是否可编辑
        searchable: false, // 是否可搜索
        verifiable: false,  // 是否启用校验
        rules: [],     // 校验法则{FIELD_RULE_DFI} 如：[FIELD_RULE_DFI.require, FIELD_RULE_DFI.rangelength]
    },
    // 公式属性
    formulaProps: {
        _title: "公式属性",
        _icon: "ios-options",
        visible: null,  // 控制显示
        disabled: null, // 控制是否disabled
        readonly: null, // 控制只读
    },
    // 其他属性
    extraProps: {
        _title: "其他属性",
        _icon: "ios-options",
    },
}

// 组件类型
// 均可以通过条件来显示数据
export const ComponentType = {
    text: {
        ...ComponentTypeBaseDfi,
        code: "text",
        title: "文本框",
        length: 50
    },
    number: {
        ...ComponentTypeBaseDfi,
        code: "number",
        title: "数字框",
        baseProps: {
            ...ComponentTypeBaseDfi.baseProps,
            rules: [
                { ...FIELD_RULE_DFI_DICT.number, enabled: true }
            ]
        }
    },
    textarea: {
        ...ComponentTypeBaseDfi,
        code: "textarea",
        title: "文本域"
    },
    radio: {
        ...ComponentTypeBaseDfi,
        code: "radio",
        title: "单选框"
    },
    checkbox: {
        ...ComponentTypeBaseDfi,
        code: "checkbox",
        title: "复选框"
    },
    file: {
        ...ComponentTypeBaseDfi,
        code: "file",
        title: "上传组件"
    },
    select: {
        ...ComponentTypeBaseDfi,
        code: "select",
        title: "下拉框"
    },
    autocomplete: {
        ...ComponentTypeBaseDfi,
        code: "autocomplete",
        title: "自动完成组件"
    },
    datetime: {
        ...ComponentTypeBaseDfi,
        code: "datetime",
        title: "日期时间",
        baseProps: {
            ...ComponentTypeBaseDfi.baseProps,
            rules: [
                { ...FIELD_RULE_DFI_DICT.datetime, enabled: true }
            ]
        }
    },
    time: {
        ...ComponentTypeBaseDfi,
        code: "time",
        title: "时间",
        baseProps: {
            ...ComponentTypeBaseDfi.baseProps,
            rules: [
                { ...FIELD_RULE_DFI_DICT.time, enabled: true }
            ]
        }
    },
    date: {
        ...ComponentTypeBaseDfi,
        code: "date",
        title: "日期",
        baseProps: {
            ...ComponentTypeBaseDfi.baseProps,
            rules: [
                { ...FIELD_RULE_DFI_DICT.date, enabled: true }
            ]
        }
    },
    table: {
        ...ComponentTypeBaseDfi,
        code: "table",
        title: "数据表"
    },
    subpanel: {
        ...ComponentTypeBaseDfi,
        code: "subpanel",
        title: "子面板",
        comment: "可绑定数据源，子组件通过数据源名来调用数据"
    },
    tabs: {
        ...ComponentTypeBaseDfi,
        code: "tabs",
        title: "tab切换页"
    }
}

export const COM_ITEM_DFI = {
    verifiable: { label: '启用校验', icon: null, placeholder: '启用校验', type: 'switch', comment: null },
    rules: { label: '校验规则', icon: null, placeholder: '校验规则', type: 'rule', comment: null },
    defaultValue: { label: '默认值', icon: null, placeholder: '默认值', type: 'text', comment: null },
    placeholder: { label: '占位字符', icon: null, placeholder: '占位字符', type: 'text', comment: null },
    comment: { label: '描述信息', icon: null, placeholder: '描述信息', type: 'textarea', comment: null },
    editable: { label: '可编辑', icon: null, placeholder: '是否可编辑', type: 'switch', comment: null },
    searchable: { label: '可搜索', icon: null, placeholder: '是否可搜索', type: 'switch', comment: null },
    visible: { label: '可见', icon: 'logo-javascript', placeholder: '请输入公式', type: 'text', comment: null },
    disabled: { label: '禁用', icon: 'logo-javascript', placeholder: '请输入公式', type: 'text', comment: null },
    readonly: { label: '只读', icon: 'logo-javascript', placeholder: '请输入公式', type: 'text', comment: null },
}

// 表单结构
export const TableStruct = {
    name: "",   // 表明
    code: "",   // 编码，唯一，不填写自动分配GUID
    columns: [] // Array {ColumnStruct} 字段定义
}

// 列结构
export const ColumnStruct = {
    name: "",           // 字段名，表内唯一
    display: "",        // 显示名
    type: "string",     // 字段类型 string, number, datetime, object, bool, guid
    nullable: true,     // 是否可以为空
    unique: false,      // 是否是唯一
    // defaultComponent: ComponentType.text,   // 默认组件类型
    description: ""     // 描述
}