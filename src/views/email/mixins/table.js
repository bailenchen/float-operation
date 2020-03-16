// 邮件内列表 公共逻辑
import {
  mapGetters
} from 'vuex'
import {
  emailListsAPI,
  emailStateUpdateAPI,
  emailRecordLogicDeleteAPI,
  emailRecordShiftEmailAPI,
  emailRecordDeleteByEmailIdAPI } from '@/api/email/email'
import EmailListHead from '../components/EmailListHead'
import EmailTableHead from '../components/EmailTableHead'

import Lockr from 'lockr'
import moment from 'moment'

export default {
  components: {
    EmailListHead,
    EmailTableHead
  },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 265, // 表的高度
      search: '', // 搜索内容
      idLists: [], // 修改邮件状态时id集合
      allIds: [], // 全部信息id数组
      typeConfig: {
        receive: 'INBOX',
        star: 'STAR',
        draft: 'Drafts',
        sent: 'Sent Messages',
        deleted: 'Deleted Messages',
        goTo: 'INBOX',
        spam: '垃圾邮件',
        noRead: 'READ'
      },
      // 勾选
      isIndeterminate: true,
      checkAll: true,
      checkLists: [],

      // 页码与数量
      currentPage: 1,
      pageSize: Lockr.get('crmPageSizes') || 15,
      pageSizes: [15, 30, 60, 100],
      emailGoTo: '',
      total: 0

    }
  },
  computed: {
    ...mapGetters(['crm'])
  },
  created() {
    this.$bus.on('synEmail', () => {
      this.getEmailList()
    })
  },
  mounted() {
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 265
    }
  },
  destroyed() {
    this.$bus.off('synEmail')
  },
  methods: {
    /**
     * 获取列表
     */
    getEmailList() {
      this.loading = true
      this.$store.dispatch('GetEmailCount')
      var listType = this.typeConfig[this.emailType]
      this.allIds = []
      var params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.search
      }
      if (this.emailGoTo) {
        params.email = this.emailGoTo
      } else {
        params.type = listType
      }
      if (this.isNoRead) {
        params.read = 1
      }
      emailListsAPI(params).then((res) => {
        this.loading = false
        const list = JSON.parse(JSON.stringify(res.data.list))
        let sectionDate = ''
        // let sectionIndex = -1

        for (let index = 0; index < list.length; index++) {
          const item = list[index]
          console.log(item, 'item')
          if (this.isSender) {
            item.handleSender = this.handleSender(item.receiptName)
          } else {
            item.handleSender = this.handleSender(item.sender)
          }

          // 保证每次刷新列表时，列表不勾选
          item.checked = false
          this.allIds.push(item.id)
          if (item.createTime == null) {
            item.createTime = '0000-00-00'
          }
          item.showTime = item.createTime
          item.createTime = item.createTime.slice(0, 10)
          if (item.createTime != sectionDate) {
            sectionDate = item.createTime
            item.first = true
            item.bgIndex = 0
            item.numIndex = 0
            // if (item.first && index != 0) {
            //   list[index - list[index - 1].bgIndex].numIndex = list[index - 1].bgIndex + 1
            // }
            // if (sectionIndex >= 0) {
            //   list[sectionIndex].count = index - sectionIndex
            // }

            // sectionIndex = index

            // if (this.lists.length > 0 && this.lists.length - 1 === index) {
            //   list[sectionIndex].count = index - sectionIndex + 1
            // }
          } else {
            item.bgIndex = (list[index - 1].bgIndex + 1)
          }
          // 计算邮件表内每块封数
          if (item.bgIndex == 0) {
            list[index].numIndex = 1
          } else {
            list[index - item.bgIndex].numIndex = (item.bgIndex + 1)
          }
        }
        if (res.data.totalRow && Math.ceil(res.data.totalRow / this.pageSize) < this.currentPage && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1
          this.getEmailList()
        } else {
          this.total = res.data.totalRow
          this.loading = false
        }

        this.lists = list
        this.checkAll = false
        this.isIndeterminate = true
        // 保证刷新列表后，不显示表头操作
        this.$refs.crmTableHead.headSelectionChange([])
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 处理发件人/收件人
     */
    handleSender(sender) {
      if (!sender) {
        return ''
      }
      const endIndex = sender.indexOf('@')
      const startIndex = sender.indexOf('<') + 1
      let realStr = ''
      if (startIndex) {
        realStr = sender.slice(0, startIndex - 1).replace(/[\", \\]/g, '').trim()
      }
      const str = sender.slice(startIndex, endIndex).trim()
      if (realStr) {
        return realStr
      } else {
        return str
      }
    },

    /**
     * 收件人为多人时，只展示第一个人的信息
     */
    handleEmail(email) {
      const list = email.split(',')
      if (list.length > 1) {
        return false
      }
      return true
    },

    /**
     * 更改每页展示数量
     * @param {*} val
     */
    handleSizeChange(val) {
      Lockr.set('crmPageSizes', val)
      this.pageSize = val
      this.getEmailList()
    },

    /**
     * 更改当前页数
     * @param {*}
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getEmailList()
    },

    /**
     * 邮件搜索
     */
    emailSearch(value) {
      this.currentPage = 1
      this.search = value
      this.lists = []
      this.getEmailList()
    },

    /**
     * 全选
     */
    handleCheckedAll(all) {
      if (all) {
        this.isIndeterminate = false
        this.checkLists = this.lists.map((item) => {
          item.checked = true
          return item
        })
      } else {
        this.isIndeterminate = true
        this.checkLists = []
        this.lists.map((item) => {
          item.checked = false
          return item
        })
      }
      this.$refs.crmTableHead.headSelectionChange(this.checkLists)
    },

    /**
     * 局部勾选
     */
    handleCheckedPart(part) {
      this.checkLists = []
      if (part) {
        this.lists.map((item) => {
          if (item.checked) {
            this.checkLists.push(item)
            this.$refs.crmTableHead.headSelectionChange(this.checkLists)
          }
          return item
        })
      } else {
        this.lists.map((item) => {
          if (item.checked) {
            this.checkLists.push(item)
          }
          this.$refs.crmTableHead.headSelectionChange(this.checkLists)
          return item
        })
      }
      // 勾选了就展示全选的对号
      if (this.checkLists.length) {
        this.checkAll = true
        this.isIndeterminate = false
      } else {
        this.isIndeterminate = true
        this.checkAll = false
      }
    },

    /**
     * 列表邮件标题
     */
    getEmailDateSectionTitle(item) {
      if (item.createTime) {
        const template = new Date(item.createTime).getTime()
        if (moment(template).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
          return '今天'
        } else if (moment(template).format('YYYY-MM-DD') == moment().subtract(1, 'days').format('YYYY-MM-DD')) {
          return '昨天'
        } else {
          return moment(template).format('YYYY-MM-DD')
        }
      }
      return ''
    },

    /**
     * 星标操作（非批量）
     */
    handleStar(item) {
      this.idLists = []
      this.idLists.push(item.id)
      var starType = item.isStart ? 'cancelStar' : 'star'
      this.isConfirm(starType, 'FLAGGED', !item.isStar)
    },

    /**
     * 读取操作（非批量）
     */
    handleRead(item) {
      this.idLists = []
      this.idLists.push(item.id)
      var readType = item.isRead ? 'noRead' : 'read'
      this.isConfirm(readType, 'SEEN', !item.isRead)
    },

    /**
     * 修改邮件状态前提示
     * @param {* string} type: 指定修改为哪种状态
     * @param {* string} listapi: 指定修改状态state的值
     * @param {* boolean} isdo：指定flag的值
     */
    isConfirm(type, item, bool) {
      var message = ''
      let state = ''
      if (type == 'star') {
        message = '确定将邮件标记为星标邮件吗?'
        state = 3
        if (!this.checkLists.length) {
          this.updateEmailState(state, bool, item)
          if (this.$refs.crmTableHead) {
            this.$refs.crmTableHead.dialogVisible = false
          }
          return
        }
      } else if (type == 'cancelStar') {
        message = '确定将邮件取消星标邮件吗?'
        state = 4
        if (!this.checkLists.length) {
          this.updateEmailState(state, bool, item)
          if (this.$refs.crmTableHead) {
            this.$refs.crmTableHead.dialogVisible = false
          }
          return
        }
      } else if (type == 'read') {
        message = '确定将邮件标记为已读邮件吗?'
        state = 1
      } else if (type == 'noRead') {
        message = '确定将邮件标记为未读邮件吗?'
        state = 2
      } else if (type == 'delete') {
        message = '确定将邮件删除吗?'
        state = 5 // 删除
      } else if (type == 'rootDel') {
        message = '确定将邮件彻底删除吗?'
        state = 6 // 彻底删除
      } else {
        state = 7
        message = `确定要移动邮件到${item.name}吗`
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateEmailState(state, bool, item)
          if (this.$refs.crmTableHead) {
            this.$refs.crmTableHead.dialogVisible = false
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },

    /**
     * 更改邮件状态
     */
    updateEmailState(stateType, is, item) {
      if (stateType === 5) {
        this.deleteEmail()
        return
      } else if (stateType === 6) {
        this.destoryEmail()
        return
      } else if (stateType === 7) {
        this.transform(item)
        return
      } else {
        this.handleMore(stateType, is)
        return
      }
    },

    /**
     * 普通删除邮件
     */
    deleteEmail() {
      this.loading = true
      emailRecordLogicDeleteAPI({ emailIds: this.idLists.join(',') }).then(res => {
        this.$message.success('删除成功')
        this.getEmailList()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 彻底删除邮件
     */
    destoryEmail() {
      this.loading = true
      emailRecordDeleteByEmailIdAPI({ emailIds: this.idLists.join(',') }).then(res => {
        this.$message.success('彻底删除成功')
        this.getEmailList()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 已读，未读，星标，取消星标
     */
    handleMore(stateType, is) {
      this.loading = true
      this.submitMoreHandle(stateType, is).then(res => {
        if (is !== 'detail') {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
        this.loading = false
        this.getEmailList()
        this.queryEmailNum()
      }).catch(() => {
        this.loading = false
      })
    },

    submitMoreHandle(stateType, is) {
      var params = {
        emailIds: this.idLists.join(','),
        state: stateType
      }
      return new Promise((resolve, reject) => {
        emailStateUpdateAPI(params).then(res => {
          resolve(res)
        }).catch(() => {
          reject()
        })
      })
    },

    /**
     * 全部标记为已读
     */
    allRead() {
      this.idLists = this.allIds
      this.handleMore(1, '')
    },

    /**
     * 移动到
     */
    transform(item) {
      const params = {
        emailIds: this.idLists.join(','),
        emailType: item.kind
      }
      this.loading = true
      emailRecordShiftEmailAPI(params).then(() => {
        this.$message.success('移动成功')
        this.loading = false
        this.getEmailList()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 往来邮件
     */
    getDealingsEmail(name, item) {
      this.emailGoTo = this.isSender ? item.receiptEmails : item.senderEmail
      const emailText = `${name}<${this.emailGoTo}>`
      this.$router.push({ path: '/email/index/goTo', query: { email: this.emailGoTo, emailText: emailText }})
    },

    /**
     * 选择当前天的所有邮件
     */
    selectCurrent(index, count) {
      // index 当前数据所处数组的位置，当前数据所包含几条数据
      this.lists.forEach((item, number) => {
        if (number >= index && number < (index + count)) {
          item.checked = !item.checked
          if (item.checked) {
            this.checkLists.push(item)
          } else {
            this.checkLists.forEach((ele, index) => {
              if (ele.id === item.id) {
                this.checkLists.splice(index, 1)
              }
            })
          }
        }
      })
      this.$refs.crmTableHead.headSelectionChange(this.checkLists)
      this.lists = JSON.parse(JSON.stringify(this.lists))
    }
  }
}
