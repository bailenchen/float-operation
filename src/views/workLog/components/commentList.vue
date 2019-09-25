<template>
  <div class="comment-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="comment-list-item">
      <div class="parent-reply reply">
        <div
          v-photo="item.user"
          v-lazy:background-image="$options.filters.filterUserLazyImg(item.user.img)"
          :key="item.user.img"
          class="user-img div-photo" />
        <div class="content">
          <span class="user">{{ item.user.realname }}：</span>
          <span class="text" v-html="emoji(item.content)" />
          <div class="control">
            <el-button
              type="text"
              @click="handleToReply(index)">
              回复
            </el-button>
            <el-button
              class="danger"
              type="text">
              删除
            </el-button>
          </div>
        </div>
        <div class="time">
          {{ item.createTime }}
        </div>
      </div>
      <reply-comment
        v-if="replyIndex === String(index)"
        @reply="handleReply"
        @close="replyIndex = null" />
      <template v-if="item.childCommentList && item.childCommentList.length > 0">
        <div
          v-for="(child, childIndex) in item.childCommentList"
          :key="childIndex">
          <div class="child-reply reply">
            <div
              v-photo="child.user"
              v-lazy:background-image="$options.filters.filterUserLazyImg(child.user.img)"
              :key="child.user.img"
              class="user-img div-photo" />
            <div class="content">
              <span class="user">
                {{ child.user.realname }} @{{ child.replyUser.realname }}：
              </span>
              <span class="text" v-html="emoji(child.content)" />
              <div class="control">
                <el-button
                  type="text"
                  @click="handleToReply(index, childIndex)">
                  回复
                </el-button>
                <el-button
                  class="danger"
                  type="text">
                  删除
                </el-button>
              </div>
            </div>
            <div class="time">
              {{ child.createTime }}
            </div>
          </div>
          <reply-comment
            v-loading="commentLoading"
            v-if="replyIndex === `${index}-${childIndex}`"
            @reply="handleReply"
            @close="replyIndex = null" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * 评论列表
 */
import ReplyComment from '@/components/ReplyComment'
import {
  setCommentAPI,
  deleteCommentAPI,
} from '@/api/oamanagement/common'
import {mapGetters} from 'vuex'

export default {
  name: 'CommentList',
  components: {
    ReplyComment
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      replyIndex: null,
      commentLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    /**
     * 显示回复框
     * @param index
     * @param childIndex
     */
    handleToReply(index, childIndex = null) {
      const str = `${index}${childIndex !== null ? ('-' + childIndex) : ''}`
      if (str === this.replyIndex) return
      this.replyIndex = str
    },
    /**
     * 回复
     * @param data
     */
    handleReply(data) {
      const params = {
        type: 2,
        content: data,
        typeId: this.id
      }
      let c_comment = null
      const arr = this.replyIndex.split('-')
      const f_comment = this.list[arr[0]]
      if (arr[1]) {
        c_comment = f_comment.childCommentList[arr[1]]
      }
      if (f_comment) {
        params.mainId = f_comment.commentId
        params.pid = f_comment.userId
      }
      if (c_comment) {
        params.pid = c_comment.userId
      }
      console.log('reply data:', params)
      this.commentLoading = true
      setCommentAPI(params).then(res => {
        res.data.user = {
          userId: this.userInfo.id,
          realname: this.userInfo.realname
        }
        res.data.replyUser = c_comment.user

        f_comment.childCommentList.push(res.data)
        this.replyIndex = null
        this.commentLoading = false
      }).catch(() => {
        this.commentLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .comment-list {
    padding: 10px 100px 10px 60px;
    .comment-list-item {
      .user-img {
        width: 34px;
        height: 34px;
      }
      .reply {
        font-size: 12px;
        padding: 10px;
        margin-bottom: 5px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        .content {
          flex: 1;
          line-height: 1.5;
          margin-left: 20px;
          .user {
            font-size: 14px;
          }
          .text {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .control {
            margin-top: 5px;
            visibility: hidden;
            display: flex;
            .el-button {
              font-size: 12px;
              padding: 0;
              &.danger {
                color: #F56C6C;
              }
            }
          }
          .hide {
            display: block;
          }
        }
        .time {
          color: #666;
          margin-left: 10px;
        }
        &:hover {
          background-color: rgba(35,98,251,0.04);
          .content .control {
            visibility: unset;
          }
        }
      }
      .reply-comment {
        margin-bottom: 10px;
      }
    }
  }
</style>
