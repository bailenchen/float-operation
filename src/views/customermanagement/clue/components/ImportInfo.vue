<template>
  <div
    class="content">
    <div class="content-title">基本信息</div>
    <p
      v-for="(item , index) in list"
      :key="index"
      class="detail-cell">
      <span class="detail-cell__label">
        {{ item.name }}
      </span><br>
      <span class="detail-cell__value">
        {{ item.value }}
      </span>
    </p>
  </div>
</template>

<script>

export default {
  /** 重要信息 */
  name: 'ImportInfo',
  components: {},
  props: {
    list: Array
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.import-info {
  overflow: auto;
  height: 100%;
}

.content {
  padding: 20px 10px;
  &-title {
    font-size: 13px;
    font-weight: 600;
  }

  .detail-cell {
    font-size: 12px;
    margin: 20px 0;
    &__label {
      color: #666;
    }
    &__value {
      display: inline-block;
      margin-top: 5px;
      color: #333;
      line-height: 16px;
    }
  }
}
</style>
