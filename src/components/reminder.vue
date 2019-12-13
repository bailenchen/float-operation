<template>
  <flexbox class="reminder-wrapper">
    <flexbox
      align="stretch"
      class="reminder-body">
      <i class="wk wk-warning reminder-icon"/>
      <div
        :style="{'font-size': fontSize + 'px'}"
        class="reminder-content"
        v-html="content"/>
    </flexbox>
  </flexbox>
</template>

<script type="text/javascript">
// 警示信息

export default {
  name: 'Reminder',
  components: {},
  props: {
    content: {
      type: String,
      default: '内容'
    },
    fontSize: {
      type: String,
      default: '12'
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.reminder-wrapper {
  .reminder-body {
    width: auto;
    padding: 0 8px;
    line-height: 28px;
    border-radius: $xr-border-radius-base;
    background-color: #FFF6E7;
    .reminder-icon {
      color: #F9A74E;
      margin-right: 5px;
      font-size: 14px;
    }

    .reminder-content {
      color: #666666;
      word-wrap:break-word;
    }
  }
}
</style>
