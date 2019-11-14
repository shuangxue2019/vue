<style lang="less">
.m-top-tool-btn {
  display: inline-block;
  margin: 0 5px;
  color: #333;
  user-select: none;
  &.red {
    color: #f35353;
  }
  &.green {
    color: #4bc451;
  }
  &:hover {
    color: #2d8cf0;
  }
  * {
    vertical-align: bottom !important;
  }
}
</style>
<template>
  <a :class="['m-top-tool-btn', color]" @click.prevent="onClick" :disabled="disabled">
    <span v-if="!onlyIcon">
      <Icon :type="icon" :size="20" />
      {{label}}
    </span>
    <span v-else>
      <Tooltip :content="label" placement="right">
        <Icon :type="icon" :size="20" />
      </Tooltip>
    </span>
  </a>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: "ios-cube"
    },
    label: {
      type: String,
      default: "未命名按钮"
    },
    color: {
      type: String,
      default: "default"
    },
    onlyIcon: {
      type: Boolean,
      default: false
    },
    // 禁止点击
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否事件有效
    event: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onClick(e) {
      if (!this.event) return false;
      const func = this.$listeners["click"];
      if (func) {
        this.$emit("click", e);
      }
    }
  }
};
</script>