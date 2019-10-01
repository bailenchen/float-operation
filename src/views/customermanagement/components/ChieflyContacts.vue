<template>
  <div v-loading="loading" class="chiefly-contacts">
    <flexbox
      v-if="detail"
      class="cell"
      align="stretch">
      <div
        v-photo="headInfo"
        v-lazy:background-image="$options.filters.filterUserLazyImg(headInfo.img)"
        class="div-photo cell-hd" />
      <div class="cell-bd">
        <p class="cell-bd__name">
          <span>{{ detail.name }}</span>
          <span
            v-if="detail.post"
            class="cell-bd__name--des">{{ detail.post }}</span>
        </p>
        <p class="cell-bd__detail">
          <i class="wk wk-circle-iphone" />
          <span v-if="detail.mobile">{{ detail.mobile }}</span>
          <span v-else class="no-data">暂无电话</span>
        </p>
        <p class="cell-bd__detail">
          <i class="wk wk-circle-email" />
          <span v-if="detail.email">{{ detail.email }}</span>
          <span v-else class="no-data">暂无邮箱</span>
        </p>
      </div>
      <span class="mark"><i class="wk wk-s-contacts" />首要联系人</span>
      <i
        class="wk wk-phone"
        @click="callPhone" />
    </flexbox>

    <import-info v-if="list.length" :list="list" />

  </div>
</template>

<script>
import { crmContactsRead } from '@/api/customermanagement/contacts'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import { filedGetInformation } from '@/api/customermanagement/common'
import ImportInfo from './ImportInfo'

export default {
  // 首要联系人
  name: 'ChieflyContacts',
  components: {
    ImportInfo
  },
  props: {
    id: [Number, String]
  },
  data() {
    return {
      loading: false,
      detail: null,
      list: []
    }
  },
  computed: {
    // 有首要联系人
    hasInfo() {
      return this.id
    },

    // 联系人文字头像
    headInfo() {
      return {
        img: '',
        realname: this.detail.name
      }
    }
  },
  watch: {
    id() {
      this.detail = null
      this.list = []
      this.getDetial()
    }
  },
  mounted() {
    this.getDetial()
  },

  beforeDestroy() {},
  methods: {
    /**
     * 获取联系人详情
     */
    getDetial() {
      if (this.hasInfo) {
        this.loading = true
        crmContactsRead({
          contactsId: this.id
        })
          .then(res => {
            this.loading = false
            this.detail = res.data
          })
          .catch(() => {
            this.loading = false
          })
        this.getBaseInfo()
      }
    },

    /**
     * 打电话
     */
    callPhone() {
      this.$message.error('请先开通呼叫中心')
    },

    /**
     * 获取基础信息
     */
    getBaseInfo() {
      this.loading = true
      filedGetInformation({
        types: crmTypeModel['contacts'],
        id: this.id
      })
        .then(res => {
          this.list = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.chiefly-contacts {
  overflow: auto;
  height: 100%;
  padding: 15px;
  overflow-y: overlay;
}

.cell {
  padding: 12px;
  border-radius: 4px;
  position: relative;
  border: 1px solid #EBEEF5;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);

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
      margin-top: 8px;
      i {
        color: $xr-color-primary;
        font-size: 13px;
      }

      .no-data {
        color: #999;
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

</style>
