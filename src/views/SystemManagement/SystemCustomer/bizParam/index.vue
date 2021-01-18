<template>
  <div class="system-customer">
    <xr-header
      icon-class="wk wk-s-seas"
      icon-color="#487DFF"
      label="业务参数设置" />
    <div class="customer-content">
      <!-- 客户管理导航 -->
      <div class="system-view-nav">
        <div
          v-for="(item, index) in menuList"
          :key="index"
          :class="{'is-select' : item.key == menuIndex}"
          class="menu-item"
          @click="menuSelect(item.key)">
          {{ item.label }}
        </div>
      </div>
      <keep-alive>
        <component
          :is="componentName"
          :type="menuIndex"
          class="system-view-content"/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import ContractExpireSet from './components/contractExpireSet' // 合同到期提醒设置
import XrHeader from '@/components/xr-header'

import ChannelCategorySet from './components/channelCategorySet' // 渠道设置
import ChannelTypeSet from './components/channelTypeSet' // 渠道类型设置
import GradeSet from './components/gradeSet' // 年级设置
import PresentRulesSet from './components/presentRulesSet' // 赠送规则设置
// import FollowLogTypeSet from './components/followLogTypeSet' // LEADS状态类型
// import FollowLogResultSet from './components/followLogResult' // 跟进结果
import LeadsStatusFollowResultSet from './components/LeadsStatusFollowResult' // 跟进结果
import FollowCommonWords from './components/followCommonWords' // 跟进结果
import CustomerLimitSet from './components/customerLimitSet' // 拥有/锁定LEADS数限制
import SignedPossibilitySet from './components/signedPossibilitySet' // 签约可能性设置
import SubjectSet from './components/subjectSet' // 科目设置
import RemindSet from './components/remindSet' // 学员回访提醒设置/LEADS承诺到访提醒设置
import CommunicationSet from './components/communicationSet' // 学员回访沟通方式设置
import SerialNumberSet from './components/SerialNumberSet' // 编号规则设置
import FieldListSet from './components/FieldListSet' // 编号规则设置
import DataDictionarySet from './components/dataDictionarySet' // 编号规则设置
import StudentWarningSet from './components/StudentWarningSet' // 学员预警规则设置
import PersonAccountSet from './components/PersonAccountSet' // 个人账户认证
import OrganizationSet from './components/OrganizationSet' // 机构认证
import DFRASSet from './components/DFRASSet' // 人脸考勤设备清单

export default {
  name: 'BizParam',
  components: {
    ContractExpireSet,
    XrHeader,

    ChannelCategorySet,
    ChannelTypeSet,
    GradeSet,
    PresentRulesSet,
    // FollowLogTypeSet,
    CustomerLimitSet,
    SignedPossibilitySet,
    SubjectSet,
    RemindSet,
    SerialNumberSet,
    // FollowLogResultSet,
    FollowCommonWords,
    CommunicationSet,
    LeadsStatusFollowResultSet,
    FieldListSet,
    DataDictionarySet,
    StudentWarningSet,
    PersonAccountSet,
    OrganizationSet,
    DFRASSet
  },

  data() {
    return {
      menuList: [
        { label: '渠道设置', key: 'ChannelCategorySet' },
        { label: '渠道类型设置', key: 'ChannelTypeSet' },
        { label: '年级设置', key: 'GradeSet' },
        { label: '累计赠送规则', key: 'PresentRulesSet' },
        // { label: 'LEADS状态设置', key: 'FollowLogTypeSet' },
        // { label: '跟进结果设置', key: 'FollowLogResultSet' },
        { label: 'LEADS状态&跟进结果设置', key: 'LeadsStatusFollowResultSet' },
        { label: '跟进常用语设置', key: 'FollowCommonWords' },
        { label: '拥有LEADS数限制', key: 'own' },
        { label: '锁定LEADS数限制', key: 'lock' },
        { label: '学员回访提醒设置', key: 'studentVisit' },
        { label: '学员回访沟通方式设置', key: 'CommunicationSet' },
        { label: '签约可能性设置', key: 'SignedPossibilitySet' },
        { label: '科目设置', key: 'SubjectSet' },
        { label: 'LEADS承诺到访提醒设置', key: 'leadsVisit' },
        { label: '编号规则设置', key: 'SerialNumberSet' },
        { label: '自定义列表设置', key: 'FieldListSet' },
        { label: '数据字典', key: 'DataDictionarySet' },
        { label: '学员预警规则设置', key: 'StudentWarningSet' },
        { label: '个人账户认证', key: 'PersonAccountSet' },
        { label: '机构认证', key: 'OrganizationSet' },
        { label: '人脸考勤设备清单', key: 'DFRASSet' }
      ],
      menuIndex: 'ChannelCategorySet',
      types: '' // 区分拥有客户 和 锁定客户
    }
  },

  computed: {
    componentName() {
      if (['own', 'lock'].includes(this.menuIndex)) {
        return 'CustomerLimitSet'
      }
      if (['studentVisit', 'leadsVisit'].includes(this.menuIndex)) {
        return 'RemindSet'
      }
      return this.menuIndex
    }
  },

  methods: {
    /**
     * 菜单选择
     */
    menuSelect(i) {
      if (i == 'own' || i == 'lock') {
        this.types = {
          own: 1,
          lock: 2
        }[i]
      }
      this.menuIndex = i
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.system-customer {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}
.customer-content {
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
}
.system-view-nav {
  min-width: 200px;
  background: #fff;
  margin-right: 10px;
  overflow-y: auto;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
}
.system-view-content {
  flex: 1;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}

// 菜单
.menu-item {
  color: #333;
  font-size: 13px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  position: relative;
  .icon-close {
    position: absolute;
    top: 0;
    right: 8px;
    z-index: 1;
    display: none;
  }
}

.menu-item:hover,
.menu-item.is-select {
  background-color: $xr--background-color-base;
}

.menu-item:hover::before,
.menu-item.is-select::before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 2px;
  background-color: #5383ed;
}
</style>
