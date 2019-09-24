<template>
  <div class="fl-c">
    <flexbox class="fl-h">
      <div
        v-photo="{img: item.userImg, realname: item.realname}"
        v-lazy:background-image="$options.filters.filterUserLazyImg(item.userImg)"
        class="div-photo fl-h-img"/>
      <div class="fl-h-b">
        <div class="fl-h-name">{{ item.realname }}</div>
        <div class="fl-h-time">{{ item.createTime }}</div>
      </div>
      <el-dropdown
        trigger="click"
        @command="handleCommand">
        <i
          style="color:#CDCDCD;margin-left: 8px;"
          class="el-icon-arrow-down el-icon-more"/>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </flexbox>
    <div class="fl-b">
      <div class="fl-b-content">{{ item.content }}</div>
      <flexbox
        v-if="item.img && item.img.length > 0"
        class="fl-b-images"
        wrap="wrap">
        <div
          v-lazy:background-image="file.filePath"
          v-for="(file, index) in item.img"
          :key="file.filePath"
          class="fl-b-img-item"
          @click="previewImg(item.img, index)"/>
      </flexbox>
      <div
        v-if="item.file && item.file.length > 0"
        class="fl-b-files">
        <flexbox
          v-for="(file, index) in item.file"
          :key="index"
          class="cell">
          <img
            class="cell-head"
            src="@/assets/img/relevance_file.png" >
          <div class="cell-body">{{ file.name }}<span style="color: #ccc;">（{{ file.size }}）</span></div>
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="downloadFile(file)">下载</el-button>
        </flexbox>
      </div>
      <div
        v-if="item.category || item.nextTime"
        class="follow">
        <span
          v-if="item.category"
          class="follow-info">{{ item.category }}</span>
        <span
          v-if="item.nextTime"
          class="follow-info">{{ item.nextTime }}</span>
      </div>
      <div
        v-if="item.contactsList && item.contactsList.length > 0"
        class="fl-b-other">
        <div class="fl-b-other-name">关联联系人</div>
        <div>
          <flexbox
            v-for="(item, index) in item.contactsList"
            :key="index"
            class="cell"
            @click.native="checkRelationDetail('contacts', item.contactsId)">
            <i
              :style="{'opacity': index == 0 ? 1 : 0}"
              class="wukong wukong-contacts cell-head crm-type"/>
            <div
              class="cell-body"
              style="color: #6394E5;cursor: pointer;">{{ item.name }}</div>
          </flexbox>
        </div>
      </div>
      <div
        v-if="item.businessList && item.businessList.length > 0"
        class="fl-b-other">
        <div class="fl-b-other-name">关联商机</div>
        <div>
          <flexbox
            v-for="(item, index) in item.businessList"
            :key="index"
            class="cell"
            @click.native="checkRelationDetail('business', item.businessId)">
            <i
              :style="{'opacity': index == 0 ? 1 : 0}"
              class="wukong wukong-business cell-head crm-type"/>
            <div
              class="cell-body"
              style="color: #6394E5;cursor: pointer;">{{ item.businessName }}</div>
          </flexbox>
        </div>
      </div>
      <slot/>
    </div>
    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :crm-type="relationCrmType"
      :id="relationID"/>
  </div>
</template>

<script>
import { downloadFile } from '@/utils'
import { crmRecordDelete } from '@/api/customermanagement/common'

export default {
  /** 客户管理 的 客户详情 的 跟进记录cell*/
  name: 'FollowRecordCell',
  components: {
    CRMFullScreenDetail: () =>
      import('@/views/customermanagement/components/CRMFullScreenDetail.vue')
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    index: [String, Number]
  },
  data() {
    return {
      showFullDetail: false, // 查看相关客户管理详情
      relationID: '', // 相关ID参数
      relationCrmType: '' // 相关类型
    }
  },
  computed: {},
  mounted() {},
  methods: {
    previewImg(list, index) {
      this.$bus.emit('preview-image-bus', {
        index: index,
        data: list.map(function(item, index, array) {
          item.url = item.filePath
          return item
        })
      })
    },
    downloadFile(file) {
      downloadFile({ path: file.filePath, name: file.name })
    },
    /**
     * 删除跟进记录
     */
    handleCommand(command) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          crmRecordDelete({
            recordId: this.item.recordId
          })
            .then(res => {
              this.$emit('on-handle', {
                type: command,
                data: { item: this.item, index: this.index }
              })
              // 刷新待办
              this.$store.dispatch('GetMessageNum')

              this.$message.success('操作成功')
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    /**
     * 查看相关客户管理详情
     */
    checkRelationDetail(type, id) {
      this.relationID = id
      this.relationCrmType = type
      this.showFullDetail = true
    }
  }
}
</script>

<style lang="scss" scoped>
/** 跟进记录相关的 日志 审批任务 日程 项目 公共css */
.fl-c {
  background-color: white;
  padding: 10px 10px 10px 25px;
  position: relative;
}

/** 头部布局 名字 头像 */
.fl-h {
  .fl-h-img {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 17px;
    margin-right: 8px;
  }

  .fl-h-b {
    flex: 1;

    .fl-h-name {
      font-size: 13px;
      color: #333;
    }

    .fl-h-time {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
}

/** 头部 右侧 布局*/
.fl-h-handle {
  width: auto;

  .fl-h-handle-name {
    font-size: 13px;
    color: #333;
    margin-right: 6px;
  }
}

/** 内容区域 */
.fl-b {
  margin: 20px 0 0 40px;

  .fl-b-content {
    font-size: 13px;
    color: #333;
    margin-bottom: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
    letter-spacing: 0.5px;
    line-height: 18px;
  }

  .fl-b-images {
    margin-top: 5px;
    width: 310px;

    .fl-b-img-item {
      width: 98px;
      height: 98px;
      display: inline-block;
      margin: 0 4px 4px 0;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      position: relative;
      cursor: pointer;
    }
  }

  .fl-b-other {
    margin: 8px 0;

    .fl-b-other-name {
      margin: 10px 0;
      color: #666;
      font-size: 13px;
    }
  }
}

.fl-c:before {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  left: 15px;
  z-index: 2;
}

.fl-c:first-child:before {
  display: none;
}

/** 附件 */
.fl-b-files {
  margin-top: 10px;
}

/** 关联附件 联系人 客户 行布局 */
.cell {
  padding: 8px;
  background-color: #F5F7FA;
  border-radius: 2px;
  position: relative;

  .cell-head {
    display: block;
    width: 15px;
    height: 15px;
    margin-right: 8px;
  }

  .cell-body {
    flex: 1;
    color: #333;
    font-size: 12px;
  }

  .cell-foot {
    display: block;
    width: 20px;
    padding: 0 4px;
    margin-right: 8px;
  }
}

.cell:before {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  left: 30px;
  z-index: 2;
}

.cell:first-child:before {
  display: none;
}

.follow {
  .follow-info {
    padding: 5px 10px;
    background-color: #f5f7fa;
    color: #999;
    height: 40px;
    line-height: 40px;
    border-radius: 28px;
    font-size: 12px;
    margin-right: 10px;
  }
}

.crm-type {
  color: rgb(99, 148, 229);
  font-size: 14px;
}
</style>
