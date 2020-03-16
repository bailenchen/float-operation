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
          v-for="(item, index) in deleteList"
          :icon="item.icon"
          :key="index"
          type="primary"
          @click.native="selectionBarClick(item)">{{ item.name }}</el-button>
        <el-dropdown v-for="(item) in list" :key="item.type" trigger="click">
          <span class="el-dropdown-link">
            <i :class="item.icon"/>
            <span style="margin-left: 5px;">{{ item.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item
              v-for="dropdownItem in item.children"
              :key="dropdownItem.type"
              :icon="dropdownItem.icon"
              @click.native="selectionBarClick(dropdownItem)">{{ dropdownItem.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </flexbox>
    </flexbox>
    <div v-if="selectionList.length == 0" style="height:50px;">
      <flexbox v-if="emailType === 'goTo'" class="email_fifter">与
      <el-button type="text">{{ emailGoTo }}</el-button>的往来邮件</flexbox>
    </div>
    <!-- <el-dialog
      :visible.sync="dialogVisible"
      title="操作"
      width="300px">
      <el-select v-model="type" style="width: 100%;" placeholder="请选择">
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
    </el-dialog> -->
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
    },

    // 邮箱
    emailGoTo: {
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
      deleteList: [],
      type: '',
      item: {}
    }
  },
  watch: {
    emailType: {
      handler(val) {
        this.list = [
          { name: '标记为', type: 'one', icon: 'el-icon-s-flag', children: [
            {
              name: '取消星标',
              type: 'cancelStar',
              icon: 'el-icon-star-off'
            }
          ] },
          { name: '移动到', type: 'two', icon: 'el-icon-sort', children: [] }
        ]
        const tempList = [{
          name: '标为已读',
          type: 'read',
          icon: 'wk wk-open-email'
        },
        {
          name: '标为未读',
          type: 'noRead',
          icon: 'wk wk-email'
        }]
        if (this.emailType !== 'draft') {
          if (this.emailType !== 'star') {
            this.list[0].children.unshift({
              name: '标为星标',
              type: 'star',
              icon: 'el-icon-star-on'
            })
          }
          if (this.emailType !== 'receive') {
            this.list[1].children.unshift(
              {
                name: '收件箱',
                type: 'INBOX',
                kind: 'INBOX'
              }
            )
          }
          if (this.emailType !== 'sent') {
            this.list[1].children.push(
              {
                name: '已发送',
                type: 'Sent Messages',
                kind: 'Sent Messages'
              }
            )
          }
          this.list[0].children = [...this.list[0].children, ...tempList]
        }
        this.deleteList = [
          {
            name: '彻底删除',
            type: 'rootDel',
            icon: 'el-icon-delete-solid'
          }
        ]
        if (this.emailType !== 'deleted') {
          this.deleteList.unshift({
            name: '删除邮件',
            type: 'delete',
            icon: 'el-icon-delete-solid'
          })
        }
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    /** 勾选后的表头操作 */
    headSelectionChange(array) {
      this.selectionList = array
    },
    selectionBarClick(item) {
      this.type = item.type
      this.item = item
      this.$emit('change', this.type, this.item)
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

.email_fifter {
  padding-left: 20px;
  height: 100%;
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
    line-height: 1px;
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
/deep/.el-icon-star-on {
  font-size: 16px;
  position: relative;
  left: -2px;
  }
  /deep/.el-dropdown{
    margin: 0px 10px;
  }
 .el-dropdown-link {
    display: inline-block;
    color: #666;
    cursor: pointer;
    background-color: #F6F8FA;
    border-color: #F6F8FA;
    line-height: 30px;
    font-size: 12px;
    height: 28px;
    width: 96px;
    padding: 0px 10px;
    border-radius:14px;
  }
  .el-dropdown-link:hover{
    background-color: #2362FB;
    border-color: #2362FB;
    color: #ffffff;
  }
  /deep/.el-icon--right{
    margin-left: 0px;
  }
</style>


