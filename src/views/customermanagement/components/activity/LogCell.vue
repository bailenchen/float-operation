<template>
  <div class="fl-c">
    <flexbox class="fl-h">
      <div
        v-photo="{img: item.userImg, realname: item.realname}"
        v-lazy:background-image="$options.filters.filterUserLazyImg(item.userImg)"
        class="div-photo fl-h-img" />
      <div class="fl-h-b">
        <div class="fl-h-name">{{ item.realname }}</div>
        <div class="fl-h-time">{{ item.createTime }}</div>
      </div>
      <div
        v-if="item.category"
        class="follow">
        <span class="follow-info">{{ item.category }}</span>
      </div>
      <el-dropdown
        trigger="click"
        @command="handleCommand">
        <i
          style="color:#CDCDCD;margin-left: 8px;"
          class="el-icon-arrow-down el-icon-more" />
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
          @click="previewImg(item.img, index)" />
      </flexbox>

      <div v-if="item.file && item.file.length > 0">
        <flexbox
          v-for="(file, index) in item.file"
          :key="index"
          align="stretch"
          class="cell">
          <div class="cell-hd first-show">
            <i class="wk wk-file" />
          </div>
          <div class="cell-hd first-show">
            附件：
          </div>
          <div class="cell-bd text-one-line">
            {{ file.name }}
          </div>
          <div class="cell-ft">
            <span class="des">（{{ file.size }}）</span>
            <a @click="downloadFile(file)">下载</a>
          </div>
        </flexbox>
      </div>

      <div v-if="item.contactsList && item.contactsList.length > 0">
        <flexbox
          align="stretch"
          class="cell">
          <div class="cell-hd">
            <i class="wk wk-contacts" />
          </div>
          <div class="cell-bd">
            相关联系人：
          </div>
          <div
            v-for="(item, index) in item.contactsList"
            :key="index"
            class="cell-ft__item text-one-line">
            <a @click="checkRelationDetail('contacts', item.contactsId)">{{ item.name }}</a>
          </div>
        </flexbox>
      </div>

      <div v-if="item.businessList && item.businessList.length > 0">
        <flexbox
          align="stretch"
          class="cell">
          <div class="cell-hd">
            <i class="wk wk-business" />
          </div>
          <div class="cell-bd">
            相关商机：
          </div>
          <div class="cell-ft">
            <div
              v-for="(item, index) in item.businessList"
              :key="index"
              class="cell-ft__item text-one-line">
              <a @click="checkRelationDetail('business', item.businessId)">{{ item.businessName }}</a>
            </div>
          </div>
        </flexbox>
      </div>

      <div v-if="item.nextTime">
        <flexbox
          align="stretch"
          class="cell">
          <div class="cell-hd">
            <i class="wk wk-time" />
          </div>
          <div class="cell-bd text-one-line">
            下次联系时间：{{ item.nextTime }}
          </div>
        </flexbox>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
import { downloadFile } from '@/utils'
import { crmActivityDeleteAPI } from '@/api/customermanagement/common'

export default {
  /** 客户管理 的 客户详情 的 跟进记录cell*/
  name: 'LogCell',
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 没有值就是全部类型 有值就是当个类型
    crmType: {
      type: String,
      default: ''
    },
    // 块
    section: [String, Number],
    // 行
    index: [String, Number]
  },
  data() {
    return {

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
          crmActivityDeleteAPI({
            activityId: this.item.activityId
          })
            .then(res => {
              this.$emit('delete', this.item, this.index, this.section)
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
      this.$emit('crm-detail', type, id)
    }
  }
}
</script>

<style lang="scss" scoped>
/** 跟进记录相关的 日志 审批任务 日程 项目 公共css */
.fl-c {
  background-color: white;
  padding: 10px 15px;
  position: relative;
}

.margin-top {
   margin-top: 5px;
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
  margin: 10px 0 0 40px;

  .fl-b-content {
    font-size: 13px;
    color: #333;
    white-space: pre-wrap;
    word-wrap: break-word;
    letter-spacing: 0.5px;
    line-height: 18px;
  }

  .fl-b-images {
    margin-top: 15px;
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
  content: ' ';
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
  padding: 5px 0;
  font-size: 12px;
  &-hd {
    flex-shrink: 0;
    color: #333;
    margin-right: 5px;
    i {
      font-size: 13px;
      color: #666;
    }
  }

  &-hd.first-show {
    opacity: 0;
  }

  &-bd {
    color: #333;
  }

  &-ft {
    flex-shrink: 0;
    .des {
      color: #999999;
    }
    &__item {
      margin-bottom: 3px;
      a {
        color: $xr-color-primary;
      }

      a:hover {
        text-decoration: underline;
      }
    }

    &__item + &__item {
      margin-bottom: 5px;
    }

    a {
      color: $xr-color-primary;
    }
    a:hover {
      text-decoration: underline;
    }
  }
}

.cell:first-child {
  .first-show {
    opacity: 1;
  }
}

.follow {
  .follow-info {
    padding: 3px 8px;
    background-color: #f6f6f6;
    color: #666666;
    height: 40px;
    line-height: 40px;
    border-radius: $xr-border-radius-base;
    font-size: 12px;
    margin-right: 10px;
  }
}
</style>
