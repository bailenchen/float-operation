<!--
 * @Author: your name
 * @Date: 2020-09-11 15:06:23
 * @LastEditTime: 2020-09-11 17:00:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\SystemManagement\SystemCustomer\bizParam\components\FieldListSet.vue
-->
<template>
  <div v-loading="loading">
    <div class="content-title">
      <span>列表排序设置</span>
    </div>
    <div class="content-body">
      <el-table
        :data="list"
        :height="tableHeight"
        stripe
        style="width: 100%;border: 1px solid #E6E6E6;">
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
          align="center"
          show-overflow-tooltip/>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="80">
          <template slot-scope="scope">
            <!-- <el-button @click="editHandle(scope.row)">编辑</el-button> -->
            <field-do
              :row="scope.row"
              @change="setSave"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { sysConfigFieldListQueryAPI } from '@/api/systemManagement/SystemCustomer'
import fieldDo from './fieldDo'
// import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
export default {
  name: 'FieldListSet',
  components: {
    fieldDo
  },
  data() {
    return {
      loading: false,
      list: [],
      fieldList: [
        { label: '模块名称', prop: 'name', width: 100 },
        { label: '字段顺序', prop: 'fieldNames' }
      ],
      tableHeight: '600px'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      sysConfigFieldListQueryAPI().then(res => {
        this.list = res.data
        this.loading = false
        console.log(res, '----')
      }).catch(() => {
        this.loading = false
      })
    },

    setSave() {
      this.getList()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang='scss' scoped>
.content-title {
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}

.content-title > span {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  margin-left: 20px;
}

.content-body {
  height: calc(100% - 57px);
  padding: 30px;
  overflow-y: auto;
}
</style>
