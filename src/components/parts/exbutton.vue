<style lang="less" scoped>
.exbutton {
  overflow: hidden;
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 0 0 0 8px;
  border-radius: 4px;
  border: solid 1px #ccc;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  .exbutton-label {
    flex: 1;
    font-weight: normal;
    cursor: pointer;
  }
  .ivu-icon {
    padding: 5px 5px;
    transition: background-color ease-in 0.3s;
  }
  .ivu-icon:hover {
    background-color: #eaeaea;
  }
}
</style>
<template>
  <div class="exbutton" @click="onClick">
    <div class="exbutton-label">
      <slot></slot>
    </div>
    <Icon :type="icon" @click.stop="onIconClick" />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    icon: {
      type: String,
      default: "ios-settings"
    }
  },
  methods: {
    onClick(e) {
      if (this.$listeners["click"]) {
        this.$emit("click", e);
      }
    },
    onIconClick(e) {
      if (this.$listeners["iconClick"]) {
        this.$emit("iconClick", e);
      }
    }
  }
};
</script>