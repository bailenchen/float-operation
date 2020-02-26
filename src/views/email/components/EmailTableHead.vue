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
          v-for="(item, index) in list"
          :icon="item.icon"
          :key="index"
          type="primary"
          @click.native="selectionBarClick(item)">{{ item.name }}</el-button>
      </flexbox>
    </flexbox>
    <div v-if="selectionList.length == 0" style="height:50px;"/>
    <el-dialog
      :visible.sync="dialogVisible"
      title="操作"
      width="30%">
      <el-select v-model="type" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.type"
          :label="item.name"
          :value="item.type"
          @click.native="changeItem(item)"/>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
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
      dialogVisible: false,
      options: [],
      selectionList: [], // 勾选数据操作
      list: [],
      type: '',
      item: {}
    }
  },
  created() {
    this.list = [
      { name: '删除', type: '2', icon: 'el-icon-delete-solid', children: [
        {
          name: '删除邮件',
          type: 'delete',
          icon: 'transform'
        },
        {
          name: '彻底删除',
          type: 'rootDel',
          icon: 'export'
        }
      ] },
      { name: '标记为', type: '1', icon: 'el-icon-s-flag', children: [
        {
          name: '标为星标',
          type: 'star',
          icon: 'transfer'
        },
        {
          name: '取消星标',
          type: 'cancelStar',
          icon: 'transfer'
        },
        {
          name: '标为已读',
          type: 'read',
          icon: 'transform'
        },
        {
          name: '标为未读',
          type: 'noRead',
          icon: 'transform'
        }
      ] },
      { name: '移动到', type: '3', icon: 'el-icon-sort', children: [
        {
          name: '收件箱',
          type: 'INBOX',
          kind: 'INBOX'
        },
        {
          name: '发送箱',
          type: 'Sent Messages',
          kind: 'Sent Messages'
        }
      ] }
    ]
  },
  methods: {
    /** 勾选后的表头操作 */
    headSelectionChange(array) {
      this.selectionList = array
    },
    selectionBarClick(item) {
      this.options = item.children
      this.type = item.children[0].type
      this.item = item.children[0]
      this.dialogVisible = true
    },

    /**
     * 确定选择
     */
    sure() {
      this.$emit('change', this.type, this.item)
    },

    /**
     * 选择
     */
    changeItem(item) {
      this.item = item
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
/deep/.el-icon-sort {
  transform: rotate(90deg)
}
</style>


