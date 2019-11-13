<style lang="less">
.m-table-designer {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  &-tool {
    margin-bottom: 10px;
    margin-top: 5px;
  }
  &-table {
    flex: 1;
    overflow-y: auto;
  }
  th.td-block .ivu-table-cell {
    display: block;
  }
  td.td-hide-ellipsis .ivu-table-cell {
    text-overflow: initial;
  }
  .ivu-table .tr-system td {
    background: #fff8e0;
  }
  .ivu-menu-horizontal {
    height: 40px;
    line-height: 40px;
  }
  .no-resize textarea {
    resize: none;
  }
  .m-table-descr {
    border-style: solid;
    border-width: 0 1px 1px;
    border-color: #dedede;
    margin-bottom: 5px;
    padding: 5px 10px;
    background-color: #f9f9f9;
    .ivu-form-item {
      margin: 5px 0;
    }
  }
  .m-table-designer-table {
    display: flex;
    flex-direction: column;
    .ivu-tabs-bar {
      margin-bottom: 0px;
    }
    .ivu-tabs {
      flex: 1;
      display: flex;
      flex-direction: column;
      .ivu-tabs-content {
        flex: 1;
        display: flex;
        .ivu-tabs-tabpane {
          position: relative;
          border-style: solid;
          border-width: 0 1px 1px;
          border-color: #dcdee2;
        }
        .ivu-table-wrapper-with-border {
          border-width: 1px 0 0;
        }
        .ivu-table-border:after {
          display: none;
        }
      }
    }
    &-inner {
      position: absolute;
      top: 30px;
      left: 0;
      right: 0;
      bottom: 0;
      &.no-toolbar {
        top: 0;
        .ivu-table-wrapper-with-border {
          border-top: none;
        }
      }
    }
  }
}
</style>
<template>
  <div class="m-table-designer">
    <tool-bar>
      <tool-button icon="ios-archive" label="保存" />
      <tool-button icon="md-checkmark" label="应用" />
      <tool-button icon="md-copy" label="复制表" />
    </tool-bar>
    <div class="m-table-descr">
      <Form :model="tableInfoModel" :label-width="80">
        <Row>
          <Col :span="12">
            <FormItem label="表名称">
              <Input v-model="tableInfoModel.name" placeholder="表名称" size="small" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="表编码">
              <Input v-model="tableInfoModel.code" placeholder="表编码" size="small" />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="表注释">
          <Input
            type="textarea"
            maxlength="100"
            show-word-limit
            placeholder="表注释..."
            class="no-resize"
            size="small"
            v-model="tableInfoModel.descr"
          />
        </FormItem>
      </Form>
    </div>
    <div class="m-table-designer-table">
      <Tabs type="card" :animated="false">
        <TabPane label="表格列">
          <tool-bar :border="false">
            <tool-button icon="ios-book" label="字典字段" />
            <tool-button icon="logo-buffer" label="级联字段" />
            <tool-button icon="logo-dropbox" label="导入字段模板" />
            <tool-button icon="ios-cube" label="存为字段模板" />
          </tool-bar>
          <div class="m-table-designer-table-inner" ref="container">
            <Table
              :columns="tableDfi.columns"
              :height="tableDfi.height"
              size="small"
              :border="true"
              :data="tableColumns"
              :row-class-name="(row, index)=>{
          if(row['system']) return 'tr-system';
          }"
            ></Table>
            <Page
              :total="pagenav.total"
              :page-size="pagenav.pageSize"
              :style="{marginTop: '3px'}"
              size="small"
              show-elevator
            />
          </div>
        </TabPane>
        <TabPane label="数据留痕">
          <div class="m-table-designer-table-inner no-toolbar" ref="hiscontainer">
            <!-- 数据留痕 从日志数据库中对应的表编码查出结果 -->
            <Table
              :columns="hisTable.columns"
              :height="hisTable.height"
              size="small"
              :border="true"
              :data="hisTable.data"
            ></Table>
            <Page
              :total="hisTable.pagenav.total"
              :page-size="hisTable.pagenav.pageSize"
              :style="{marginTop: '3px'}"
              size="small"
              show-elevator
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
    <Drawer title="组件属性" :closable="false" v-model="comPropertyVisible">
      <com-property :value="currentComponent" @cancel="comPropertyVisible=false"></com-property>
    </Drawer>
  </div>
</template>
<script>
import {
  ColumnType,
  ColumnTypeDic,
  ColumnStruct,
  ComponentType
} from "../../models/table-struct";
import { comProperty } from "../../../parts";
import { TABLE_SYS_DATA, OPERATION_HISTORY_DFI } from "./table-designer-dfi";
export default {
  components: {
    comProperty
  },
  data() {
    const dbopts = ColumnType;
    const dicDbOptions = ColumnTypeDic;

    const renderColumn = {
      renderHeader: (h, o) => {
        let r = null;
        const that = o.column;
        let placeholder = that.placeholder;
        let newRow = this.newField;
        switch (that.eltype) {
          case "input":
            r = h("Input", {
              attrs: {
                placeholder: placeholder,
                size: "small",
                value: newRow[that.key]
              },
              on: {
                "on-enter": e => {
                  this.createColumn(newRow);
                }
              },
              nativeOn: {
                input: e => {
                  newRow[that.key] = e.target.value;
                }
              }
            });
            break;
          case "dataType":
            let _o = [];

            dbopts.forEach(option => {
              _o.push(
                h(
                  "option",
                  {
                    attrs: {
                      value: option.value
                    }
                  },
                  option.text
                )
              );
            });

            r = h(
              "select",
              {
                attrs: {
                  placeholder: "字段类型"
                },
                domProps: {
                  value: newRow[that.key]
                },
                on: {
                  change: e => {
                    newRow[that.key] = e.target.value;
                  }
                },
                class: "ivu-select-selection",
                style: {
                  padding: "2px 3px 4px"
                }
              },
              _o
            );
            break;
          case "number":
            r = h("InputNumber", {
              attrs: {
                placeholder: placeholder,
                size: "small",
                value: newRow[that.key]
              },
              on: {
                input: v => {
                  newRow[that.key] = v;
                }
              },
              style: {
                width: "100%"
              }
            });
            break;
          case "checkbox":
            r = h("Checkbox", {
              attrs: {
                value: newRow[that.key]
              },
              on: {
                "on-change": v => {
                  newRow[that.key] = v;
                }
              }
            });
            break;
          case "component":
            r = h("exselect", {
              on: {
                iconClick: e => {
                  this.openComSetting(newRow[that.key]);
                }
              },
              attrs: {
                data: ComponentType,
                textField: "title",
                valueField: "code"
              }
            });
            break;
        }

        return r;
      },
      render: (h, o) => {
        let row = o.row;
        const that = o.column;
        let key = that.key;
        let text = row[key];
        let r = null;
        let placeholder = that.placeholder;
        if (row["system"]) {
          switch (that.eltype) {
            case "dataType":
              return h("span", dicDbOptions[text]);
            case "checkbox":
              return text
                ? h(
                    "Tag",
                    {
                      attrs: {
                        color: "primary"
                      }
                    },
                    "是"
                  )
                : h(
                    "Tag",
                    {
                      attrs: {
                        color: "default"
                      }
                    },
                    "否"
                  );
            case "component":
              break;
            default:
              return h("span", text);
          }
        }

        switch (that.eltype) {
          case "input":
            r = h("Input", {
              attrs: {
                placeholder: placeholder,
                size: "small",
                value: text
              },
              on: {
                input: v => {
                  row[key] = v;
                }
              }
            });
            break;
          case "dataType":
            let _o = [];

            dbopts.forEach(option => {
              _o.push(
                h(
                  "option",
                  {
                    attrs: {
                      value: option.value
                    }
                  },
                  option.text
                )
              );
            });

            r = h(
              "select",
              {
                attrs: {
                  placeholder: "字段类型"
                },
                domProps: {
                  value: text
                },
                class: "ivu-select-selection",
                style: {
                  padding: "2px 3px 4px"
                },
                on: {
                  change: e => {
                    row[key] = e.target.value;
                  }
                }
              },
              _o
            );
            break;
          case "number":
            r = h("InputNumber", {
              attrs: {
                placeholder: placeholder,
                size: "small",
                value: text
              },
              style: {
                width: "100%"
              },
              on: {
                input: v => {
                  row[key] = v;
                }
              }
            });
            break;
          case "checkbox":
            r = h("Checkbox", {
              attrs: {
                value: text
              },
              on: {
                input: v => {
                  row[key] = v;
                }
              }
            });
            break;
          case "component":
            return h("exselect", {
              on: {
                iconClick: e => {
                  this.openComSetting(row[key]);
                }
              },
              attrs: {
                data: ComponentType,
                textField: "title",
                valueField: "code",
                value: row[key].code
              }
            });
            break;
        }

        return r;
      }
    };

    return {
      pagenav: {
        total: 5,
        pageSize: 30
      },
      tableInfoModel: {},
      comPropertyVisible: false,
      menuTheme: "primary",
      currentComponent: {},
      newField: {
        // 新的字段
        ...ColumnStruct
      },
      tableDfi: {
        height: 200,
        columns: [
          {
            type: "selection",
            width: 55,
            minWidth: 55
          },
          {
            title: "字段",
            width: 150,
            minWidth: 150,
            children: [
              {
                width: 150,
                minWidth: 150,
                className: "td-block",
                key: "name",
                placeholder: "字段名",
                eltype: "input",
                required: true,
                renderHeader: renderColumn.renderHeader,
                render: renderColumn.render
              }
            ]
          },
          {
            title: "显示名",
            width: 150,
            minWidth: 150,
            required: true,
            children: [
              {
                width: 150,
                minWidth: 150,
                key: "display",
                className: "td-block",
                placeholder: "显示名",
                eltype: "input",
                renderHeader: renderColumn.renderHeader,
                render: renderColumn.render
              }
            ]
          },
          {
            title: "字段类型",
            width: 120,
            minWidth: 120,
            required: true,
            children: [
              {
                width: 120,
                minWidth: 120,
                key: "type",
                eltype: "dataType",
                placeholder: "字段类型",
                renderHeader: renderColumn.renderHeader,
                render: renderColumn.render
              }
            ]
          },
          {
            title: "可为空",
            width: 75,
            minWidth: 75,
            align: "center",
            children: [
              {
                width: 75,
                minWidth: 75,
                align: "center",
                key: "nullable",
                eltype: "checkbox",
                className: "td-hide-ellipsis",
                renderHeader: renderColumn.renderHeader,
                render: renderColumn.render
              }
            ]
          },
          {
            title: "唯一",
            width: 65,
            minWidth: 65,
            align: "center",
            children: [
              {
                width: 65,
                minWidth: 65,
                align: "center",
                key: "unique",
                eltype: "checkbox",
                className: "td-hide-ellipsis",
                renderHeader: renderColumn.renderHeader,
                render: renderColumn.render
              }
            ]
          },
          // {
          //   title: "表单组件",
          //   width: 120,
          //   minWidth: 120,
          //   children: [
          //     {
          //       width: 120,
          //       minWidth: 120,
          //       key: "defaultComponent",
          //       eltype: "component",
          //       className: "td-block",
          //       renderHeader: renderColumn.renderHeader,
          //       render: renderColumn.render
          //     }
          //   ]
          // },
          {
            title: "描述",
            minWidth: 260,
            children: [
              {
                minWidth: 260,
                key: "description",
                className: "td-block",
                placeholder: "描述",
                eltype: "input",
                renderHeader: renderColumn.renderHeader,
                render: renderColumn.render
              }
            ]
          },
          {
            title: "操作",
            width: 65,
            minWidth: 65,
            children: [
              {
                minWidth: 65,
                width: 65,
                renderHeader: (h, o) => {
                  return h(
                    "a",
                    {
                      attrs: {
                        title: "添加"
                      },
                      on: {
                        click: e => {
                          this.createColumn(this.newField);
                        }
                      }
                    },
                    [
                      h("Icon", {
                        attrs: {
                          type: "md-checkmark",
                          size: 20
                        }
                      })
                    ]
                  );
                },
                render: (h, o) => {
                  const row = o.row;
                  if (row["system"]) return h("span");

                  return h(
                    "Tooltip",
                    {
                      attrs: {
                        placement: "top",
                        content: "删除"
                      }
                    },
                    [
                      h(
                        "a",
                        {
                          on: {
                            click: e => {
                              this.$Modal.confirm({
                                title: "提示",
                                content: `是否删除字段【${o.row["name"]}】？`,
                                onOk: () => {
                                  const currIdx = o.index;
                                  this.tableColumns = this.tableColumns.filter(
                                    (item, index) => {
                                      return currIdx != index;
                                    }
                                  );
                                }
                              });
                            }
                          }
                        },
                        [
                          h("Icon", {
                            attrs: {
                              type: "md-trash",
                              size: 20
                            }
                          })
                        ]
                      )
                    ]
                  );
                }
              }
            ]
          }
        ]
      },
      tableColumns: [],
      newColumn: {},
      hisTable: {
        ...OPERATION_HISTORY_DFI
      }
    };
  },
  mounted() {
    const that = this;
    const $container = this.$refs.container;
    const $hiscontainer = this.$refs.hiscontainer;

    const resize = () => {
      if ($container.offsetHeight)
        this.tableDfi.height = $container.offsetHeight - 30;
      if ($hiscontainer.offsetHeight)
        this.hisTable.height = $hiscontainer.offsetHeight - 30;
    };

    window.addEventListener("resize", resize);
    resize();

    // 模拟载入数据
    this.tableColumns = [...TABLE_SYS_DATA];
  },
  methods: {
    createColumn(field) {
      // 验证
      let err = [];

      if (!field.name) err.push("字段名");
      if (!field.display) err.push("显示名");

      if (err.length) {
        this.$Message["warning"]({
          background: true,
          content: `${err.join("、")}校验必须填写`
        });
        return;
      }

      this.tableColumns.push({ ...field });
      this.newField = {
        ...ColumnStruct
      };
    },
    // 打开组件配置面板
    openComSetting(field) {
      this.currentComponent = field;
      this.comPropertyVisible = true;
    }
  }
};
</script>