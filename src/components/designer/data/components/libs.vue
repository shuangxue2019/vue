<style lang="less">
.ivu-drawer-drag {
  z-index: 10;
}
.m-designer-libs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .m-designer-libs-tree,
  .m-designer-libs-descr {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 10px;
  }
  .m-designer-libs-descr {
    top: 6px;
  }
  &-code {
    position: absolute;
    top: 50px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    overflow: auto;
    font-size: 12px;
    &-comment {
      font-style: italic;
      color: #2a8e2f;
    }
    &-template {
      padding: 10px 0;
    }
  }
}
</style>
<template>
  <div class="m-designer-libs">
    <Split v-model="split" mode="vertical">
      <div slot="top">
        <div class="m-designer-libs-tree">
          <v-jstree :data="treeNodes" :multiple="false" @item-click="onTreeClick"></v-jstree>
        </div>
      </div>
      <div slot="bottom">
        <div class="m-designer-libs-descr">
          <tool-bar>
            <div slot="right">
              <tool-button
                icon="ios-copy"
                label="复制"
                v-clipboard:copy="libCode.template"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError"
              />
              <tool-button icon="md-checkmark" color="green" label="应用" />
            </div>
          </tool-bar>
          <div class="m-designer-libs-code">
            <p class="m-designer-libs-code-comment">{{libCode.comment}}</p>
            <p class="m-designer-libs-code-template">{{libCode.template}}</p>
          </div>
        </div>
      </div>
    </Split>
  </div>
</template>
<script>
import VJstree from "vue-jstree";
import "font-awesome/css/font-awesome.min.css";

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
      case "module":
        o.icon = "fa fa-cubes";
        break;
      case "code":
        o.icon = "fa fa-code";
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
  components: {
    VJstree
  },
  data() {
    return {
      split: 0.5,
      libData: [],
      libCode: {
        comment: "",
        template: ""
      }
    };
  },
  computed: {
    treeNodes() {
      return GetTreeNode(this.libData);
    }
  },
  mounted() {
    this.libData = [
      {
        text: "Sys",
        type: "folder",
        children: [
          {
            text: "Core",
            type: "module",
            children: [
              {
                text: "Test",
                type: "code",
                tooltip: "方法名",
                comment: "描述信息",
                template: "test();"
              },
              {
                text: "Test2",
                type: "code",
                tooltip: "方法名",
                comment: "描述信息",
                template: "test();"
              },
              {
                text: "Test3",
                type: "code",
                tooltip: "方法名",
                comment: "描述信息",
                template: "test();"
              },
              {
                text: "Test4",
                type: "code",
                tooltip: "方法名",
                comment: "描述信息",
                template: "test();"
              },
              {
                text: "Test5",
                type: "code",
                tooltip: "方法名",
                comment: "描述信息",
                template: "test();"
              }
            ]
          }
        ]
      },
      {
        text: "data",
        type: "folder",
        children: [
          {
            text: "getTable",
            type: "code",
            tooltip: "获取表数据",
            comment: "获取表数据",
            template: "getTable(tablename);"
          }
        ]
      }
    ];
  },
  methods: {
    onTreeClick(node, item, e) {
      this.libCode.comment = item.comment || "";
      this.libCode.template = item.template || "";
    },
    onCopySuccess() {
      this.$Message.info("复制成功");
    },
    onCopyError() {
      this.$Message.error("复制失败，请用Ctrl+C复制");
    }
  }
};
</script>