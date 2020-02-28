<template>
  <div v-loading="loading" class="person-box">
    <flexbox class="poser-header">
      <div class="header-icon">
        <i class="wk wk-user"/>
      </div>
      <div class="header-text">账号设置</div>
    </flexbox>

    <div class="person-content">
      <flexbox class="content-title" justify="space-between">
        <div class="title-text first-col">名称</div>
        <div class="title-text two-col">内容</div>
        <div class="title-text three-col">操作</div>
      </flexbox>
      <flexbox class="content-content" justify="space-between">
        <div class="title-text first-col"><img :src="require(`@/assets/img/email/receive.png`)" alt="">邮箱账号</div>
        <div class="title-text two-col">{{ emailMsg.emailAccount }}</div>
        <div class="title-text three-col"><el-button type="text" @click="unbind">解除绑定</el-button></div>
      </flexbox>
      <flexbox class="content-content" justify="space-between">
        <div class="title-text first-col"><img :src="require(`@/assets/img/email/sent.png`)" alt="">发信昵称</div>
        <div class="title-text two-col">{{ emailMsg.sendNick || '暂未设置' }}</div>
        <div class="title-text three-col"><el-button type="text" @click="editNick">编辑</el-button></div>
      </flexbox>
      <flexbox class="content-content" justify="space-between">
        <div class="title-text first-col"><img :src="require(`@/assets/img/email/writeLetter.png`)" alt="">个性签名</div>
        <div class="title-text two-col" v-html="emailMsg.signature || '暂未设置'"/>
        <div class="title-text three-col"><el-button type="text" @click="editSign">编辑</el-button></div>
      </flexbox>
    </div>

    <el-dialog
      :visible.sync="dialogNick"
      :title="title"
      :close-on-click-modal="false"
      append-to-body
      width="500px"
      @close="close">
      <tinymce v-if="showNick && dialogNick" v-model="signature" :height="300" class="rich-txt" />
      <el-form v-else ref="form" :model="form" label-width="80px" class="demo-ruleForm">
        <el-form-item
          :rules="[
            { required: true, message: '发信昵称不能为空', trigger: 'blur'}
          ]"
          label="发新昵称"
          prop="sendNick"
        >
          <el-input v-model="form.sendNick" type="age"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogNick = false">取 消</el-button>
        <el-button type="primary" @click="editSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  emailUnbundleAccountAPI,
  emailUpdateSignatureAPI,
  emailUpdateSendNickAPI } from '@/api/email/email'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Person',
  components: {
    Tinymce
  },
  data() {
    return {
      loading: false,
      dialogNick: false,
      sendNick: '',
      form: {
        sendNick: ''
      },
      title: '编辑发信昵称',
      showNick: true,
      signature: ''
    }
  },
  computed: {
    ...mapGetters(['emailMsg'])
  },
  mounted() {
  },
  methods: {
    /**
       * 解除绑定
       */
    unbind() {
      this.$confirm('解除绑定后，将不能自动登录邮箱，且缓存数据将会被清除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        emailUnbundleAccountAPI({ id: this.emailMsg.id }).then(res => {
          this.loading = false
          this.$message.success('解除绑定成功')
          window.location.reload()
        }).catch(() => {})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解除'
        })
      })
    },

    /**
     * 编辑发送昵称
     */
    editNick() {
      this.title = '编辑发信昵称'
      this.showNick = false
      this.form.sendNick = this.emailMsg.sendNick || ''
      this.dialogNick = true
    },

    /**
     * 编辑发送昵称确定
     */
    editSendNick() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            id: this.emailMsg.id,
            sendNick: this.form.sendNick
          }
          emailUpdateSendNickAPI(params).then(res => {
            this.$message.success('编辑成功')
            this.dialogNick = false
            this.$store.dispatch('GetUserInfo').then(() => {
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },

    /**
     * 编辑个性签名
     */
    editSign() {
      this.title = '编辑个性签名'
      this.signature = this.emailMsg.signature || ''
      this.showNick = true
      this.dialogNick = true
    },

    /**
     * 编辑个性签名确定
     */
    editSignSure() {
      this.loading = true
      const params = {
        id: this.emailMsg.id,
        signature: this.signature
      }
      emailUpdateSignatureAPI(params).then(res => {
        this.$message.success('编辑成功')
        this.dialogNick = false
        this.$store.dispatch('GetUserInfo').then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },

    /**
     * 确定
     */
    editSure() {
      if (!this.showNick) {
        this.editSendNick()
      } else {
        this.editSignSure()
      }
    },

    /**
     * 关闭弹框取消表单验证
     */
    close() {
      if (!this.showNick) {
        this.$refs['form'].resetFields()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.person-box {
    .poser-header {
         height: 60px;
         padding: 10px 0px 10px 28px;
         position: relative;
        .header-icon {
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 4px;
            margin-right: 10px;
            background-color: rgb(25, 181, 246);
            .wk-user {
                color: #fff;
            }
        }
        .header-text {
            color: #333;
        }
    }
    .person-content {
        width: 100%;
        height: calc(100vh - 120px);
        background-color: #fff;
        .content-title {
            background-color: #e6e6e6;
            border: 1px solid #e4e4e4;
            width: 100%;
            line-height: 40px;
            height: 40px;
            .title-text {
                font-weight: bolder;
            }
        }
        .content-content {
            border-bottom: 1px solid #e4e4e4;
            min-height: 60px;
            color: #666;
            font-size: 12px;
            img {
                width: 20px;
                height: 20px;
                vertical-align: middle;
                margin-right: 10px;
            }
        }
    }

}
.first-col {
    width: 120px;
    flex-shrink: 0;
    text-align: center;
}
.three-col {
    width: 120px;
    flex-shrink: 0;
    text-align: center;
}
/deep/.w-e-toolbar {
    flex-wrap: wrap;
}
</style>
