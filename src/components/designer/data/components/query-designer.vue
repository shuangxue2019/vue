<style lang="less">
.query-designer {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .no-resize textarea {
    resize: none;
  }
  .ivu-split-wrapper {
    border: solid 1px #dcdee2;
    border-top: none;
    flex: 1;
  }
  .ivu-split-pane {
    position: absolute;
    .query-designer-text,
    .query-designer-view {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: auto;
    }
    .query-designer-view {
      top: 6px;
      padding: 10px 0 0;
      .ivu-tabs {
        height: 100%;
        .ivu-tabs-bar {
          margin-bottom: 5px;
        }
        .ivu-tabs-nav {
          margin-left: 10px;
        }
        .ivu-tabs-content {
          position: absolute;
          left: 5px;
          right: 5px;
          bottom: 5px;
          top: 37px;
        }
        .ivu-tabs-tabpane {
          height: 100%;
          position: relative;
          .ivu-tabs-tabpane-full {
            height: 100%;
            overflow: hidden;
            .ivu-table-small td {
              height: 25px;
            }
            .ivu-tabs-tabpane-nav-txt {
              flex: 1;
              padding: 10px;
              overflow: auto;
              border: solid 1px #dcdee2;
            }
          }
          .ivu-tabs-tabpane-nav {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 30px;
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="query-designer">
    <tool-bar>
      <tool-button icon="ios-play" label="运行" color="green" />
      <tool-button icon="md-radio-button-on" label="停止" color="red" />
      <tool-button icon="md-checkmark" label="保存" />
      <tool-button icon="ios-document" label="另存为" />
      <tool-button icon="ios-leaf" label="格式化" />
      <div slot="right">
        <tool-button icon="logo-javascript" label="类库" :onlyIcon="true" @click="libs.visible=true" />
      </div>
    </tool-bar>
    <Split v-model="split.value" mode="vertical" :min="split.min" @on-move-end="onSplitChange">
      <div slot="top" class="query-designer-text">
        <code-edit></code-edit>
      </div>
      <div slot="bottom" class="query-designer-view">
        <Tabs type="card" :animated="false">
          <TabPane label="列表">
            <div ref="table" class="ivu-tabs-tabpane-full">
              <Table
                :columns="table.columns"
                :data="table.data"
                :height="table.height"
                :border="true"
                :loading="table.loading"
                size="small"
              ></Table>
              <Page
                :total="table.totalData.length"
                :page-size="table.nav.pageSize"
                :current="table.nav.page"
                :style="{marginTop: '3px'}"
                size="small"
                show-elevator
                @on-change="onTablePageChange"
              />
            </div>
          </TabPane>
          <TabPane label="JSON">
            <div class="ivu-tabs-tabpane-full" style="display: flex; flex-direction: column;">
              <div class="ivu-tabs-tabpane-nav-txt">
                <div v-for="(item, index) in jsonTextArr" :key="`json_text_${index}`">{{item}}</div>
              </div>
              <Page
                :total="table.totalData.length"
                :page-size="table.nav.pageSize"
                :current="table.nav.page"
                :style="{marginTop: '3px'}"
                size="small"
                show-elevator
                @on-change="onTablePageChange"
              />
            </div>
          </TabPane>
          <TabPane label="配置">
            <!--仅被保存为方法的查询可以显示这个选项卡-->
            <!--自动生成UUID作为唯一识别码-->
            <div class="ivu-tabs-tabpane-full" :style="{overflow: 'auto'}">
              <Form :model="config.model" :rules="config.rules" :label-width="80">
                <FormItem label="查询名称" prop="name">
                  <Input v-model="config.model.name" placeholder="查询名称" />
                </FormItem>
                <FormItem label="调用模板" prop="template">
                  <code-edit :border="true" v-model="config.model.template"></code-edit>
                </FormItem>
                <FormItem label="查询描述" prop="descr">
                  <Input
                    v-model="config.model.descr"
                    type="textarea"
                    :autosize="{minRows: 2,maxRows: 5}"
                    placeholder="查询描述"
                    class="no-resize"
                  />
                </FormItem>
                <FormItem>
                  <Button type="primary">提交</Button>
                  <Button style="margin-left: 8px">重置</Button>
                </FormItem>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Split>
    <Drawer
      title="类库"
      :closable="true"
      :mask="false"
      :width="libs.width"
      :draggable="true"
      v-model="libs.visible"
    >
      <libs></libs>
    </Drawer>
  </div>
</template>
<script>
import { codeEdit } from "../../../parts";
import libs from "./libs";
const INIT_COLUMN = {
  width: 100,
  minWidth: 100,
  ellipsis: true
};
const FULL_COLUMN = {
  title: " "
};
export default {
  components: {
    codeEdit,
    libs
  },
  data() {
    return {
      table: {
        height: 200,
        columns: [],
        data: [],
        totalData: [],
        loading: false,
        nav: {
          page: 1,
          pageSize: 50
        }
      },
      config: {
        model: {
          name: "",
          descr: "",
          template: "test 123"
        },
        rules: {
          name: [
            {
              required: true,
              message: "查询名称必须要填写，且必须是唯一的",
              trigger: "blur"
            }
          ]
        }
      },
      split: {
        value: "60px",
        min: "20px"
      },
      libs: {
        visible: false,
        width: 256 // 数据未来来自与全局参数，将与左侧同宽
      }
    };
  },
  computed: {
    jsonTextArr() {
      return this.table.data.map(item => {
        return `${JSON.stringify(item).toString()}`;
      });
    }
  },
  mounted() {
    const resize = () => {
      this.onSplitChange();
    };
    window.addEventListener("resize", resize);
    setTimeout(resize, 10);

    // test
    this.table.loading = true;
    setTimeout(() => {
      this.table.columns = [
        { ...INIT_COLUMN, title: "编码", key: "code" },
        { ...INIT_COLUMN, title: "标题", key: "title" },
        { ...INIT_COLUMN, title: "ID", key: "ID" },
        { ...FULL_COLUMN }
      ];

      // 载入1000条数据看看
      const arr = [];
      for (let i = 0; i < 1000; i++) {
        arr.push({
          code: (i + 1).toString().padStart(5, "0"),
          title: `测试_${i + 1}`,
          ID: i + 1
        });
      }

      this.table.totalData = arr;
      this.table.nav.page = 1;
      this.onTablePageChange(this.table.nav.page);
      this.table.loading = false;
    }, 500);
  },
  methods: {
    onTablePageChange(page) {
      const pageSize = this.table.nav.pageSize;
      this.table.data = this.table.totalData.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
    },
    onSplitChange() {
      const $table = this.$refs.table;
      if (!$table || !$table.offsetHeight) return;
      this.table.height = $table.offsetHeight - 30;
    }
  }
};
</script>