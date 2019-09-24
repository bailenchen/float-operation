<template>
  <div>
    <flexbox
      class="cell"
      align="stretch">
      <div
        v-photo="userInfo"
        v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img)"
        class="div-photo cell-hd" />
      <div class="cell-bd">
        <p class="cell-bd__name"><span>王晶晶</span> <span class="cell-bd__name--des">销售总监</span></p>
        <p class="cell-bd__detail"><i class="wk wk-circle-iphone" /> <span>158-2359-8945</span></p>
        <p class="cell-bd__detail"><i class="wk wk-circle-email" /> <span>12345678@qq.com</span></p>
      </div>
      <span class="mark"><i class="wk wk-s-contacts" />首要联系人</span>
      <i class="wk wk-phone" />
    </flexbox>

    <div class="content">
      <div class="content-title">基本信息</div>
      <p
        v-for="(item , index) in list"
        :key="index"
        class="detail-cell">
        <span class="detail-cell__label">
          {{ item.label }}
        </span><br>
        <span class="detail-cell__value">
          {{ item.value }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  /** 首要联系人 */
  name: 'ChieflyContacts',
  components: {},
  props: {},
  data() {
    return {
      list: [
        {
          label: '手机号',
          value: '158-2359-8945'
        },
        {
          label: '客户来源',
          value: '客户来源'
        },
        {
          label: '区域',
          value: '区域'
        },
        {
          label: '备注',
          value:
            '意向很大，重点客户。需要常联系客户，让客户记住自己意向很大， 重点客户。需要常联系客户，让客户...'
        },
        {
          label: '详细地址',
          value: '郑州市金水区吉祥花园小区12号楼1单元1201'
        },
        {
          label: '下次联系时间',
          value: '2019-09-02'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.cell {
  padding: 5px;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  &-hd {
    position: relative;
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 10px;
  }

  &-bd {
    flex: 1;
    &__name {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      margin-top: 10px;
      margin-bottom: 2px;
      &--des {
        margin-left: 5px;
        padding-left: 5px;
        color: #666666;
        font-size: 12px;
        position: relative;
        font-weight: 500;
      }

      &--des::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 0;
        bottom: 1px;
        width: 1px;
        background-color: #666;
      }
    }

    &__detail {
      font-size: 12px;
      color: #333333;
      display: inline-block;
      margin-top: 8px;
      i {
        color: $xr-color-primary;
        font-size: 13px;
      }
    }
  }

  .mark {
    position: absolute;
    top: 4px;
    right: -2px;
    z-index: 1;
  }

  .wk-phone {
    position: absolute;
    top: 30px;
    right: 5px;
    z-index: 1;
  }
}

.mark {
  display: inline-block;
  color: #fb2337;
  background-color: #fff4f4;
  font-size: 12px;
  padding: 5px;
  border-radius: 4px;
  transform: scale(0.8);
  i {
    font-size: 12px;
    margin-right: 5px;
  }
}

.wk-phone {
  cursor: pointer;
  background-color: #fb9323;
  color: white;
  border-radius: 4px;
  display: inline-block;
  padding: 4px 5px;
  font-size: 14px;
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
