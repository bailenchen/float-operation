<template>
  <div class="data-statistics card">
    <flexbox class="card-title">
      <div class="card-title-left">
        <span class="icon wk wk-data" />
        <span class="text">数据汇总</span>
      </div>
      <!--<div class="card-title-right">
        <span class="box">{{ filterText }}</span>
        <span class="box">{{ timeLine }}</span>
      </div>-->
    </flexbox>
    <div class="card-desc">
      对于数据收集统计的汇总
    </div>
    <div class="content">
      <div class="list-item">
        <div class="title">
          客户汇总
        </div>
        <div class="info">
          共有<span class="bold">200</span>个客户，成交客户<span class="bold">200</span>个，未成交<span class="bold">200</span>个
        </div>
      </div>
      <div class="list-item">
        <div class="title">
          跟进汇总
        </div>
        <div class="info">
          添加新增客户<span class="bold">200</span>人，未跟进<span class="bold">200</span>人
        </div>
      </div>
      <div class="list-item">
        <div class="title">
          商机汇总
        </div>
        <div class="info">
          共有<span class="bold">200</span>个商机，商机总金额<span class="bold">2000.00</span>元，成交商机<span class="bold">200</span>个
        </div>
      </div>
      <div class="list-item">
        <div class="title">
          合同汇总
        </div>
        <div class="info">
          合同签订<span class="bold">200</span>份，合同金额<span class="bold">2000.00</span>元
        </div>
      </div>
      <div class="list-item">
        <div class="title">
          回款金额
        </div>
        <div class="info">
          回款金额<span class="bold">200</span>元，未回款<span class="bold">5000.00</span>元
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartMixins from './chartMixins'

export default {
  name: 'DataStatistics',
  mixins: [chartMixins],
  methods: {
    getData() {
      // let params = this.getBaseParams()
      // TODO 统计数据获取
    }
  }
}
</script>

<style scoped lang="scss">
  @import "style";
  .content {
    width: 100%;
    height: 300px;
    .list-item {
      border-bottom: 1px dashed #EFEFEF;
      padding: 10px 20px;
      &:last-child {
        border-bottom: 0 none;
        padding-bottom: 0;
      }
      .title {}
      .info {
        margin-top: 5px;
        .bold {
          font-size: 18px;
          font-weight: bold;
          margin: 0 3px;
        }
      }
    }
  }

  .card-title-left .icon {
    color: #BF80FF;
  }
</style>
