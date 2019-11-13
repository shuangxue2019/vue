<style lang="less" scoped>
.exselect {
  overflow: hidden;
  display: block;
  position: relative;
  align-items: center;
  background: #ffffff;
  border-radius: 4px;
  border: solid 1px #ccc;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  select {
    border: none;
    padding: 2px 3px 4px;
    outline: none;
    width: 100%;
  }
  .ivu-icon {
    padding: 5px;
    transition: background-color ease-in 0.3s;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }
  .ivu-icon:hover {
    background-color: #eaeaea;
  }
}
</style>
<template>
  <div class="exselect">
    <select ref="exselect">
      <option
        v-for="(item, index) in options"
        :key="`${componentId}${index}`"
        :value="item[valueField]"
        :selected="value === item[valueField] ? 'selected':''"
      >{{item[textField]}}</option>
    </select>
    <Icon :type="icon" @click.stop="onIconClick" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      componentId: `__ex_${parseInt(Math.random() * 10000000)
        .toString(16)
        .substring(0, 4)}_`
    };
  },
  props: {
    icon: {
      type: String,
      default: "ios-settings"
    },
    value: [String, Number, Boolean],
    data: {
      type: Object
    },
    textField: {
      type: String
    },
    valueField: {
      type: String
    }
  },
  computed: {
    options() {
      if (this.data instanceof Array) return this.data;
      let arr = [];
      for (let key in this.data) {
        arr.push(this.data[key]);
      }

      return arr;
    }
  },
  methods: {
    onIconClick(e) {
      if (this.$listeners["iconClick"]) {
        this.$emit("iconClick", e);
      }
    }
  },
  mounted(){
  }
};
</script>