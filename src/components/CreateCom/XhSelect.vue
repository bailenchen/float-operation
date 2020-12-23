<template>
  <el-select
    v-model="dataValue"
    :disabled="disabled"
    :clearable="clearable"
    :placeholder="item.placeholder || '请选择'"
    style="width: 100%;"
    @change="valueChange">
    <el-option
      v-for="(item, index) in option"
      :key="index"
      :label="item.name"
      :value="item.value"/>
  </el-select>
</template>
<script type="text/javascript">
import stringMixin from './stringMixin'
import {
  QueryAdminGrade,
  QuerySignUpList,
  QueryCommunicationMode,
  QueryCoachingMethods,
  QueryAdminSubject
} from '@/api/systemManagement/params'
import { crmProductSetMealClassType } from '@/api/customermanagement/meal'
import {
  crmSettingRecordListAPI
} from '@/api/systemManagement/SystemCustomer'

export default {
  name: 'XhSelect', // 新建 select
  components: {},
  mixins: [stringMixin],
  props: {
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      option: [],
      reqMap: [
        {
          formType: 'subject',
          req: QueryAdminSubject,
          labelField: 'subjectName',
          valueField: 'id'
        },
        {
          formType: 'grades',
          req: QueryAdminGrade,
          labelField: 'gradeName',
          valueField: 'id'
        },
        {
          formType: 'coaching_methods',
          req: QueryCoachingMethods,
          labelField: 'name',
          valueField: 'name'
        },
        {
          formType: 'class_type',
          req: crmProductSetMealClassType,
          labelField: 'name',
          valueField: 'name'
        },
        {
          formType: 'follow_up_plan',
          req: crmSettingRecordListAPI
        },
        {
          formType: 'sign_up',
          req: QuerySignUpList,
          labelField: 'signUpName',
          valueField: 'id'
        },
        {
          formType: 'communication_mode',
          req: QueryCommunicationMode
        }
      ]
    }
  },
  computed: {},
  watch: {
    value(val) {
      console.log('监听value')
      console.log(val)
    },
    item: {
      handler(val, oldValue) {
        if (val && (val.setting || val.data.setting)) {
          const data = val.setting ? val : val.data
          const formType = data.formType
          var settingList = data.setting
          console.log('data', data)
          console.log('settingList11', settingList)
          if (settingList.length > 0 && typeof settingList[0] == 'string') {
            var array = []
            for (let index = 0; index < settingList.length; index++) {
              const element = settingList[index]
              array.push({ name: element, value: element })
            }
            this.option = array
          } else if (
            settingList.length > 0 &&
            settingList[0].statusId &&
            !settingList[0].value
          ) {
            // 商机阶段
            this.option = settingList.map((item, index, array) => {
              item.value = item.statusId
              return item
            })
          } else if (formType &&
            this.reqMap.map(o => o.formType).includes(formType)) {
            this.getSettingConfig()
          } else {
            this.option = settingList
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getSettingConfig() {
      if (!this.item ||
        !this.item.data ||
        !this.item.data.formType ||
        this.option.length > 0
      ) return
      const reqObj = this.reqMap.find(o => o.formType === this.item.data.formType)
      if (!reqObj) return
      reqObj.req().then(res => {
        this.option = (res.data || []).map(o => {
          if (Object.prototype.toString.call(o) === '[object Object]') {
            return {
              name: o[reqObj.labelField],
              value: o[reqObj.valueField]
            }
          } else {
            return {
              name: o,
              value: o
            }
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
