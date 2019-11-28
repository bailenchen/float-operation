<template>
  <div>
    <div
      v-if="description"
      class="scene-name">{{ description }}</div>
    <flexbox class="scene-list">
      <div class="scene-list-box">
        <flexbox class="scene-list-head">
          <el-checkbox
            :indeterminate="isleftIndeterminate"
            v-model="checkleftAll"
            @change="handleleftCheckAllChange"/>
          <div class="scene-list-head-name">显示的列</div>
          <div class="scene-list-head-detail">{{ leftCheckItems.length + '/' + checkedLeftData.length }}</div>
        </flexbox>
        <div style="position: relative;">
          <div class="scene-list-search">
            <el-input
              v-model="leftInput"
              placeholder="请输入"
              size="small"
              suffix-icon="el-icon-search"
              @input="inputLeftChange"/>
          </div>
          <div class="scene-list-body">
            <draggable
              v-model="checkedLeftData"
              :move="leftMove"
              :options="{group: 'list',forceFallback:true}"
              style="min-height: 100px;"
              @end="leftMoveEnd">
              <flexbox
                v-for="(item, index) in checkedLeftData"
                v-if="item.show"
                :key="index"
                class="list-item">
                <el-checkbox
                  v-model="item.check"
                  class="list-item-check"
                  @change="leftCheckItemChange"/>
                <div class="list-item-name">{{ item.name }}</div>
              </flexbox>
            </draggable>
          </div>
        </div>
      </div>
      <div class="scene-middle-list">
        <el-button
          :class="{'scene-middle-button-select':rightCheckItems.length > 0}"
          :disabled="rightCheckItems.length == 0"
          class="scene-middle-left-button"
          @click="changePositon('left')">
          <i class="el-icon-arrow-left scene-middle-icon"/>
        </el-button>
        <el-button
          :class="{'scene-middle-button-select':leftCheckItems.length > 0}"
          :disabled="leftCheckItems.length == 0"
          class="scene-middle-right-button"
          @click="changePositon('right')">
          <i class="el-icon-arrow-right scene-middle-icon"/>
        </el-button>
      </div>
      <div class="scene-list-box">
        <flexbox class="scene-list-head">
          <el-checkbox
            :indeterminate="isrightIndeterminate"
            v-model="checkrightAll"
            @change="handlerightCheckAllChange"/>
          <div class="scene-list-head-name">隐藏的列</div>
          <div class="scene-list-head-detail">{{ rightCheckItems.length + '/' + checkedRightData.length }}</div>
        </flexbox>
        <div style="position: relative;">
          <div class="scene-list-body">
            <div class="scene-list-search">
              <el-input
                v-model="rightInput"
                placeholder="请输入"
                size="small"
                suffix-icon="el-icon-search"
                @input="inputRightChange"/>
            </div>
            <draggable
              v-model="checkedRightData"
              :move="rightMove"
              :options="{group: 'list',forceFallback:true}"
              style="min-height: 100px;"
              @end="rightMoveEnd">
              <flexbox
                v-for="(item, index) in checkedRightData"
                v-if="item.show"
                :key="index"
                class="list-item">
                <el-checkbox
                  v-model="item.check"
                  class="list-item-check"
                  @change="rightCheckItemChange"/>
                <div class="list-item-name">{{ item.name }}</div>
              </flexbox>
            </draggable>
          </div>
        </div>
      </div>
    </flexbox>
  </div>
</template>

<script type="text/javascript">
import draggable from 'vuedraggable'

export default {
  name: 'FieldsManager',

  components: {
    draggable
  },

  props: {
    description: String, // 操作描述
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    // 是否是公海 客户模块的辅助参数
    isSeas: {
      type: Boolean,
      default: false
    },
    // 数据源
    data: Object
  },

  data() {
    return {
      isleftIndeterminate: false, // 标注头部是多选框效果
      checkleftAll: false, // 关联全选操作多选框

      leftInput: '',
      checkedLeftData: [], // 数据源
      leftCheckItems: [], // 选择的数据源

      isrightIndeterminate: false,
      checkrightAll: false,

      rightInput: '',
      checkedRightData: [],
      rightCheckItems: [],

      moveItem: {}, // 移动中的item
      handlDefaultItem: {} // 设置默认的中间item
    }
  },

  watch: {
    data() {
      this.refreshFieldData()
    }
  },

  mounted() {
    // 为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }

    this.refreshFieldData()
  },

  methods: {
    /**
     * 刷洗字段信息
     */
    refreshFieldData() {
      this.checkedLeftData = this.data ? this.data.left : []
      this.checkedRightData = this.data ? this.data.right : []
    },

    /**
     * 搜索操作
     */
    inputLeftChange(val) {
      this.checkedLeftData = this.checkedLeftData.map(function(item, index) {
        if (item.name.indexOf(val) != -1) {
          item.show = true
        } else {
          item.show = false
        }
        return item
      })
    },

    /**
     * 搜索操作
     */
    inputRightChange(val) {
      this.checkedRightData = this.checkedRightData.map(function(item, index) {
        if (item.name.indexOf(val) != -1) {
          item.show = true
        } else {
          item.show = false
        }
        return item
      })
    },

    /** 拖拽操作 */
    rightMoveEnd(evt) {
      this.moveItem.check = false
      this.leftCheckItemChange()
      this.rightCheckItemChange()

      this.$emit('change', {
        left: this.checkedLeftData,
        right: this.checkedRightData
      })
    },

    rightMove(obj) {
      this.moveItem = obj.draggedContext.element
    },

    leftMoveEnd(evt) {
      this.moveItem.check = false
      this.leftCheckItemChange()
      this.rightCheckItemChange()

      this.$emit('change', {
        left: this.checkedLeftData,
        right: this.checkedRightData
      })
    },

    leftMove(obj) {
      this.moveItem = obj.draggedContext.element
    },

    // 选择全部
    handleleftCheckAllChange(value) {
      if (value) {
        this.isleftIndeterminate = false
      }
      this.checkedLeftData = this.checkedLeftData.filter(function(
        item,
        index,
        array
      ) {
        item.check = value
        return item
      })
      this.leftCheckItems = value ? this.checkedLeftData : []
    },

    leftCheckItemChange() {
      this.leftCheckItems = this.checkedLeftData.filter(function(
        item,
        index,
        array
      ) {
        return item.check == true
      })
      if (this.leftCheckItems.length > 0) {
        if (this.leftCheckItems.length == this.checkedLeftData.length) {
          this.checkleftAll = true
          this.isleftIndeterminate = false
        } else {
          this.checkleftAll = false
          this.isleftIndeterminate = true
        }
      } else {
        this.checkleftAll = false
        this.isleftIndeterminate = false
      }
    },

    // 选择全部
    handlerightCheckAllChange(value) {
      if (value) {
        this.isrightIndeterminate = false
      }
      this.checkedRightData = this.checkedRightData.filter(function(
        item,
        index,
        array
      ) {
        item.check = value
        return item
      })
      this.rightCheckItems = value ? this.checkedRightData : []
    },

    rightCheckItemChange() {
      this.rightCheckItems = this.checkedRightData.filter(function(
        item,
        index,
        array
      ) {
        return item.check == true
      })
      if (this.rightCheckItems.length > 0) {
        if (this.rightCheckItems.length == this.checkedRightData.length) {
          this.checkrightAll = true
          this.isrightIndeterminate = false
        } else {
          this.checkrightAll = false
          this.isrightIndeterminate = true
        }
      } else {
        this.checkrightAll = false
        this.isrightIndeterminate = false
      }
    },

    // 按钮操作
    changePositon(type) {
      var self = this
      // 从右往左
      if (type == 'left') {
        this.checkedRightData = this.checkedRightData.filter(function(
          item,
          index,
          array
        ) {
          var remove = false
          self.rightCheckItems.forEach(function(element, index) {
            if (item.field == element.field) {
              remove = true
            }
          })
          return !remove
        })

        this.rightCheckItems.forEach(function(element, index) {
          element.check = false
          self.checkedLeftData.push(element)
        })

        this.rightCheckItems = []
        this.isrightIndeterminate = false
        this.checkrightAll = false

        // 刷新左侧效果
        this.leftCheckItemChange()
        this.rightCheckItemChange()
      } else {
        this.checkedLeftData = this.checkedLeftData.filter(function(
          item,
          index,
          array
        ) {
          var remove = false
          self.leftCheckItems.forEach(function(element, index) {
            if (item.field == element.field) {
              remove = true
            }
          })
          return !remove
        })

        this.leftCheckItems.forEach(function(element, index) {
          element.check = false
          self.checkedRightData.push(element)
        })

        this.leftCheckItems = []
        this.isleftIndeterminate = false
        this.checkleftAll = false

        // 刷新右侧效果
        this.leftCheckItemChange()
        this.rightCheckItemChange()
      }

      this.$emit('change', {
        left: this.checkedLeftData,
        right: this.checkedRightData
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.scene-name {
  font-size: 12px;
  padding-bottom: 5px;
  color: #aaa;
  line-height: 18px;
}

.default-mark {
  width: 4px;
  height: 4px;
  border-radius: 2px;
  margin-right: 5px;
}
.default-mark-active {
  background-color: $xr-color-primary;
}

.scene-list-search {
  background-color: white;
  position: absolute;
  padding: 10px 20px;
  top: 0;
  left: 0;
  z-index: 5;
}

.scene-list {
  .scene-list-box {
    flex: 1;
    border: 1px solid $xr-border-line-color;
    border-radius: 2px;
    height: 360px;
    position: relative;
    padding: 15px;
  }
  .scene-middle-list {
    width: 50px;
    text-align: center;
    button {
      border: 1px solid #cccccc;
      width: 34px;
      height: 34px;
      border-radius: 17px;
      background-color: #f5f7fa;
    }
    .scene-middle-icon {
      color: #cccccc;
      font-size: 14px;
    }
    .scene-middle-left-button {
    }
    .scene-middle-right-button {
      margin-top: 15px;
      margin-left: 0;
    }

    .scene-middle-button-select {
      border: 1px solid $xr-color-primary !important;
      background-color: $xr-color-primary !important;
      .scene-middle-icon {
        color: white !important;
      }
    }
  }
  .scene-list-head {
    padding-bottom: 15px;
    border-bottom: 1px dashed $xr-border-line-color;
    font-size: 13px;
    .scene-list-head-name {
      color: #333;
      flex: 1;
      margin: 0 8px;
    }

    .scene-list-head-detail {
      color: #aaa;
    }
  }
  .scene-list-body {
    padding: 52px 0 5px 0;
    height: 300px;
    position: relative;
    overflow-y: auto;
  }

  .list-item {
    padding: 5px 0;
    cursor: pointer;
    .list-item-check {
      margin-right: 8px;
    }
    .list-item-name {
      font-size: 13px;
      color: #333;
      flex: 1;
    }
  }
}
</style>
