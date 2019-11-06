<template>
  <div
    v-loading="loading"
    class="ranking-statistics card">
    <flexbox class="card-title">
      <div class="card-title-left">
        <span class="icon wk wk-hollow-results" />
        <span class="text">排行榜</span>
      </div>
      <div class="card-title-right">
        <el-dropdown
          trigger="click"
          @command="handleCommand">
          <span class="box">
            {{ optionName }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in options"
              :key="index"
              :command="index">
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </flexbox>
    <div class="card-desc">
      对回款金额进行的排行统计
    </div>
    <div class="content">
      <div class="title">{{ `${optionName}排行榜` }}</div>
      <el-table
        :data="data"
        height="235"
        style="width: 100%">
        <el-table-column
          prop="index"
          label="排名">
          <template slot-scope="scope">
            <img
              v-if="scope.row.sort < 4"
              :src="scope.row.sort | filterRankImage"
              class="ranking-img">
            <template v-else>{{ scope.row.sort }}</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
          <template slot-scope="scope">
            <xr-avatar
              :name="scope.row.realname"
              :size="30"
              class="user-img" />
            <span class="user-name">{{ scope.row.realname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="`${optionName}（${optionInfo.unit}）`"
          prop="value"/>
      </el-table>
      <div class="my-ranking">
        <span class="row value">
          <img
            v-if="!isNaN(Number(myData.sort)) && myData.sort < 4"
            :src="myData.sort | filterRankImage"
            class="ranking-img">
          <template v-else>{{ myData.sort }}</template>
        </span>
        <span class="row">
          <xr-avatar
            :name="myData.realname"
            :size="30"
            class="user-img" />
          <span class="user-name">{{ myData.realname }}</span>
        </span>
        <span class="row value">{{ myData.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { crmIndexRankingAPI } from '@/api/customermanagement/workbench'

import chartMixins from './chartMixins'
import { mapGetters } from 'vuex'

export default {
  name: 'RankingStatistics',
  filters: {
    filterRankImage(sort) {
      return [
        require('@/assets/img/1.png'),
        require('@/assets/img/2.png'),
        require('@/assets/img/3.png')
      ][sort - 1]
    }
  },
  mixins: [chartMixins],
  data() {
    return {
      data: [],
      myData: {
        ...this.userInfo,
        value: '--',
        sort: '--'
      },
      loading: false,

      options: [
        { name: '合同金额', value: 1 },
        { name: '回款金额', value: 2 },
        { name: '合同数', value: 3 },
        { name: '新增客户数', value: 4 },
        { name: '新增联系人', value: 5 },
        { name: '新增商机', value: 6 },
        { name: '新增商机金额', value: 7 },
        { name: '新增跟进记录数', value: 8 }
      ],
      optionName: '合同金额',
      optionValue: 1
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    optionInfo() {
      if (this.optionValue == 1 || this.optionValue == 2 || this.optionValue == 7) {
        return {
          key: 'money',
          unit: '元'
        }
      }
      return {
        key: 'count',
        unit: '个'
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      crmIndexRankingAPI({
        ...this.getBaseParams(),
        label: this.optionValue
      }).then(res => {
        this.loading = false
        const ranking = res.data.ranking || []
        const myData = res.data.self || {}
        this.data = ranking.map((item, index) => {
          item.sort = index + 1
          item.value = item[this.optionInfo.key]
          return item
        })

        if (Object.keys(myData).length === 0) {
          this.myData = {
            ...this.userInfo,
            sort: '--',
            value: '--'
          }
        } else {
          myData.value = myData[this.optionInfo.key]
          this.myData = myData
        }
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 下拉菜单选项选择
     * @param index 选项序号
     */
    handleCommand(index) {
      if (this.optionValue === this.options[index].value) return
      this.optionName = this.options[index].name
      this.optionValue = this.options[index].value
      this.getData()
    }
  }
}
</script>

<style scoped lang="scss">
  @import "style";
  .content {
    width: 100%;
    height: 300px;
    .title {
      font-size: 14px;
      color: #333;
      text-align: center;
      font-weight: bold;
          margin-bottom: 8px;
    }
  }

  .card-title-left .icon {
    color: #4A5BFD;
  }

  .el-table {
    /deep/ th.is-leaf {
      padding: 8px 0;
      background-color: white;
    }

    /deep/ th {
      .cell {
        font-weight: normal;
      }
    }
  }

  .ranking-img {
    width: 24px;
    vertical-align: middle;
  }

  .user-img,
  .user-name {
    vertical-align: middle;
  }

  .my-ranking {
    font-size: 14px;
    color: #333;
    background-color: #F5F5F5;

    .row {
      display: inline-block;
      width: 32%;
      padding-left: 16px;
      line-height: 44px;
    }

    .row:first-child {
      padding-left: 20px;
    }

    .value {
      color: $xr-color-primary;
      font-weight: bold;
    }
  }
</style>
