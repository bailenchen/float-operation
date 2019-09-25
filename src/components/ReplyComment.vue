<template>
  <div
    v-loading="commentLoading"
    class="reply-comment">
    <el-input
      v-model="commentsTextarea"
      :rows="3"
      :maxlength="500"
      show-word-limit
      type="textarea"
      placeholder="请输入内容" />
    <div class="btn-group">
      <el-popover
        v-model="showEmoji"
        placement="top"
        width="400"
        trigger="click">
        <!-- 表情 -->
        <emoji @select="selectEmoji" />
        <img
          slot="reference"
          src="@/assets/img/smiling_face.png"
          class="smiling-img">
      </el-popover>
      <div class="btn-box">
        <el-button
          type="primary"
          @click="commentSubmit">回复</el-button>
        <el-button @click="closeComment">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 回复输入框
 * event:   close 关闭输入框
 *          reply 确认输入  参数： {String} 输入框值
 */
import xss from 'xss'
import emoji from '@/components/emoji'

export default {
  name: 'ReplyComment',
  components: {
    emoji
  },
  data() {
    return {
      commentLoading: false, // 回复loading
      commentsTextarea: '', // 回复内容
      showEmoji: false // emoji选择标志
    }
  },
  methods: {
    /**
     * emoji 表情选择
     */
    selectEmoji(val) {
      const list = this.commentsTextarea.split('')
      list.splice(this.blurIndex, 0, val)
      this.commentsTextarea = list.join('')
      this.showEmoji = false
    },
    /**
     * 提交评论回复
     */
    commentSubmit() {
      if (!this.commentsTextarea) {
        this.$message.error('回复内容不能为空')
        return
      }
      this.$emit('reply', xss(this.commentsTextarea))
    },
    /**
     * 关闭评论回复框
     */
    closeComment() {
      this.showEmoji = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
  .reply-comment {
    border: 1px solid #e6e6e6;
    .btn-group {
      padding: 0 10px 5px 10px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .btn-box {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
    .btn-group /deep/ img {
      cursor: pointer;
    }
    .el-textarea /deep/ .el-textarea__inner {
      resize: none;
      border: 0;
    }
  }
</style>
