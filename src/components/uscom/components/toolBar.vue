<style lang="less">
.m-top-tool {
  padding: 5px;
  border: solid 1px #dedede;
  user-select: none;
  overflow: hidden;
  &._no-border {
    border: none;
  }
  &-right {
    float: right;
  }
}
</style>
<template>
  <div :class="['m-top-tool', {'_no-border': !border}]">
    <div v-if="!!this.$slots.right" class="m-top-tool-right">
      <slot name="right"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  mounted() {
  }
};
</script>