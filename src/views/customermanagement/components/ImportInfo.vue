<template>
  <div
    class="content">
    <div class="content-title">基本信息</div>
    <p
      v-for="(item , index) in showList"
      :key="index"
      class="detail-cell">
      <span class="detail-cell__label">
        {{ item.name }}
      </span><br>
      <span class="detail-cell__value">
        {{ getValueContent(item) }}
      </span>
    </p>
  </div>
</template>

<script>

export default {
  //  重要信息 中的列表展示
  name: 'ImportInfo',
  components: {},
  props: {
    list: Array
  },
  data() {
    return {}
  },
  computed: {
    showList() {
      return this.list.filter(item => {
        return item.formType !== 'file'
      })
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    getValueContent(item) {
      if (item.formType === 'map_address') {
        return item.value ? item.value.detailAddress : ''
      } else if (item.formType === 'single_user') {
        return item.value ? item.value.realname : ''
      } else if ([
        'checkbox',
        'structure',
        'single_structure',
        'user'
      ].includes(item.formType)
      ) {
        if (
          !item.value ||
        Object.prototype.toString.call(item.value) !== '[object Array]'
        ) {
          return ''
        }

        const field = {
          structure: 'name',
          single_structure: 'name',
          user: 'realname',
          checkbox: ''
        }[item.formType]
        return item.value
          .map(item => {
            return field ? item[field] : item
          })
          .join('，')
      } else if ([
        'customer',
        'business',
        'contract',
        'contacts',
        'category',
        'leads_source',
        'statusName',
        'typeName'
      ].includes(item.formType)) {
        const field = {
          customer: 'customerName',
          business: 'businessName',
          contract: 'contractNum',
          contacts: 'contactsName',
          category: 'categoryName',
          statusName: 'statusName',
          typeName: 'typeName',
          leads_source: 'name'
        }[item.formType]
        return item.value ? item.value[field] : ''
      } else if (item.formType === 'grades') {
        return item.value ? item.value.gradeName : ''
      } else if (item.formType === 'sign_up') {
        return item.value ? item.value.signUpName : ''
      }

      return item.value
    }
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
