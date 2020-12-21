<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="教师排课表"
      placeholder="请输入教师姓名"
      main-title=""
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!education.teacherschedule.index"
      xs-empty-icon="nopermission"
      xs-empty-text="暂无权限"
      class="crm-container">
      <c-r-m-table-head
        ref="crmTableHead"
        :crm-type="crmType"
        class="filter-btn"
        @filter="handleFilter"
        @handle="handleHandle"
        @scene="handleScene">
        <template slot-scope="">
          <el-button :type="comName == 'WeekTable' ? 'primary' : ''" style="margin-left: 10px;" @click="toggleShow('week')">按周显示</el-button>
          <el-button :type="comName == 'DayTable' ? 'primary' : ''" @click="toggleShow('day')">按天显示</el-button>
        </template>
      </c-r-m-table-head>
      <div class="three-flex">
        <div class="toggle-btn">LAST</div>
        <div class="center-txt">
          <span style="color: red;">2020-11-14</span> 教师排课表
        </div>
        <div class="toggle-btn">NEXT</div>
      </div>
      <component :is="comName"/>
    </div>
  </div>
</template>

<script>
import DayTable from './components/DayTable'
import WeekTable from './components/WeekTable'
import table from '../mixins/table'

export default {
  /** 教务管理 的 教师排课表列表 */
  name: 'TeacherScheduleIndex',
  components: {
    DayTable,
    WeekTable
  },
  mixins: [table],
  data() {
    return {
      crmType: 'teacherschedule',
      comName: 'DayTable'

    }
  },
  mounted() {},
  methods: {
    // 按周/按天切换
    toggleShow(type) {
      this.comName = {
        week: 'WeekTable',
        day: 'DayTable'
      }[type]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../customermanagement/styles/table.scss';
.three-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  line-height: 50px;
  .toggle-btn {
    color: #2362FB;
    cursor: pointer;
  }
}

.filter-btn /deep/ .th-container .filter-button {
  margin-left: 0px;
}

/deep/ .el-table__header tr th {
  border-top: 1px solid #EBEEF5;
}
/deep/ .el-table__body td {
  border-right-color: #e6e6e6;
}
</style>
