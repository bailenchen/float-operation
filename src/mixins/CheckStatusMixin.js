// 审批流状态 和 阶段审核状态
export default {
  methods: {
    // /**
    //  * 合同回款的审核状态
    //  * @param {*} status
    //  */
    // getCRMStatusColor(status) {
    //   if (status == 0) {
    //     return '#ffc539'
    //   } else if (status == 1) {
    //     return '#398dff'
    //   } else if (status == 2) {
    //     return '#20b559'
    //   } else if (status == 3) {
    //     return '#f95a5a'
    //   } else if (status == 4) {
    //     return '#dee8ff'
    //   } else if (status == 5) {
    //     return '#d9d9d9'
    //   }
    // },

    // /**
    //  * 合同回款的审核状态
    //  * @param {*} status
    //  */
    // getCRMStatusName(status) {
    //   if (status == 0) {
    //     return '待审核'
    //   } else if (status == 1) {
    //     return '审核中'
    //   } else if (status == 2) {
    //     return '通过'
    //   } else if (status == 3) {
    //     return '拒绝'
    //   } else if (status == 4) {
    //     return '撤回'
    //   } else if (status == 5) {
    //     return '未提交'
    //   }
    //   return ''
    // },

    /**
     * 审核颜色
     * @param {*} status
     */
    getStatusColor(status) {
      if (status == 0) {
        return '#ffc539'
      } else if (status == 1) {
        return '#20b559'
      } else if (status == 2) {
        return '#f95a5a'
      } else if (status == 3) {
        return '#398dff'
      } else if (status == 4) {
        return '#999'
      } else if (status == 5) {
        return '#d9d9d9'
      }
    },

    /**
     * 审核名称
     * @param {*} status
     */
    getStatusName(status) {
      if (status == 0) {
        return '待审核'
      } else if (status == 1) {
        return '通过'
      } else if (status == 2) {
        return '拒绝'
      } else if (status == 3) {
        return '审核中'
      } else if (status == 4) {
        return '撤回'
      } else if (status == 5) {
        return '未提交'
      }
      return ''
    },

    /**
     * 审核图标
     */
    getStatusIcon(status) {
      if (status == 0) {
        return 'wk wk-time'
      } else if (status == 1) {
        return 'wk wk-success'
      } else if (status == 2) {
        return 'wk wk-close'
      } else if (status == 3) {
        return 'wk wk-time'
      } else if (status == 4) {
        return 'wk wk-reset'
      } else if (status == 5) {
        return 'wk wk-time'
      }
      return ''
    }
  }
}
