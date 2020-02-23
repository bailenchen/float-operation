
<template>
  <div class="add-receive-wrap">
    <div v-for="(item, index) in emailList" :key="index" class="receiver">
      <div class="current-receiver">
        <div v-if="isHide" class="end-wrap">
          <div :class="{ 'wrong': isCorectEmail(item) }" class="receiver-email">
            <span v-if="item.customerName">{{ item.customerName }}</span>
            <span :contenteditable="true" @input="inputs($event, item, index)" @blur="blurs">{{ getemail(item.email) }}</span>
          </div>
          <div class="icon-wrap" @click="delEmail(item, index)">
            <i class="el-icon-close"/>
          </div>
        </div>
      </div>
    </div>
    <el-autocomplete
      v-model="val"
      :fetch-suggestions="querySearchAsync"
      :highlight-first-item="true"
      :debounce="500"
      style="width: 220px"
      placement="bottom"
      class="enter-input"
      popper-class="source"
      @change="handleAddEmail"
      @select="handleInputSelect">
      <template slot-scope="{ item }">
        <div class="name">{{ item.name }}<{{ item.value }}></div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import { emailAccountSearchEmailAPI } from '@/api/email/email'
export default {
  name: 'AddSenter',
  props: {
    sentLists: {
      type: Array,
      default() {
        return []
      }
    },
    comType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      val: '',
      emailList: [],
      emailCopy: []
    }
  },
  computed: {
    /**
     * 判断是否是正确的邮箱
     */
    isCorectEmail() {
      return function(item) {
        if (this.validEmail(item.email)) {
          item.valid = true
          return false
        } else {
          item.valid = false
          return true
        }
      }
    },
    isHide() {
      return true
      // return function(item) {
      //   if (item.show) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }
    }
  },
  watch: {
    sentLists: {
      handler(val) {
        this.emailCopy = JSON.parse(JSON.stringify(this.sentLists))
        this.emailList = JSON.parse(JSON.stringify(this.sentLists))
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.emailList = JSON.parse(JSON.stringify(this.sentLists))
  },
  methods: {
    handleAddEmail() {
      if (this.comType == 'receive') {
        if (this.validEmail(this.val)) {
          this.$emit('add-receive', this.val, this.emailList)
          this.val = ''
        } else {
          this.$message.error('您输入的邮箱格式错误')
        }
      } else if (this.comType == 'sent') {
        if (this.validEmail(this.val)) {
          this.$emit('add-sent', this.val, this.emailList)
          this.val = ''
        } else {
          this.$message.error('您输入的邮箱格式错误')
        }
      }
      this.emailList = JSON.parse(JSON.stringify(this.emailCopy))
    },
    /**
     * 验证邮箱
     */
    validEmail(value) {
      if (/^[0-9a-zA-Z.-_]+@[0-9a-zA-Z.-_]+(\.[a-zA-Z]+){1,2}$/.test(value)) {
        return true
      } else {
        return false
      }
    },
    /**
     * 删除邮箱
     */
    delEmail(item, index) {
      if (this.comType == 'receive') {
        this.$emit('del-receive', index)
      } else if (this.comType == 'sent') {
        this.$emit('del-sent', index)
      }
    },
    inputs(e, item, index) {
      const startCount = e.target.textContent.indexOf('<') + 1
      const endCount = e.target.textContent.indexOf('>')
      const string = e.target.textContent.substring(startCount, endCount)
      this.emailCopy[index].email = string
      this.emailCopy[index].valid = true
    },
    blurs() {
      this.emailList = JSON.parse(JSON.stringify(this.emailCopy))
      this.$emit('change', this.emailList)
    },

    /**
     * 网址拼接<>
     */
    getemail(email) {
      return '<' + email + '>'
    },

    /**
     * 模糊查询邮箱
     */
    getEamilList() {
      emailAccountSearchEmailAPI({ email: this.val }).then(res => {

      }).catch(() => {})
    },

    /**
     * 搜索的回调
     */
    querySearchAsync(queryString, cb) {
      if (queryString) {
        emailAccountSearchEmailAPI({ email: queryString }).then(res => {
          cb(res.data)
        }).catch(() => {})
      } else {
        cb([])
      }
    },

    /**
     *选中的回调
     */
    handleInputSelect(item) {
      this.val = item.value
      this.handleAddEmail()
    }
  }
}
</script>

<style lang="scss" scoped>
// 添加收件人样式
.add-receive-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
}

.current-receiver {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 20px;
  .end-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 2px;
    cursor: pointer;
    font-size: 12px;
    .receiver-email {
      background: #d7e9ff;
      white-space: nowrap;
      padding: 2px 5px;
      color: #2e3133;
    }
    .icon-wrap {
      background: #d7e9ff;
      margin-left: 1px;
      padding: 2px 5px;
      & :hover {
        color: #fff;
      }
    }
  }
}

.enter-input {
  font-size: 12px;
  width: 150px;
  /deep/ .el-input__inner {
    border: 0;
  }
}

.wrong {
  color: #cf0505 !important;
}

.receiver {
  margin-right: 5px;
  margin-bottom: 5px;
}
/deep/.el-autocomplete-suggestion {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>

