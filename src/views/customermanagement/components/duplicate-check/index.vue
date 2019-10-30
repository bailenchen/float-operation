<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    :before-close="handleClose"
    title="客户查重"
    custom-class="no-padding-dialog"
    width="800px">
    <div
      :class="{ 'show-table': showTable }"
      class="duplicate-check">
      <el-input
        v-model="searchContent"
        class="search-input"
        @input="searchInput"
        @keyup.enter.native="searchInput">
        <el-select
          slot="prepend"
          v-model="typeSelect"
          placeholder="请选择">
          <el-option
            label="按客户名称"
            value="1" />
          <el-option
            label="按手机号"
            value="2" />
        </el-select>
        <el-button
          slot="append"
          type="primary"
          icon="wk wk-search"
          @click.native="searchInput">查重</el-button>
      </el-input>

      <el-table
        v-if="showTable"
        :data="tableData"
        class="duplicate-check__content"
        border
        height="380"
        style="width: 100%">
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip />
        <el-table-column
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleClick">领取</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div
        v-if="showTable"
        class="duplicate-check__footer">注：查重结果最多显示10条，如不完整，请完善查重条件</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DuplicateCheck',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeSelect: '1',
      searchContent: '',
      tableData: [],

      // 客户名称、创建时间、负责人、最后跟进时间、操作
      fieldList: [{
        prop: 'name',
        label: '客户名称',
        width: 150
      }, {
        prop: 'createTime',
        label: '创建时间',
        width: 150
      }, {
        prop: 'ownerUserName',
        label: '负责人',
        width: 150
      }, {
        prop: 'lastTime',
        label: '最后跟进时间',
        width: 150
      }]
    }
  },
  computed: {
    showTable() {
      return this.tableData && this.tableData.length > 0
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },

    searchInput() {
      this.tableData =
        this.tableData.length > 0
          ? []
          : [
            {
              createTime: '2016-05-02',
              name: '王小虎',
              ownerUserName: '上海市普陀区金沙江路 1518 弄'
            },
            {
              date: '2016-05-04',
              createTime: '王小虎',
              ownerUserName: '上海市普陀区金沙江路 1517 弄'
            }
          ]
    },

    handleClick() {

    }
  }
}
</script>

<style scoped lang="scss">
.duplicate-check {
  position: relative;
  padding: 20px;
  padding-bottom: 40px;

  &__content {
    margin-top: 15px;
  }

  &__footer {
    margin-top: 10px;
    font-size: 12px;
    color: #666;
  }
}

.duplicate-check.show-table {
  padding-bottom: 20px;
}

.el-input {
  /deep/ .el-select .el-input {
    width: 130px;
    /deep/ i {
      font-weight: bold;
    }
  }

  /deep/ .el-input-group__append {
    background-color: $xr-color-primary;
    border-color: $xr-color-primary;
    color: white;

    .el-button {
      /deep/ i {
        margin-right: 5px;
        font-size: 14px;
      }
    }
  }
}
</style>
