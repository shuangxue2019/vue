<style lang="less" src="./style.less">
</style>
<template>
  <!-- 数据库设计器插件 -->
  <div class="m-data-designer">
    <vue-context ref="menu" class="contextmenu">
      <Dropdown trigger="custom" :visible="true" placement="right-start" @on-click="menuClick">
        <DropdownMenu
          slot="list"
          v-if="dataTreeCurrentType=='table'|| dataTreeCurrentType=='tables'"
        >
          <DropdownItem name="new_table" v-if="dataTreeCurrentType=='tables'">新建表</DropdownItem>
          <DropdownItem name="del_table" v-if="dataTreeCurrentType=='table'">删除表</DropdownItem>
        </DropdownMenu>
        <DropdownMenu
          slot="list"
          v-else-if="dataTreeCurrentType=='query'|| dataTreeCurrentType=='querys'"
        >
          <DropdownItem name="new_query" v-if="dataTreeCurrentType=='querys'">新建查询</DropdownItem>
          <DropdownItem name="del_query" v-if="dataTreeCurrentType=='query'">删除查询</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </vue-context>
    <Split v-model="designerSplitLeft">
      <div slot="left" class="m-data-designer-left" @contextmenu.prevent="()=>{return;}">
        <v-jstree :data="dataTreeNodes" :multiple="false" :item-events="dataTreeEvents"></v-jstree>
        <vspin :loading="menuLoading"></vspin>
      </div>
      <div slot="right" @contextmenu.prevent="()=>{return;}">
        <div class="m-data-designer-pane right">
          <table-designer v-if="comType=='table'"></table-designer>
          <query-designer v-else-if="comType=='query'"></query-designer>
          <div v-else>数据表设计器</div>
        </div>
      </div>
    </Split>

    <!-- 添加表 -->
    <Modal v-model="tableForm.visible" title="添加新的表" @on-ok="tableSubmit">
      <Form :model="tableForm.model" :rules="tableForm.rules" :label-width="80">
        <FormItem label="表名称" prop="name">
          <Input v-model="tableForm.model.name" placeholder="请输入表的名称" />
        </FormItem>
        <FormItem label="表编码" prop="code">
          <Input v-model="tableForm.model.code" placeholder="表的编码，必须是唯一的" />
        </FormItem>
        <FormItem label="表注释" prop="descr">
          <Input v-model="tableForm.model.descr" placeholder="表注释信息" type="textarea" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { VueContext } from "vue-context";
import VJstree from "vue-jstree";
import { TableDesigner, QueryDesigner } from "./components";
import { getMenu } from "&/designer/data";

const INIT_TREE_DFI = {
  opened: false,
  selected: false
};

const GetTreeNode = data => {
  const arr = [];
  if (!data || !data.length) return arr;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let o = {
      ...INIT_TREE_DFI,
      ...item
    };

    switch (item.type) {
      case "table":
        o.icon = "fa fa-table";
        break;
      case "query":
        o.icon = "fa fa-search";
        break;
    }

    if (item.children) {
      let c = GetTreeNode(item.children);
      if (c.length) {
        o.children = c;
      }
    }
    arr.push(o);
  }

  return arr;
};

export default {
  data() {
    return {
      menuLoading: false,
      designerSplitLeft: "160px",
      designerSplitTop: 0.5,
      dataTree: null,
      dataTreeEvents: {
        contextmenu: (node, item, e) => {
          e.preventDefault();
          this.$refs.menu.open(e, {});
          this.dataTreeCurrentType = item.type;
        },
        click: (node, item, e) => {
          switch (item.type) {
            case "table":
              this.openTable(item.text);
              break;
            case "query":
              this.openQuery(item.text);
              break;
          }
        }
      },
      dataTreeCurrentType: null,
      comType: "",
      tableForm: {
        visible: false,
        model: {},
        rules: {
          name: [
            {
              required: true,
              message: "表名称必须填写",
              trigger: "blur"
            }
          ],
          code: [
            {
              required: true,
              message: "表编码必须填写"
            }
          ]
        }
      }
    };
  },
  components: {
    VueContext,
    TableDesigner,
    QueryDesigner,
    VJstree
  },
  computed: {
    dataTreeNodes() {
      return GetTreeNode(this.dataTree);
    }
  },
  methods: {
    getMenu() {
      this.menuLoading = true;
      getMenu()
        .then(res => {
          this.$u.resCall(this, res, res => {
            this.dataTree = res.data;
          });
        })
        .catch(e => {
          this.$u.msg.problem(this, e);
        })
        .then(() => {
          this.menuLoading = false;
        });
    },
    // 打开表
    openTable(name) {
      this.comType = "table";
    },
    // 新建表
    newTable() {
      const initDb = {
        name: "",
        code: "",
        descr: ""
      };

      this.tableForm.model = {
        ...initDb
      };

      this.tableForm.visible = true;
      console.log("新加表");
    },
    // 打开查询
    openQuery(name) {
      this.comType = "query";
    },
    // 提交表单
    tableSubmit() {},
    // 提交查询
    querySubmit() {},
    menuClick(name) {
      switch (name) {
        case "new_table":
          // 新增表
          this.newTable();
          break;
        case "del_table":
          // 删除表
          break;
        case "new_query":
          // 新增查询
          break;
        case "del_query":
          // 删除查询
          break;
      }
    }
  },
  mounted() {
    this.getMenu();
  }
};
</script>