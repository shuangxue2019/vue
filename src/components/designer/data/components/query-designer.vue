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
    <vspin :loading="queryLoading"></vspin>
    <tool-bar>
      <tool-button icon="ios-play" label="运行" color="green" @click="onExecute" />
      <!-- <tool-button icon="md-radio-button-on" label="停止" color="red" /> -->
      <tool-button icon="md-checkmark" label="保存" @click="onSave" :event="!config.saving" />
      <tool-button icon="ios-document" label="另存为" @click="openSaveAs" />
      <!-- <tool-button icon="ios-leaf" label="格式化" /> -->
      <div slot="right">
        <tool-button icon="logo-javascript" label="类库" :onlyIcon="true" @click="libs.visible=true" />
      </div>
    </tool-bar>
    <Split v-model="split.value" mode="vertical" :min="split.min" @on-move-end="onSplitChange">
      <div slot="top" class="query-designer-text">
        <code-edit v-model="config.model.body"></code-edit>
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
                <FormItem label="查询描述" prop="comment">
                  <Input
                    v-model="config.model.comment"
                    type="textarea"
                    :autosize="{minRows: 2,maxRows: 5}"
                    placeholder="查询描述"
                    class="no-resize"
                  />
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
    <!-- 另存查询 -->
    <Modal v-model="config.saveAsVisible" title="另存查询为" @on-ok="onSaveAs">
      <Form :model="config.saveAsModel" :rules="config.saveAsRules" :label-width="80">
        <FormItem label="查询编码" prop="code">
          <Input v-model="config.saveAsModel.code" placeholder="请输入查询编码" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { codeEdit } from "../../../parts";
import libs from "./libs";
import {
  getQuery,
  exeQueryTest,
  saveQuery,
  saveQueryAs
} from "&/designer/data";
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
  props: {
    code: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      queryCode: this.code,
      queryLoading: false,
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
        saving: false,
        saveAsVisible: false,
        saveAsRules: {
          code: [
            {
              required: true,
              message: "查询编码必须要填写，且必须是唯一的",
              trigger: "blur"
            }
          ]
        },
        saveAsModel: {
          code: this.queryCode
        },
        model: {
          name: "",
          comment: "",
          template: "",
          body: ""
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
  watch: {
    code: {
      immediate: true,
      handler: async function(code) {
        this.queryLoading = true;
        await this.getQuery(code);
        this.queryLoading = false;
        this.queryCode = code;
        this.config.saveAsModel.code = code;
      }
    }
  },
  mounted() {
    const resize = () => {
      this.onSplitChange();
    };
    window.addEventListener("resize", resize);
    setTimeout(resize, 10);
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
    },
    async getQuery(code) {
      await getQuery(code)
        .then(res => {
          this.$u.resCall(this, res, res => {
            this.config.model = res.data;
          });
        })
        .catch(e => {
          this.$u.msg.problem(this, e);
        });
    },
    // 执行查询测试
    onExecute() {
      this.table.loading = true;
      exeQueryTest(this.queryCode)
        .then(res => {
          this.$u.resCall(this, res, res => {
            const { columns = [], data = [] } = res.data;
            this.table.columns = columns;
            this.table.totalData = data;
            this.table.nav.page = 1;
            this.onTablePageChange(this.table.nav.page);
          });
        })
        .catch(e => {
          this.$u.msg.problem(this, e);
        })
        .then(() => {
          this.table.loading = false;
        });
    },
    // 保存查询
    onSave() {
      this.$u.call(
        this,
        e => {
          return saveQuery(this.config.model);
        },
        {
          start: () => {
            this.config.saving = true;
          },
          end: () => {
            this.config.saving = false;
          }
        }
      );
    },
    // 打开另存为界面
    openSaveAs() {
      this.config.saveAsModel = {
        ...{
          code: this.queryCode
        }
      };
      this.config.saveAsVisible = true;
    },
    // 将查询另存为
    onSaveAs() {
      this.$u.call(this, e => {
        e.success = res => {
          this.queryCode = this.config.saveAsModel.code;
          console.log("成功")
        };
        return saveQueryAs(this.config.saveAsModel);
      });
    }
  }
};
</script>