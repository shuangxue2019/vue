<style scoped lang="less">
.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  h1 {
    height: 150px;
    img {
      height: 100%;
    }
  }
  h2 {
    color: #666;
    margin-bottom: 200px;
    p {
      margin: 0 0 50px;
    }
  }
  .ivu-row-flex {
    height: 100%;
  }
}
</style>
<template>
  <div class="index">
    <data-designer></data-designer>
  </div>
</template>
<script>
import { DataDesigner } from "_/designer";
export default {
  components: {
    DataDesigner
  },
  methods: {
    handleStart() {
      this.$Modal.info({
        title: "Bravo",
        content: "Now, enjoy the convenience of View UI."
      });
    }
  }
};
</script>
