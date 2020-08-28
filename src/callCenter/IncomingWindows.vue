<template>
  <div>
    <c-r-m-full-screen-detail
      :visible.sync="showDview"
      :coustomer-id="customerId"
      :model-data="modelData"
      :crm-type="crmType"
      :id="rowID"
      @close="showDview = false"/>
    <crm-create-view
      v-if="isCreate"
      :phone="phone"
      :customer-type="customerType"
      :crm-type="crmType"
      @save-success="createSaveSuccess"
      @hiden-view="hiddenView"/>
    <div v-if="showCall && notify" :style="{zIndex:zIndex}" class="timePieces">
      <div v-if="!showRing && !showHang" style="display: flex" class="timePiece">
        <p class="timePieceP1">通话中 :</p>
        <p class="timePieceP2">{{ callinTime }}</p>
      </div>
      <div v-else-if="showRing && !showHang" style="display: flex" class="timePiece1">
        <p class="timePieceP1">振铃中 :</p>
        <p class="timePieceP2">{{ callinTime }}</p>
      </div>
      <div v-else-if="showHang" :style="{zIndex:zIndex}" class="red-timePiece">已挂断</div>
      <el-card v-if="showDrop" :style="{zIndex: zIndex}" class="dropdown">
        <li @click="showCreate('contacts')">添加联系人</li>
        <li @click="showCreate('leads')">添加线索</li>
        <li @click="showCreate('customer')">添加客户</li>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getMaxIndex } from '../utils'
import {
  crmCallCheckAuth,
  crmCallSaveAPI
} from '../api/customermanagement/customer'
import callCenter from './callWebSokets'
import { crmCallInNumberSearch } from '../api/businessIntelligence/callCenter'
import CRMFullScreenDetail from '@/views/customermanagement/components/CRMFullScreenDetail'
import CrmCreateView from '@/views/customermanagement/components/CRMCreateView'
import Lockr from 'lockr'
import config from '../config'

export default {
  name: 'IncomingWindows',
  components: { CrmCreateView, CRMFullScreenDetail },
  data() {
    return {
      showDview: false,
      customerId: 0,
      rowID: 0,
      zIndex: 0,
      isCreate: false,
      showHang: false,
      phone: '',
      modelData: {},
      crmType: 'customer',
      showCall: false,
      showDrop: false,
      customerType: '',
      notify: null,
      isSoftCallIn: false // 是软乎呼入 2007
    }
  },
  computed: {
    // 接通再计时
    callinTime() {
      return this.$store.state.customer.callinTime
    },
    getAuth() {
      if (this.$store.state.user.userInfo === null) {
        return false
      }
      return true
    },
    // 展示振铃
    showRing() {
      return this.$store.state.customer.showRing
    }
  },
  watch: {
    // 查询权限,有权限才能连接呼叫中心
    getAuth: {
      handler(val) {
        if (val) {
          crmCallCheckAuth().then(res => {
            const data = res.data || {}
            // if (!data.auth) {
            if (data.auth && res.user.username && res.user.password && res.user.channel && res.user.hardPhone) {
              const call = {
                socketUrl: config.callCenterConfig.socketUrl, // 电话websocket连接url
                account: res.user.username, // 登录账号
                password: res.user.password, // 登录密码
                channel: res.user.channel, // 渠道
                domain: config.callCenterConfig.domain, // 域信息
                skillGroupCode: [], // 技能组编号列表
                telephone: res.user.hardPhone // 硬话机
              }
              callCenter.setEnv(call)
              this.callCenterConnect()
              this.$store.commit('GET_IS_CALL', true)
              Lockr.set('wkCallData', data)
            } else {
              Lockr.rm('wkCallData')
              this.$store.commit('GET_IS_CALL', false)
            }
          }).catch(() => {
            this.$store.commit('GET_IS_CALL', true)
            this.callCenterConnect()
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.addBus()
    // this.incoming() // 测试
  },
  methods: {
    addBus() {
      var self = this
      this.$bus.off('call-message')
      this.$bus.on('call-message', data => {
        self.modelId = data.id
        self.model = data.type
        this.showCall = true
      })
    },
    /**
     * 显示新建
     */
    showCreate(type) {
      this.crmType = type
      this.showDrop = false
      this.isCreate = true
    },
    // 创建数据页面 保存成功
    createSaveSuccess(data) {
      if (data && data.saveAndCreate) {
        if (data.type == 'customer') {
          this.createCRMType = 'contacts'
          this.createActionInfo = {
            type: 'relative',
            crmType: this.crmType,
            data: {}
          }
          this.createActionInfo.data['customer'] = data.data
          this.isCreate = true
        }
      } else {
        // 回到保存成功
        this.$emit('on-handle', { type: 'save-success' })
      }
    },
    /**
     * 隐藏新建页面
     */
    hiddenView() {
      this.isCreate = false
    },
    /**
     * 模糊查询
     */
    getMember(number, type, callType) {
      const data = {
        page: 1,
        limit: 1,
        search: number
      }
      // callCenter.clearWebSoketsInterval()
      this.phone = number
      crmCallInNumberSearch(data)
        .then(res => {
          if (res.data !== '') {
            this.model = res.data.model
            if (!res.data.ownerUserName) {
              this.realname = ''
            } else {
              this.realname = res.data.ownerUserName
            }
            this.modelId = res.data[this.model + 'Id']
            if (this.model === 'contacts') {
              this.customerName = res.data.name // 客户名称
              this.incomingName = '联系人'
              this.companyName = res.data.customerName // 联系人模块需要显示公司名称
            } else if (this.model === 'leads') {
              this.incomingName = 'LEADS'
              // this.customerName = res.data.name
              this.customerName = res.data.leadsNumber
              this.companyName = ''
            } else {
              this.incomingName = '客户'
              this.customerName = res.data.name
              this.companyName = res.data.customerName
            }
            if (res.data && res.data.customerId) {
              this.customerId = res.data.customerId
            }
            this.refreshStatus(type, callType)
          } else {
            this.realname = ''
            this.customerName = ''
            this.companyName = ''
            this.refreshStatus(type, callType)
          }
          setTimeout(() => {
            this.showHang = false
          }, 2000)
          this.$store.commit('SHOW_TIMER', true)
        })
        .catch(() => {
          this.realname = ''
          this.customerName = ''
          this.companyName = ''
          this.incoming()
        })
    },
    /**
     * 来电监听 (调用此方法会触发弹屏)
     */
    incoming() {
      const that = this
      const isSoft = callCenter.getHisUse() == 1 // hisUse 0 是默认硬呼 1 是软乎
      const h = this.$createElement
      this.notify = this.$notify({
        title: '来电信息',
        dangerouslyUseHTMLString: true,
        duration: 0,
        onClose: () => {
          this.showHang = false
          this.showCall = false
          this.notify = null
        },
        position: 'bottom-right',
        message: h('div', {
          style: {
            width: '330px',
            height: '200px',
            position: 'relative'
          }
        }, [
          h('div', {
            style: {
              display: this.customerName || this.companyName ? 'flex' : 'none',
              marginTop: '20px'
            }
          }, [
            h('img', {
              attrs: {
                alt: '这是一张图片',
                src: require('@/assets/img/add_examine.png')
              },
              class: 'headImg'
            }),
            h('p', {
              style: {
                lineHeight: '40px',
                height: '40px',
                marginLeft: '10px',
                fontSize: '16px',
                fontWeight: 400
              }
            }, this.companyName || this.customerName)
            // h('div', {
            //   class: 'timePiece'
            // }, [
            //   h('p', {
            //   class: 'timePieceP1'
            //   }, '通话中: '),
            //   h('p', {
            //     id: 'p1',
            //     class: 'timePieceP2'
            //   }, [this.callinTime])
            // ])
          ]),
          h('div', {
            style: {
              marginTop: '20px',
              display: this.customerName ? 'block' : 'none'
            }
          }, [
            h('p', {
              style: {
                lineHeight: '20px',
                height: '20px',
                fontSize: '13px',
                fontWeight: 300
              }
            }, [
              h('span', {}, `${this.incomingName}姓名:   `),
              h('span', { style: { fontWeight: 500 }}, this.customerName)
            ]),
            h('p', {
              style: {
                lineHeight: '40px',
                height: '40px',
                fontSize: '13px',
                fontWeight: 300
              }
            }, [
              h('span', {}, `${this.incomingName}电话:   `),
              h('span', { style: { color: '#3E84E9' }}, this.phone)
            ]),
            h('p', {
              style: {
                lineHeight: '40px',
                height: '40px',
                fontSize: '13px',
                fontWeight: 300,
                display: this.realname ? 'block' : 'none'
              }
            }, [
              h('span', {}, '负责人:   '),
              h('span', { style: { color: '#3E84E9' }}, this.realname)
            ])
          ]),
          h('div', {
            style: {
              display: this.customerName ? 'none' : 'block',
              marginTop: '20px'
            }
          }, [h('p', {}, '未知来电'), h('p', { style: { color: '#3E84E9' }}, this.phone)]),
          h('div', {
            style: {
              display: 'flex',
              position: 'absolute',
              bottom: '10px'
            }
          }, [
            h('el-button', {
              type: 'primary',
              class: 'el-button-primary',
              style: {
                backgroundColor: (this.showRing && this.isAnswer) ? '#3E84E9' : '#909399',
                height: '27px',
                display: isSoft ? 'none' : 'inline-block',
                paddingTop: '5px',
                paddingBottom: '5px',
                paddingLeft: '25px',
                paddingRight: '25px',
                borderRadius: '4px',
                color: 'white'
              },
              on: {
                click: () => {
                  callCenter.OnAnswer()
                }
              }
            }, '接听'),
            h('el-button', {
              type: 'primary',
              class: 'el-button-primary',
              style: {
                backgroundColor: (!this.showRing && this.isAnswer) ? '#909399' : '#f56c6c',
                height: '27px',
                display: isSoft ? 'none' : 'inline-block',
                paddingTop: '5px',
                paddingBottom: '5px',
                paddingLeft: '25px',
                paddingRight: '25px',
                borderRadius: '4px',
                color: 'white'
              },
              on: {
                click: () => {
                  callCenter.OnHungUp()
                }
              }
            }, '挂断'),
            h('el-button', {
              type: 'primary',
              class: 'el-button-primary',
              style: {
                backgroundColor: (this.showRing && this.isAnswer) ? '#909399' : '#f56c6c',
                display: this.showHang ? 'none' : 'inline-block',
                height: '27px',
                paddingTop: '5px',
                paddingBottom: '5px',
                paddingLeft: '25px',
                paddingRight: '25px',
                borderRadius: '4px',
                color: 'white'
              },
              on: {
                click: () => {
                  if (!that.showHang) {
                    that.$bus.emit('showRefer', true)
                  }
                }
              }
            }, '转接'),
            h('el-button', {
              type: 'primary',
              class: 'el-button-primary',
              style: {
                display: this.customerName ? 'block' : 'none',
                paddingTop: '5px',
                paddingBottom: '5px',
                height: '27px',
                paddingLeft: '25px',
                paddingRight: '25px',
                borderRadius: '4px',
                color: '#333'
              },
              on: {
                click: () => {
                  this.rowID = this.modelId
                  this.crmType = this.model
                  this.showDview = true
                  console.log(888888, this.modelId, this.model)
                  this.$store.commit('SHOW_TIMER', true)
                  this.modelData = {
                    modelId: this.modelId,
                    model: this.model
                  }
                }
              }
            }, '查看详情'), h('el-button', {
              type: 'primary',
              style: {
                display: this.customerName ? 'none' : 'block',
                paddingTop: '5px',
                paddingBottom: '5px',
                height: '27px',
                paddingLeft: '25px',
                paddingRight: '25px',
                borderRadius: '4px',
                color: '#333'
              },
              on: {
                click: () => {
                  this.showDrop = !this.showDrop
                }
              }
            }, '添加 ∧')])
        ])
      })
      setTimeout(() => {
        this.zIndex = getMaxIndex()
        this.showCall = true
      }, 500)
    },
    /**
     * 处理时间的格式
     */
    startTimePiece(bolean, obj) {
      const _this = this
      let hour, minute, second, hours, minutes, seconds
      if (obj) {
        hour = obj.hour
        minute = obj.minute
        second = obj.second
      } else {
        hour = minute = second = 0
      }
      hours = minutes = seconds = 0
      if (bolean) {
        const returnValue = '正在通话中,请勿刷页面'
        window.onbeforeunload = (event) => {
          Object.assign(event, {
            returnValue
          })
          return returnValue
        }
        _this.timer = setInterval(function() {
          if (second >= 0) {
            second = second + 1
            seconds = _this.addFix(second, 2)
            minutes = _this.addFix(minute, 2)
            hours = _this.addFix(hour, 2)
          }
          if (second >= 59) {
            second = 0
            minute = minute + 1
            minutes = _this.addFix(minute, 2)
          }
          if (minute >= 59) {
            minute = 0
            hour = hour + 1
            hours = _this.addFix(hour, 2)
          }
          if (hour >= 24) {
            hour = 0
          }
          _this.callinTimes = hours + ':' + minutes + ':' + seconds
          _this.$store.commit('CALL_STATUS', _this.callinTimes)
        }, 1000)
      } else {
        window.onbeforeunload = null
        clearInterval(_this.timer)
        this.$store.commit('CALL_STATUS', '00:00:00')
      }
    },
    addFix(num, length) {
      return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num
    },
    /**
     * 保存通话记录
     */
    saveRecord(data) {
      const temp = {
        // type: data.call_type,
        // state: data.connected_state,
        // starttime: data.start_time,
        // answertime: data.answer_time,
        // endtime: data.end_time,
        // number: data.number,
        // hangType: 0,
        // model: this.model,
        // modelId: this.modelId
        type: data.direction == 'incoming' ? 1 : 0,
        state: 2,
        starttime: data.time,
        answertime: data.begin,
        endtime: data.end,
        number: data.remote,
        hangType: 0,
        model: this.model,
        modelId: this.modelId
      }
      const requestHeaders = callCenter.requestHeaders
      const params = {
        entity: temp,
        header: requestHeaders
      }

      crmCallSaveAPI(params).then(res => {
        // 上传录音
        if (data.answer_time) {
          const url = `${WKConfig.getLocationOrigin()}/api/call/upload?id=${res.data.id}`
          callCenter.OnUploadFile(url, data.session_id)
        } else {
          const params = {}
          if (this.customerId) {
            params.customerId = this.customerId
          } else {
            return
          }
        }
      }).catch(() => {})
    },
    /** 创建呼叫中心的长链接 */
    callCenterConnect() {
      callCenter.open(() => {
        callCenter.OnGetCallState()
      }, () => {
        callCenter.close()
      })

      const callData = Lockr.get('wkCallData')
      if (callData && callData.hisUse == 1) {
        callCenter.message((data) => {
          this.callSoftMessage(data)
        })
      } else {
        callCenter.message((data) => {
          this.callHardwareMessage(data)
        })
      }
    },

    /**
     * 硬呼和软呼
     */
    callHardwareMessage(data) {
      console.log('回调状态', data)
      switch (data.event) {
        // 设备呼出
        case 'OutGoing': {
          // 刷新页面时,读取储存的信息
          const callOutData = JSON.parse(localStorage.getItem('callOutData'))
          if (callOutData) {
            this.modelData = {
              modelId: callOutData.id,
              model: callOutData.type
            }
          } else {
            this.modelData = {}
          }
          if (this.notify) {
            this.notify.close()
          }
          this.$store.commit('SHOW_RING', true)
          this.$store.commit('SHOW_CALL_OUT', true)
          this.$store.commit('SHOW_TIMER', true)
          this.rowID = callOutData.id
          this.crmType = callOutData.type
          this.$emit('sendMsg', this.modelData)
          break
        }
        // 振铃中
        case 'RingBack': {
          // 振铃时计时
          this.startTimePiece(false)
          this.$store.commit('SHOW_RING', true)
          this.$store.commit('SHOW_CALL_OUT', true)
          this.$store.commit('SHOW_TIMER', true)
          const newTime = new Date().getTime()
          localStorage.setItem('IntervalTime', newTime) // 通话计时器开始时间: 记录通话开始或者振铃开始的时间
          this.startTimePiece(true)
          break
        }
        // 来电呼入
        case 'InComing': {
          this.startTimePiece(false)
          // localStorage.setItem('callPhone', data.number)
          localStorage.setItem('callPhone', data.remote)
          this.isAnswer = true
          this.showHang = false
          this.startTimePiece(true)
          this.getMember(data.remote, 6)
          const newTime = new Date().getTime()
          localStorage.setItem('IntervalTime', newTime) // 通话计时器开始时间: 记录通话开始或者振铃开始的时间
          if (this.notify) {
            // 有弹框是关闭第一个弹框, 初始化控制弹框所有变量的数据
            this.notify.close()
          }
          break
        }

        case 'Answer': {
          // 从振铃中变为通话中, 开始计时,disable 接听按钮
          this.startTimePiece(false)
          const newTime = new Date().getTime()
          this.isAnswer = false
          // if (this.notify && data.call_data.type === 1) { // -1设备空闲 0呼出，1呼入
          if (this.notify && data.direction === 'incoming') { // -1设备空闲 0呼出，1呼入
            this.notify.close()
            this.incoming()
          }
          localStorage.setItem('IntervalTime', newTime) // 通话计时器开始时间: 记录通话开始或者振铃开始的时间
          this.$store.commit('SHOW_RING', false)
          this.ringShow = false
          this.startTimePiece(true)
          console.log('接通了')
          break
        }
        case 'HangUp':
          // 挂断电话
          this.startTimePiece(false)
          this.$store.commit('SHOW_TIMER', false)
          localStorage.removeItem('IntervalTime')
          this.showCall = false
          this.ringShow = true
          this.$store.commit('SHOW_RING', false)
          this.isAnswer = true
          if (this.notify) {
            this.notify.close()
            setTimeout(() => {
              this.incoming()
            }, 500)
          }
          this.showHang = true
          break

        case 'Idle':
          localStorage.setItem('callPhone', '')
          localStorage.removeItem('callOutData')
          localStorage.removeItem('IntervalTime')
          break

        case 'CallRecord':
          // this.saveRecord(data.data)
          this.saveRecord(data)
          // 保存通话记录
          break
          // 设备通话状态
        case 'CallState':
          switch (data.data.callState) {
            case 1:
              localStorage.setItem('callPhone', '') // 设备空闲时清空号码
              localStorage.removeItem('callOutData') // 清空呼出时保留的信息
              localStorage.removeItem('IntervalTime') // 清空时间
              break

            case 5: {
              // 已播出号码,正在呼出时: 刷新页面时,详情页面应该展示通话信息,如果不显示,无法挂断
              this.$store.commit('SHOW_CALL_OUT', true)
              this.refresh(5)
              break
            }
            case 6: {
              // 收到来电: 刷新页面时,来电弹框不能消失
              this.refresh(6)
              break
            }
            case 8: {
              // 已播出号码,对方正在振铃: 刷新页面时,详情页面应该展示通话信息,如果不显示,无法挂断
              this.$store.commit('SHOW_CALL_OUT', true)
              this.refresh(8)
              break
            }
            case 9: {
              // 已播出号码,正在接听: 刷新页面时,详情页面应该展示通话信息,如果不显示,无法挂断
              this.$store.commit('SHOW_CALL_OUT', true)
              this.refresh(9, data.call_data)
              break
            }
          }
          break

        case 'DeviceDiscon':
          console.log('设备已断开链接')
          break

        case 'Error':
          console.log('错误信息')
          break
        case 'UploadResponse':
          // if (data.data.code === 0) {
          //   this.$message.success('录音上传成功')
          // }
          break
      }
    },

    /**
     * 软呼信息
     * 设备呼出成功    ：2005
          设备挂断成功    :        2006

          振铃中变为通话中：2003
          客户挂断电话：2004

          来电呼入：2007

     */
    callSoftMessage(data) {
      console.log('callSoftMessage---', data)
      switch (data.cmd) {
        // 设备呼出
        case 2005: {
          // 刷新页面时,读取储存的信息
          const callOutData = JSON.parse(localStorage.getItem('callOutData'))
          if (callOutData) {
            this.modelData = {
              modelId: callOutData.id,
              model: callOutData.type
            }
          } else {
            this.modelData = {}
          }

          if (this.notify) {
            this.notify.close()
          }
          this.$store.commit('SHOW_RING', true)
          this.$store.commit('SHOW_CALL_OUT', true)
          this.$store.commit('SHOW_TIMER', true)
          this.rowID = callOutData.id
          this.crmType = callOutData.type
          this.$emit('sendMsg', this.modelData)
          break
        }
        // // 振铃中
        // case 'RingBack': {
        //   // 振铃时计时
        //   this.startTimePiece(false)
        //   this.$store.commit('SHOW_RING', true)
        //   this.$store.commit('SHOW_CALL_OUT', true)
        //   this.$store.commit('SHOW_TIMER', true)
        //   const newTime = new Date().getTime()
        //   localStorage.setItem('IntervalTime', newTime) // 通话计时器开始时间: 记录通话开始或者振铃开始的时间
        //   this.startTimePiece(true)
        //   break
        // }
        // 来电呼入
        case 2007: {
          this.isSoftCallIn = true
          this.startTimePiece(false)
          localStorage.setItem('callPhone', data.phone)
          this.isAnswer = true
          this.showHang = false
          this.startTimePiece(true)
          this.getMember(data.phone, 6)
          const newTime = new Date().getTime()
          localStorage.setItem('IntervalTime', newTime) // 通话计时器开始时间: 记录通话开始或者振铃开始的时间
          if (this.notify) {
            // 有弹框是关闭第一个弹框, 初始化控制弹框所有变量的数据
            this.notify.close()
          }
          break
        }

        case 2003: {
          // 从振铃中变为通话中, 开始计时,disable 接听按钮
          this.startTimePiece(false)
          const newTime = new Date().getTime()
          this.isAnswer = false
          if (this.notify && this.isSoftCallIn) {
            this.notify.close()
            this.incoming()
          }
          this.isSoftCallIn = false

          localStorage.setItem('IntervalTime', newTime) // 通话计时器开始时间: 记录通话开始或者振铃开始的时间
          this.$store.commit('SHOW_RING', false)
          this.ringShow = false
          this.startTimePiece(true)
          break
        }
        case 2004:
        case 2006:
          // 挂断电话 设备挂断成功    :        2006 客户挂断电话：2004
          this.startTimePiece(false)
          this.$store.commit('SHOW_TIMER', false)
          localStorage.removeItem('IntervalTime')
          this.showCall = false
          this.ringShow = true
          this.$store.commit('SHOW_RING', false)
          this.isAnswer = true
          if (this.notify) {
            this.notify.close()
            setTimeout(() => {
              this.incoming()
            }, 500)
          }
          this.showHang = true
          break

        // case 'Idle':
        //   localStorage.setItem('callPhone', '')
        //   localStorage.removeItem('callOutData')
        //   localStorage.removeItem('IntervalTime')
        //   break

        // case 'CallRecord':
        //   this.saveRecord(data.data)
        //   // 保存通话记录
        //   break
          // 设备通话状态
          // 主动获取话机状态：2010
        // 后台推送话机状态：2011
        case 500:
          this.$message.error(data.msg)
          break
        case 2011:
          switch (data.status) {
            case 'IDLE':
              if (this.notify) {
                // 有弹框是关闭第一个弹框, 初始化控制弹框所有变量的数据
                this.notify.close()
              }
              localStorage.setItem('callPhone', '') // 设备空闲时清空号码
              localStorage.removeItem('callOutData') // 清空呼出时保留的信息
              localStorage.removeItem('IntervalTime') // 清空时间
              break

            // case 5: {
            //   // 已播出号码,正在呼出时: 刷新页面时,详情页面应该展示通话信息,如果不显示,无法挂断
            //   this.$store.commit('SHOW_CALL_OUT', true)
            //   this.refresh(5)
            //   break
            // }
            // case 6: {
            //   // 收到来电: 刷新页面时,来电弹框不能消失
            //   this.refresh(6)
            //   break
            // }
            case 'RINGING': {
              // 已播出号码,对方正在振铃: 刷新页面时,详情页面应该展示通话信息,如果不显示,无法挂断
              this.$store.commit('SHOW_CALL_OUT', true)
              this.refresh(8)
              break
            }
            case 'CALL_OUT': {
              // 已播出号码,正在接听: 刷新页面时,详情页面应该展示通话信息,如果不显示,无法挂断
              this.$store.commit('SHOW_CALL_OUT', true)
              this.refresh(9, { type: 0 }) // -1设备空闲 0呼出，1呼入
              break
            }
            case 'CALL_IN': {
              // 已播出号码,正在接听: 刷新页面时,详情页面应该展示通话信息,如果不显示,无法挂断
              this.$store.commit('SHOW_CALL_OUT', true)
              this.refresh(9, { type: 1 })
              break
            }
          }
          break

        case 'DeviceDiscon':
          console.log('设备已断开链接')
          break

        case 'Error':
          console.log('错误信息')
          break
        case 'UploadResponse':
          // if (data.data.code === 0) {
          //   this.$message.success('录音上传成功')
          // }
          break
      }
    },
    /**
     *  刷新页面的处理逻辑
     */
    refresh(type, callType) {
      const phoneNumber = localStorage.getItem('callPhone')
      this.getMember(phoneNumber, type, callType)
    },
    /**
     *  处理刷新页面返回状态的逻辑
     */
    refreshStatus(type, callData) {
      const oldTime = localStorage.getItem('IntervalTime')
      let callOutData = localStorage.getItem('callOutData')
      callOutData = JSON.parse(callOutData)
      if (oldTime) {
        this.startTimePiece(false)
        const newTime = new Date().getTime()
        const callTime = (newTime - oldTime) / 1000
        const hour = Math.floor(callTime / 3600)
        const minute = Math.floor((callTime - hour * 3600) / 60)
        const second = Math.floor(callTime - hour * 3600 - minute * 60) + 1
        this.startTimePiece(true, { hour, minute, second })
      }
      switch (type) {
        // 已拨出号码,正在呼出,对方还未振铃,不显示振铃中
        case 5: {
          this.showCall = false
          this.showHang = false
          setTimeout(() => {
            // 展示详情
            this.rowID = callOutData.id
            this.crmType = callOutData.model
            this.modelData = {
              modelId: callOutData.id,
              model: callOutData.type
            }
            this.$emit('sendMsg', this.modelData)
            this.showDview = false
          }, 2000)
          break
        }
        // 振铃中
        case 8: {
          // 对方已振铃, 开启振铃计时
          // 展示详情

          if (!callOutData.incoming) {
            this.showCall = false
            this.showHang = false
          } else {
            this.$store.commit('SHOW_CALL_OUT', false)
            this.showHang = false
          }
          setTimeout(() => {
            // 有callOutData是呼出,没有是呼入

            if (!callOutData.incoming) {
              // 呼出
              this.rowID = callOutData.id
              this.crmType = callOutData.model
              this.showDview = false
              this.modelData = {
                modelId: callOutData.id,
                model: callOutData.type
              }
              this.$emit('sendMsg', this.modelData)
            } else {
              this.rowID = this.modelId
              this.crmType = this.model
              this.showDview = false
            }
            // 没有接通,不展示计时
            // 展示振铃中
            this.$store.commit('SHOW_RING', true)
          }, 2000)
          break
        }

        case 6:
          // 来电呼入
          this.$store.commit('SHOW_CALL_OUT', false)
          setTimeout(() => {
            this.isAnswer = true
            this.ringShow = true
            this.$store.commit('SHOW_RING', true)
            let data = {
              inComing: true, // 表示呼入
              id: this.modelId,
              type: this.model
            }
            data = JSON.stringify(data)
            localStorage.setItem('callOutData', data)
            this.incoming()
          }, 2000)
          break

        case 9: {
          // 从振铃中变为通话中, 开始计时,disable 接听按钮
          if (callData.type === 0) { // -1设备空闲 0呼出，1呼入
            this.showCall = false
            this.showHang = false
          }
          setTimeout(() => {
            if (callData.type === 0) {
              // 展示详情
              setTimeout(() => {
                // 呼出接通
                this.rowID = callOutData.id
                this.crmType = callOutData.model
                this.modelData = {
                  modelId: callOutData.id,
                  model: callOutData.type
                }
                this.$emit('sendMsg', this.modelData)
                this.showDview = false
                // 接通时,展示通话
                // 展示通话中
                this.$store.commit('SHOW_RING', false)
              }, 2000)
            } else if (callData.type === 1) {
              // 呼入接通
              this.isAnswer = false
              this.$store.commit('SHOW_CALL_OUT', false)
              this.$store.commit('SHOW_RING', false)
              this.incoming()
            }
          }, 0)
          break
        }
        case 15:
          // 挂断电话
          this.$store.commit('SHOW_TIMER', true)
          localStorage.removeItem('IntervalTime')
          this.startTimePiece(false)
          this.showHang = true
          break

        case 1:
          // 设备空闲时
          localStorage.setItem('callPhone', '') // 清空电话号码
          localStorage.removeItem('callOutData') // 清空呼出信息
          localStorage.removeItem('IntervalTime')// 清除储存的时间
          this.startTimePiece(false) // 关闭计时器,以保证全局只有一个计时器
          this.showHang = false // 设备空闲时不展示挂断
          break

        case 7:
          // 呼入接通已操作接通按钮,但未接通前的状态
          break
        case 0:
          this.$message.error('设备状态异常,不可用')
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .timePieces{
      width: 130px;
      padding: 5px;
      display: flex;
      position: fixed;
      bottom: 250px;
      right: 100px;
      margin-right: 10px;
      border-radius: 3px;
      color: white;
    }
    .timePiece{
      width: 130px;
      padding: 5px;
      display: flex;
      position: fixed;
      bottom: 250px;
      right: 100px;
      margin-right: 10px;
      background-color: #3e84e9;
      border-radius: 3px;
      color: white;
      .timePieceP1{
        width: 60px;
        line-height: 16px;
      }
      .timePieceP2{
        line-height: 16px;
      }
    }
    .timePiece1{
      width: 130px;
      padding: 5px;
      display: flex;
      position: fixed;
      bottom: 250px;
      right: 100px;
      margin-right: 10px;
      background-color: #E6A23C;
      border-radius: 3px;
      color: white;
      .timePieceP1{
        width: 60px;
        line-height: 16px;
      }
      .timePieceP2{
        line-height: 16px;
      }
    }
  .red-timePiece{
    padding: 5px;
    display: flex;
    position: fixed;
    bottom: 250px;
    margin-right: 10px;
    border-radius: 3px;
    color: white;
    width: 60px;
    right: 180px;
    background-color: #F56C6C;
  }
  .dropdown {
  border: 1px solid #e4e4e4;
  width: 100px;
  position: fixed;
  bottom: 80px;
  right: 50px;
  li {
      padding: 5px;
      cursor: pointer;
  }
  li:hover {
      color: #3e84e9;
  }
  /deep/ .el-card__body {
    padding: 0px;
  }
  }
</style>
