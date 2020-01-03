<template>
  <div class="email-table-head">
    <!--  -->
    <flexbox
      v-if="selectionList.length > 0"
      class="selection-bar">
      <div class="selected—title">已选中 <span class="selected—count">{{ selectionList.length }}</span> 项</div>
      <flexbox class="selection-items-box">
        <!-- v-if="whetherTypeShowByPermision(item.type)" -->
        <el-button
          v-for="(item, index) in operatList"
          :icon="item.icon | wkIconPre"
          :key="index"
          type="primary"
          @click.native="selectionBarClick(item.type)">{{ item.name }}</el-button>
      </flexbox>
    </flexbox>
    <div v-if="selectionList.length == 0" style="height:50px;"/>
  </div>
</template>

<script>
export default {
  name: 'EmailTableHead',
  props: {
    operatList: {
      type: Array,
      default() {
        return []
      }
    },
    // CRM类型
    emailType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectionList: [] // 勾选数据操作
    }
  },
  created() {
    console.log(this.emailType, 'clx', this.operatList)
  },
  methods: {
    /** 勾选后的表头操作 */
    headSelectionChange(array) {
      this.selectionList = array
    },
    selectionBarClick(type) {
      this.$emit('change', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.email-table-head {
  border-bottom: 1px solid #EBEEF5;
}
/** 勾选操作 */
.selection-bar {
  font-size: 12px;
  height: 50px;
  padding: 0 20px;
  color: #777;

  .selected—title {
    flex-shrink: 0;
    padding-right: 20px;
    color: #333;
    .selected—count {
      color: $xr-color-primary;
    }
  }
}

.selection-items-box {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 15px;

  .el-button {
    color: #666;
    background-color: $xr--background-color-base;
    border-color: $xr--background-color-base;
    font-size: 12px;
    height: 28px;
    border-radius: 14px;
    /deep/ i {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .el-button--primary:hover {
    background: $xr-color-primary;
    border-color: $xr-color-primary;
    color: #ffffff;
  }

  .el-button + .el-button {
    margin-left: 15px;
  }
}
</style>


