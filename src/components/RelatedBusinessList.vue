<template>
  <div class="related-business-list">
    <div
      v-for="(item, index) in data.customer"
      :key="`customer_${index}`"
      class="list-item">
      <span class="wk wk-customer icon" />
      <span class="type">客户-</span>
      <span class="name">
        {{ item.customerName }}
      </span>
    </div>
    <div
      v-for="(item, index) in data.business"
      :key="`business_${index}`"
      class="list-item">
      <span class="wk wk-business icon" />
      <span class="type">商机-</span>
      <span class="name">
        {{ item.businessName }}
      </span>
    </div>
    <div
      v-for="(item, index) in data.contacts"
      :key="`contacts_${index}`"
      class="list-item">
      <span class="wk wk-contacts icon" />
      <span class="type">联系人-</span>
      <span class="name">
        {{ item.name }}
      </span>
    </div>
    <div
      v-for="(item, index) in data.contract"
      :key="`contract_${index}`"
      class="list-item">
      <span class="wk wk-contract icon" />
      <span class="type">合同-</span>
      <span class="name">
        {{ item.name }}
      </span>
    </div>

    <!--<c-r-m-all-detail
      :visible.sync="showRelatedDetail"
      :crm-type="relatedCRMType"
      :listener-ids="['workbench-main-container']"
      :no-listener-ids="['journal-list-box']"
      :id="relatedID"
      class="d-view" />-->
  </div>
</template>

<script>
/**
 * 关联业务列表
 * @props data {Object}
 */
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'

export default {
  name: 'RelatedBusinessList',
  components: {
    CRMAllDetail
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
  .related-business-list {
    width: 100%;
    .list-item {
      font-size: 12px;
      padding: 7px 15px;
      &:hover {
        background-color: rgba(35,98,251,.04);
      }
      .icon {
        color: #8A94A6;
        font-size: 14px;
        margin-right: 5px;
      }
      .name {
        color: $xr-color-primary;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
