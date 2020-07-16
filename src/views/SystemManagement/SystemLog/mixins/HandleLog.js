export default {
  data() {
    return {
      typesOptions: [{
        label: '线索',
        value: 1
      }, {
        label: '客户',
        value: 2
      }, {
        label: '客户公海',
        value: 9
      }, {
        label: '联系人',
        value: 3
      }, {
        label: '产品',
        value: 4
      }, {
        label: '商机',
        value: 5
      }, {
        label: '合同',
        value: 6
      }, {
        label: '回款',
        value: 7
      }, {
        label: '回款计划',
        value: 8
      }, {
        label: '推广',
        value: 10
      }, {
        label: '日志',
        value: 11
      }, {
        label: '办公审批',
        value: 12
      }, {
        label: '任务',
        value: 13
      }, {
        label: '项目',
        value: 14
      }, {
        label: '标签',
        value: 15
      }, {
        label: '日历',
        value: 16
      }, {
        label: '回访',
        value: 17
      }, {
        label: '发票',
        value: 18
      }],
      sysOptions: [{
        label: '企业首页',
        value: 1
      }, {
        label: '应用管理',
        value: 2
      }, {
        label: '员工管理',
        value: 3
      }, {
        label: '部门管理',
        value: 4
      }, {
        label: '名片小程序管理',
        value: 5
      }, {
        label: '角色管理',
        value: 6
      }, {
        label: '业务审批流',
        value: 7
      }, {
        label: '办公审批流',
        value: 8
      }, {
        label: '项目管理',
        value: 9
      }, {
        label: '客户管理',
        value: 10
      }, {
        label: '系统日志管理',
        value: 11
      }, {
        label: '其他设置',
        value: 12
      }],
      fieldList: [
        {
          prop: 'realname',
          label: '用户',
          width: 100
        },
        {
          prop: 'createTime',
          label: '时间',
          width: 150
        },
        {
          prop: 'ipAddress',
          label: 'IP地址',
          width: 100
        },
        {
          prop: 'types',
          label: '模块',
          width: 150
        },
        {
          prop: 'behavior',
          label: '行为',
          width: 150
        },
        {
          prop: 'object',
          label: '对象',
          width: 150
        },
        {
          prop: 'detail',
          label: '操作详情',
          width: 100
        }
      ]
    }
  }
}
