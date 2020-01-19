<template>
  <div class="add-receive-wrap">
    <div v-for="(item, index) in sentLists" :key="index" class="receiver">
      <div class="current-receiver">
        <div v-if="isHide(item)" class="end-wrap">
          <div :class="{ 'wrong': isCorectEmail(item) }" class="receiver-email">{{ item.website }}</div>
          <div class="icon-wrap" @click="delEmail(item, index)">
            <i class="el-icon-close"/>
          </div>
        </div>
      </div>
    </div>
    <el-input v-model="val" class="enter-input" @change="handleAddEmail()"/>
  </div>
</template>

<script>
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
      val: ''
    }
  },
  computed: {
    /**
     * 判断是否是正确的邮箱
     */
    isCorectEmail() {
      return function(item) {
        console.log('1111111', this.validEmail(item.website))
        if (this.validEmail(item.website)) {
          item.valid = true
          return false
        } else {
          item.valid = false
          return true
        }
      }
    },
    isHide() {
      return function(item) {
        if (item.show) {
          return true
        } else {
          return false
        }
      }
    }
  },
  mounted() {
    console.log(this.sentLists, '111', this.comType)
  },
  methods: {
    handleAddEmail() {
      if (this.comType == 'receive') {
        this.$emit('add-receive', this.val)
      } else if (this.comType == 'sent') {
        this.$emit('add-sent', this.val)
      }
      this.val = ''
      console.log(this.comType, 'inputtype')
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
      console.log('12', this.receiverLists)
    }
  }
}
</script>

<style lang="scss" scoped>
// 添加收件人样式
.add-receive-wrap {
  width: 100%;
  height: 35px;
  line-height: 35px;
  display: flex;
  justify-content: flex-start;
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
  /deep/ .el-input__inner {
    border: 0;
  }
}

.wrong {
  color: #cf0505 !important;
}

.receiver {
  margin-right: 5px;
}
</style>


