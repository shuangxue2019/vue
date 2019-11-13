<style lang="less">
.code-edit-container {
  height: 100%;
  &.border {
    border: solid 1px #dcdee2;
    border-radius: 5px;
    overflow: hidden;
  }
  .CodeMirror {
    height: 100%;
  }
}
</style>
<template>
  <codemirror
    :class="['code-edit-container', {border: border}]"
    :options="editOption"
    v-model="codeValue"
    @input="$emit('input', codeValue)"
    ref="code"
  ></codemirror>
</template>
<script>
import { codemirror } from "vue-codemirror";
//导入使用的语言语法定义文件
require("codemirror/mode/javascript/javascript.js");
//导入选中的theme文件
require("codemirror/theme/blackboard.css");
//导入自动提示核心文件及样式
require("codemirror/addon/hint/show-hint.css");
require("codemirror/addon/hint/show-hint.js");
//导入指定语言的提示文件
require("codemirror/addon/hint/javascript-hint.js");

export default {
  components: {
    codemirror
  },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.codeValue = val;
      },
      immediate: true
    }
  },
  data() {
    return {
      codeValue: "",
      editOption: {
        mode: { name: "javascript", json: true },
        lineNumbers: true,
        matchBrackets: true, //括号匹配
        autoCloseBrackets: true,
        lineWrapping: true,
        autoRefresh: true,
        cursorHeight: 1
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.code.codemirror.refresh();
    });
  }
};
</script>