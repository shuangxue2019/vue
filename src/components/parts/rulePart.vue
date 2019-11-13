<style lang="less">
.rule-part {
  .rule-part-link {
    padding: 10px 0;
    display: block;
  }
  .ivu-input-wrapper.error .ivu-input {
    border-color: #ff8c8c;
  }
}
</style>
<template>
  <div class="rule-part">
    <CheckboxGroup :value="values">
      <div v-for="(item, index) in items" :key="`rule_part_${index}`">
        <Checkbox :label="item.name">{{item.label}}</Checkbox>
        <span v-if="item.type == 'range'">
          <Input
            size="small"
            :style="{width: '55px'}"
            @on-keydown="onlyNumber"
            @on-keyup="removeZero"
            v-model="item.min"
          />
          -
          <Input
            size="small"
            :style="{width: '55px'}"
            @on-keydown="onlyNumber"
            @on-keyup="removeZero"
            v-model="item.max"
          />
        </span>
        <span v-if="item.type == 'text'">
          <Input
            size="small"
            :style="{width: '125px'}"
            v-model="item.text"
            :class="{error: item.action == 'error'}"
            @on-blur="()=>testFunction(item)"
          />
        </span>
      </div>
    </CheckboxGroup>
    <a class="rule-part-link" @click.prevent="addCustomRule">
      <Icon type="md-add" />添加自定义验证
    </a>
  </div>
</template>
<script>
import {
  FIELD_RULE_DFI,
  FIELD_RULE_DFI_DICT
} from "../designer/models/table-struct";

const arrToDict = arr => {
  let dict = {};

  (arr || []).forEach(item => {
    dict[item.name] = item;
  });

  return dict;
};

const dictToArr = dict => {
  let arr = [];

  for (let key in dict) {
    arr.push(dict[key]);
  }

  return arr;
};

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      items: [],
      values: [],
      customCount: 0
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function(val) {
        let dict = {
          ...FIELD_RULE_DFI_DICT,
          ...arrToDict(val)
        };
        let values = [];
        this.items = dictToArr(dict);
        this.customCount = 0;

        this.items.forEach(item => {
          if (item.enabled) values.push(item.name);
        });
        this.values = values;
      }
    }
  },
  methods: {
    onlyNumber(e) {
      const keyCode = e.keyCode;
      if (
        !((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105))
      ) {
        e.preventDefault();
      }
    },
    removeZero(e) {
      let val = e.target.value;
      if (val[0] == "0" && val.length > 1) {
        e.target.value = val.substring(1);
      }
    },
    addCustomRule() {
      const idx = ++this.customCount;
      this.items.push({
        name: `custom${idx}`,
        label: `自定义${idx}`,
        type: "text",
        enabled: true,
        comment: "自定义校验法则",
        action: null, // 动作，function
        text: "" // function 主体
      });
    },
    testFunction(obj) {
      try {
        // 系统调用的时候自动绑定this为{field, dataset}
        obj.action = new Function("", obj.text);
        obj.action();
      } catch (e) {
        obj.action = "error";
      }
    }
  }
};
</script>