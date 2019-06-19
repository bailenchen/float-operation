<template>
  <div class="list">
    <div class="header">
      <div v-photo="data"
           v-lazy:background-image="$options.filters.filterUserLazyImg(data.img)"
           class="div-photo"></div>
      <div class="name-time">
        <p class="name">{{data.realname}}</p>
        <p class="time">{{data.createTime | moment("YYYY-MM-DD HH:mm")}}</p>
      </div>
    </div>
    <div class="title"
         @click="rowFun(data)">{{data.title}}</div>
    <div class="data-content"
         v-if="data.preShow">{{data.content}}</div>
    <div class="data-content"
         v-else>{{data.contentSub}}</div>
    <div v-if="data.contentSub.length < data.content.length"
         class="load-more">
      <span v-if="!data.loadMore"
            @click="loadMoreBtn(data)">展开全文</span>
      <span v-else
            @click="data.loadMore = false, data.preShow = false">收起全文</span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  props: {
    data: Object
  },
  methods: {
    /**
     * 点击显示详情
     */
    rowFun(val) {
      this.$emit('handle', {
        type: 'detail',
        value: val
      })
    },

    loadMoreBtn(val) {
      this.$set(val, 'preShow', true)
      this.$set(val, 'loadMore', true)
    }
  }
}
</script>

<style scoped lang="scss">
.list {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e6e6e6;
  .header {
    margin-bottom: 15px;
    .div-photo {
      width: 35px;
      height: 35px;
      border-radius: 17.5px;
      margin-right: 10px;
    }
    .name-time {
      display: inline-block;
      .time {
        color: #999;
        margin-top: 5px;
        font-size: 12px;
      }
    }
  }
  .title {
    cursor: pointer;
    display: inline-block;
  }
  .data-content {
    margin-top: 10px;
    color: #999;
    font-size: 12px;
    line-height: 18px;
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #f0f7ff;
    padding: 15px;
    border-radius: 3px;
    color: #333;
    letter-spacing: 0.5px;
  }
  .load-more {
    text-align: left;
    margin-top: 15px;
    span {
      cursor: pointer;
      font-size: 13px;
      color: #8ab7f5;
    }
  }
}
</style>