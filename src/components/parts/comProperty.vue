<style lang="less">
.com-property {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow: auto;
  & > .ivu-card {
    &:hover {
      box-shadow: none;
    }
    & > .ivu-card-head {
      border-bottom: none;
      padding: 5px 0;
      .ivu-divider {
        margin: 10px 0;
      }
    }
    .com-item-block {
      .ivu-cell-main {
        display: block;
      }
    }
    .ivu-cell {
      overflow: visible;
    }
  }
}
.com-property-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 8px 16px;
  background-color: #fff;
  border-top: solid 1px #e8eaec;
  text-align: center;
  .ivu-btn {
    margin: 0 10px;
    width: 75px;
  }
}
</style>
<template>
  <div>
    <div class="com-property">
      <Card
        :padding="0"
        :bordered="false"
        v-for="(item, index) in propGroups"
        :key="`${componentId}${index}`"
      >
        <div slot="title">
          <Divider>
            <Icon :type="item.icon" />
            {{item.title}}
          </Divider>
        </div>
        <CellGroup>
          <Cell
            v-for="(prop, idx) in item.items"
            :key="`${componentId}_c_${idx}`"
            class="com-item-block"
          >
            <label slot>
              {{prop.label}}
              <Tooltip v-if="!!prop.comment" :content="prop.comment" placement="top">
                <Icon type="ios-information-circle" />
              </Tooltip>
            </label>
            <Input
              slot="label"
              v-if="prop.type == 'text' || prop.type== 'textarea'"
              v-model="com[prop.key]"
              :type="prop.type"
              :placeholder="prop.placeholder"
              :prefix="prop.icon || ''"
            />
            <Switch
              v-else-if="prop.type == 'switch'"
              slot="extra"
              :name="prop.key"
              v-model="com[prop.key]"
            >
              <span slot="open">是</span>
              <span slot="close">否</span>
            </Switch>
            <rule-part v-else-if="prop.type == 'rule'" :value="com[prop.key]" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div class="com-property-footer">
      <Button @click.prevent="onCancle">取消</Button>
      <Button type="primary" @click.prevent="onSubmit">保存</Button>
    </div>
  </div>
</template>
<script>
import {
  COM_ITEM_DFI,
  RULE_FORMAT,
  FIELD_RULE_DFI
} from "../designer/models/table-struct";
import rulePart from "./rulePart";
export default {
  components: {
    rulePart
  },
  data() {
    return {
      propGroups: null,
      com: {},
      componentId: `__com_${parseInt(Math.random() * 10000000)
        .toString(16)
        .substring(0, 4)}_`
    };
  },
  props: {
    value: {
      type: Object,
      default: {}
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(com) {
        if (!com) {
          this.propGroups = [];
          this.com = {};
          return;
        }

        let propList = [];
        let _com = {};
        let isPropGroup = new RegExp("Props$");
        for (let propKey in com) {
          if (!isPropGroup.test(propKey)) continue;
          let item = com[propKey];
          let propItems = [];
          let propGroup = {
            title: item._title,
            icon: item._icon,
            items: propItems
          };

          propList.push(propGroup);

          for (let key in item) {
            if (key[0] === "_") continue;

            propItems.push({
              ...COM_ITEM_DFI[key],
              key: key
            });
            _com[key] = item[key];
          }
        }

        this.propGroups = propList;
        this.com = _com;
      }
    }
  },
  methods: {
    onSubmit(e) {
      const func = this.$listeners["submit"];
      if (func) {
        func(this.value);
      }
      console.log(this.value);
      console.log(this.com);
    },
    onCancle(e) {
      const func = this.$listeners["cancel"];
      if (func) {
        func();
      }
    }
  }
};
</script>