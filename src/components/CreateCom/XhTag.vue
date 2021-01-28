<template>
  <div class="label">
    <span
      v-for="(item, index) in labelList"
      :style="{'background': item.color ? item.color : '#ccc'}"
      :key="index"
      class="item-color">
      {{ item.labelName }}
    </span>
    <div class="add-tag">
      <tag-index
        :placement="'right'"
        :task-data="taskData"
        :is-key-word="true"
        @change="otherChange($event, data)"
        @select="selectLabelList">
        <span
          slot="editIndex"
          class="add-btn">
          <i class="wk wk-l-plus" />
          <!-- <span class="label">标签</span> -->
          标签
        </span>
      </tag-index>

    </div>


  </div>
</template>

<script>
import TagIndex from '@/views/taskExamine/task/components/tag/tagIndex'


export default {
  name: 'XhTag',
  components: { TagIndex },
  props: {
    index: Number,
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      taskData: {},
      labelList: []
    }
  },
  computed: {
    /**
     * 标签
     */
    labelList1: {
      // console.log(this.taskData.labelList)
      get: function() {
        if (!this.taskData) {
          return []
        }
        console.log(this.taskData.labelList)
        return this.taskData.labelList || []
      }

    }
  },
  watch: {
    value: {
      handler(val) {
        if (this.isImpersonality) {
          this.impersonality = val
        } else {
          this.subjectivity = val
        }
      },
      immediate: true
    },

    taskData: {
      handler(val, oldVal) {
        console.log('监听 taskData', val, oldVal)
      },
      deep: true,
      immediate: true
    },

    labelList(newValue, oldValue) {
      console.log('监听labelList')
      // if (oldValue) {
      //   this.$emit('on-handle', {
      //     type: 'change-label',
      //     value: newValue,
      //     index: this.detailIndex,
      //     section: this.detailSection
      //   })
      // }
    }
  },
  methods: {
    otherChange(data, field) {
      console.log('otherChange')
      console.log(data, field)
    },
    selectLabelList(data) {
      console.log('selectLabelList')
      console.log(data)
      this.labelList = data
    },
    valueChange(val) {
      console.log('val', val)
      this.$emit('value-change', { index: this.index, value: val })
    },
    impersonalityChange(val) {
      console.log('选择的值', val)
      this.$emit('value-change', { index: this.index, value: val })
    }
  }
}
</script>

<style lang="scss" scoped>
$btn-b-color: #f8faff;
$btn-color: #333333;
$btn-b-hover-color: #eff4ff;

// 标签
.label {
  &-title {
    color: #999999;
    font-size: 12px;
    margin-bottom: 10px;
  }
  white-space: normal;
  .item-color {
    padding: 0 10px;
    color: #fff;
    font-size: 12px;
    margin-right: 5px;
    border-radius: 3px;
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin-bottom: 5px;
  }

  .add-tag {
    line-height: 18px;
    display: inline-block;
  }
}

// 添加btn
.add-btn {
  // margin-top: 5px;
  font-size: 12px;
  height: 22px;
  color: $btn-color;
  background-color: $btn-b-color;
  border-radius: $xr-border-radius-base;
  display: inline-block;
  padding: 3px 10px;
  cursor: pointer;

  .wk-l-plus {
    font-size: 12px;
  }
}

.add-btn:hover {
  color: $xr-color-primary;
  background-color: $btn-b-hover-color;
}

</style>
