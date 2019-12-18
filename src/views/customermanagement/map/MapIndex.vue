<template>
  <div class="map-box">
    <div class="map-title">
      <flexbox class="map-title-content">
        <img
          src="@/assets/img/crm/customer.png"
          class="title-icon">
        附近的客户
      </flexbox>
    </div>
    <div v-loading="loading" class="map-content">
      <flexbox align="stretch" class="map-content--title">
        <flexbox-item :span="9">
          <div class="title--position">
            <span class="wk wk-position"/>
            <el-tooltip :content="address" class="item" effect="dark" placement="top-start">
              <span class="title--address">{{ address }}</span>
            </el-tooltip>
          </div>
          <el-button type="text" class="el-button--text" @click="changeAddressShow = true">重新选择地址</el-button>
          <span class="place-text">附近&nbsp;</span>
          <el-popover
            v-model="showTypePopover"
            :width="radiusSelectWidth"
            placement="bottom"
            popper-class="no-padding-popover"
            trigger="click">
            <div class="type-popper">
              <div class="type-content">
                <div
                  v-for="(item, index) in memterOptions"
                  :key="index"
                  :class="{ 'selected' : selectType.value == item.value && !showCustomContent}"
                  class="type-content-item"
                  @click="radiusChange(item)">
                  <div class="mark"/>{{ item.label }}
                </div>
                <div
                  :class="{ 'selected' : showCustomContent}"
                  class="type-content-item"
                  @click="showCustomContent = true">
                  <div class="mark"/>自定义
                </div>
              </div>
              <div
                v-if="showCustomContent"
                class="type-content-custom">
                <el-input v-model="mapData.radius"/>
                <el-button type="primary" @click="radiusChange(null)">确定</el-button>
              </div>
            </div>
            <el-input
              slot="reference"
              v-model="mapData.radius"
              :readonly="true"
              :style="{width: radiusSelectWidth + 'px'}"
              placeholder="请选择"
              class="type-select">
              <i
                slot="suffix"
                :class="['el-icon-arrow-up', { 'is-reverse' : showTypePopover}]"/>
            </el-input>
          </el-popover>
          <span class="place-text">&nbsp;米的客户</span>
        </flexbox-item>

        <div class="title--right">
          <label class="title-label">客户类型： </label>
          <el-select v-model="mapData.type" placeholder="请选择" @change="getMapInfo">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
      </flexbox>
      <flexbox align="stretch" class="box-content">
        <div
          v-empty="mapList"
          xs-empty-icon="none"
          class="map-content--left">
          <div id="map-scroll">
            <ul :style="{height: mapHeight + 'px'}">
              <li
                v-for="(item, index) in mapList"
                :key="index"
                :style="{backgroundColor: item.customerId === currentId ? '#f7f7f7' : ''}"
                class="map-info--box"
                @click="selectAddress(item)">
                <span class="wk wk-location"/>
                <div class="map-box--content">
                  <div class="map-info--name">
                    <el-tooltip :content="item.customerName" class="item" effect="dark" placement="top-start">
                      <div class="map-customer-name" @click.stop="checkCustomerDetail(item.customerId)">{{ item.customerName }}</div>
                    </el-tooltip>
                    <!-- <div :title="item.customerName" class="map-customer-name">{{ item.customerName }}</div> -->
                  </div>
                  <div class="map-info--content">负责人: {{ item.ownerUserName }}</div>
                  <div :title="item.detailAddress" class="map-info--content">{{ item.detailAddress }}</div>
                  <div class="map-info--content">距离选择地址: {{ item.distance / 1000 }} km</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <flexbox-item :style="{height: mapHeight + 'px'}" class="map-primity">
          <div
            id="choicemap"
            class="map"/>
        </flexbox-item>
      </flexbox>
    </div>
    <change-address
      :show="changeAddressShow"
      :value="centerPoint"
      @select="handleSelect"
      @close="changeAddressShow = false"/>
    <customer-detail
      v-if="showDview"
      :id="rowID"
      :no-listener-class="['map-customer-name']"
      class="d-view"
      @hide-view="showDview=false"/>
  </div>

</template>
<script type="text/javascript">
import { crmCrmCustomerNearbyCustomerAPI } from '@/api/customermanagement/map'

import CustomerDetail from '../customer/CustomerDetail'

import { getBaiduMap } from '@/utils'

export default {
  name: 'MapIndex', // 新建 客户位置
  components: {
    ChangeAddress: () => import('./ChangeAddress'),
    CustomerDetail
  },
  props: {},
  data() {
    return {
      map: null,
      radiusSelectWidth: 100,
      showTypePopover: false,
      showCustomContent: false,
      selectType: {},
      currentId: -1,
      // 选中的搜索
      changeAddressShow: false,
      address: '',
      mapList: [],
      markerArr: [],
      loading: true,
      circle: null,
      memterOptions: [
        {
          label: '1千米',
          value: '1000'
        },
        {
          label: '3千米',
          value: '3000'
        },
        {
          label: '5千米',
          value: '5000'
        },
        {
          label: '10千米',
          value: '10000'
        }
      ],
      // 定位图标
      centerPoint: {},
      // 储存搜索的数据
      mapData: {
        radius: '1000',
        type: ''
      },
      div: '',
      span: '',
      arrow: '',
      mapHeight: document.documentElement.clientHeight - 210, // 地图的高度
      typeOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 2,
          label: '客户'
        },
        {
          value: 9,
          label: '公海'
        }
      ],

      // 详情查看
      showDview: false,
      rowID: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    getBaiduMap()
      .then(() => {
        var map = new BMap.Map('choicemap')
        var point = new BMap.Point(116.404, 39.915)
        map.centerAndZoom(point, 14)
        map.enableScrollWheelZoom(true)
        this.map = map
        this.centerPoint = point
        this.getMyPosition()
      })
  },
  methods: {
    /**
     * 获取当前位置
     */
    getMyPosition() {
      var myCity = new BMap.LocalCity()
      myCity.get(this.getFirstPosition)
    },

    /**
     * 定位函数
    */
    getFirstPosition(result) {
      this.centerPoint = result.center
      this.address = result.name
      this.getMapInfo()
    },

    /**
     * 修改半径范围
     */
    radiusChange(item) {
      if (item) {
        this.mapData.radius = item.value
        this.selectType = item
        this.showCustomContent = false
      } else {
        this.showCustomContent = true
      }
      this.getMapInfo()
      this.showTypePopover = false
    },

    /**
     * 获取地图信息
     *  lng 经度
        lat 纬度
        type 用来确定模块，这个不确定，先传空
        radius 半径距离
        ownerUserId 负责人
     */
    getMapInfo() {
      this.loading = true
      this.map.clearOverlays()
      const params = { ...this.mapData }
      params.lat = this.centerPoint.lat
      params.lng = this.centerPoint.lng
      crmCrmCustomerNearbyCustomerAPI(params).then(res => {
        this.mapList = res.data
        this.addMarkerLabel()
        this.setCircle()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    /**
       * 选中
       * @param point 坐标点
       * @param height 信息窗口高度
       */
    selectAddress(item) {
      var div = document.getElementsByClassName(`marker--${item.customerId}`)[0]
      var divList = document.getElementsByClassName('map-marker--custom')
      for (let i = 0; i < divList.length; i++) {
        divList[i].style.backgroundColor = '#2362FB'
        divList[i].style.zIndex = BMap.Overlay.getZIndex(divList[i].lat)
      }
      div.style.backgroundColor = '#E6A23C'
      div.style.zIndex = '1000'
      this.address = item.detailAddress
      console.log(item.detailAddress)
      this.currentId = item.customerId // 用id做标识来改变li的背景色
      this.centerPoint = new BMap.Point(item.lng, item.lat)
      this.setCircle()
    },

    /**
     * 添加圆形覆盖物
    */
    setCircle() {
      if (this.circle) {
        this.removeOverlay(this.circle)
      }
      const Circle = new BMap.Circle(this.centerPoint, this.mapData.radius, {
        strokeColor: '#2362FB',
        fillColor: '#2362FB',
        strokeWeight: 2,
        fillOpacity: 0.05,
        strokeOpacity: 0.5,
        strokeStyle: 'solid'
      })
      Circle.setCenter(this.centerPoint)
      this.circle = Circle
      this.circle.type = 'circle'
      this.map.addOverlay(Circle)
      this.map.setCenter(this.centerPoint)
      this.map.panTo(this.centerPoint)
      this.map.setViewport(this.markerArr)
    },

    /**
     * 创建标注
     */
    addMarkerLabel() {
      this.markerArr = []
      let points = this.centerPoint
      this.mapList.forEach(item => {
        const Marker = new BMap.Overlay()
        Marker.initialize = (map) => {
          var div = this.div = document.createElement('div')
          var span = this.span = document.createElement('span')
          var img = document.createElement('img')
          img.src = require('@/assets/img/map_blue.png')
          img.className = 'map-marker_img'
          div.className = 'map-marker--custom ' + `marker--${item.customerId}`
          span.className = 'map-custom--text'
          div.appendChild(span)
          div.appendChild(img)
          div.style.position = 'absolute'
          div.style.zIndex = BMap.Overlay.getZIndex(this.centerPoint.lat)
          const BMaps = BMap
          div.style.color = 'white'
          div.style.padding = '2px'
          div.style.whiteSpace = 'nowrap'
          div.style.MozUserSelect = 'none'
          div.style.fontSize = '12px'
          span.innerHTML = item.customerName
          div.appendChild(span)
          var that = this
          points = new BMap.Point(item.lng, item.lat)
          var arrow = this.arrow = document.createElement('div')
          arrow.style.position = 'absolute'
          arrow.style.width = '11px'
          arrow.style.height = '10px'
          arrow.style.top = '22px'
          arrow.style.left = '10px'
          arrow.style.overflow = 'hidden'
          div.appendChild(arrow)
          div.onmouseover = function() {
            this.style.backgroundColor = '#E6A23C'
            this.style.zIndex = '10000'
            this.style.whiteSpace = 'normal'
            img.src = require('@/assets/img/map_yellow.png')
            arrow.style.backgroundPosition = '0px -20px'
          }

          div.onmouseout = function() {
            this.style.backgroundColor = '#2362FB'
            this.style.whiteSpace = 'nowrap'
            img.src = require('@/assets/img/map_blue.png')
            this.style.zIndex = BMaps.Overlay.getZIndex(points.lat)
            arrow.style.backgroundPosition = '0px 0px'
          }
          var child = item
          var scorllDiv = document.getElementsByClassName('map-content--left')[0]
          var mapScroll = document.getElementById('map-scroll')

          var ul = document.getElementsByTagName('ul')[0]
          mapScroll.onscroll = function(e) {
            console.log(e)
          }
          div.onclick = function(e) {
            for (let i = 0; i < that.mapList.length; i++) {
              if (child.customerId === that.mapList[i].customerId) {
                that.mapList.splice(i, 1)
                break
              }
            }
            that.mapList.unshift(child)
            that.address = child.detailAddress
            console.log(scorllDiv.scrollTop, '==')
            scorllDiv.scrollTop = 0
            mapScroll.scrollTop = 0
            ul.scrollTop = 0
            that.selectAddress(child)
          }
          this.map.getPanes().labelPane.appendChild(div)
          return div
        }
        Marker.draw = () => {
          console.log('2322')
          var pixel = this.map.pointToOverlayPixel(points)
          this.div.style.left = pixel.x - parseInt(this.arrow.style.left) + 'px'
          this.div.style.top = pixel.y - 30 + 'px'
        }
        this.markerArr.push(new BMap.Point(item.lng, item.lat))
        this.map.addOverlay(Marker)
      })
    },

    /**
     * 删除指定的覆盖物
    */
    removeOverlay(item) {
      // 获取所有的覆盖物
      var allOverlay = this.map.getOverlays()
      for (let i = 0; i < allOverlay.length; i++) {
        if (allOverlay[i].type == item.type) {
          this.map.removeOverlay(allOverlay[i])
        }
      }
    },

    /**
     * 回调选中
    */
    handleSelect(data) {
      this.centerPoint = data.point
      this.address = data.address + data.title
      this.getMapInfo()
    },

    /**
     * 查看客户详情
     */
    checkCustomerDetail(customerId) {
      this.rowID = customerId
      this.showDview = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.map-box {
  width: 100%;
  overflow-x: auto;
  height: auto;
}
.map-content {
  min-width: 900px;
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  border-radius: 2px;
  padding-bottom: 5px;
}
.map-primity {
  height: 100%;
  margin-right: 25px;
  .map {
     height:100%;
     width: 100%;
     overflow: hidden;
}
}
.map-content--title {
  position: relative;
  border-bottom: 1px solid #e6e6e6;
  font-size: 13px;
  line-height: 50px;
  padding: 0 10px;
  width: 100%;
  .title--position {
    display: inline-block;
    /deep/.wk-position {
      color: #2362FB;
      display: inline-block;
      vertical-align: top;
      font-size: 20px;
    }
  }
  .title--address {
    width: 150px;
    display: inline-block;
    font-size: 13px;
    vertical-align: bottom;
    color: #333;
    padding-left: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title--right {
    flex-shrink: 0;
    position: absolute;
    right: 18px;
    width: 260px;
    .title-label {
      font-size: 13px;
    }
  }
  .el-button--text {
    color: #2362FB;
    font-size: 12px;
    margin: 0 37px 0 16px;
  }
  .el-input--width {
    width: 80px;
    margin: 0 10px;
  }
  .place-text {
    color: #333;
  }
}
.map-content--left {
  flex-shrink: 0;
  width: 300px;
  height: 100%;
  ul {
    overflow-y: auto;
  }
}

.map-title {
  height: 60px;
  position: relative;
  z-index: 100;
  .map-title-content {
    float: left;
    width: auto;
    padding-left: 28px;
    font-size: 16px;
    margin-top: 15px;
    .title-icon {
      width: 30px;
      height: 30px;
      margin-right: 10px;
  }
  }
}
.box-content {
  margin-top: 5px;
}
.area-title {
  font-size: 12px;
  color: #aaa;
  padding-left: 10px;
}

.distpicker-address-wrapper /deep/ select {
  height: 34px;
  font-size: 12px;
  border-radius: 0.1rem;
}
/deep/.map-info--box:hover {
  background-color: #F7F7F7 !important;
}
/deep/.map-info--box {
  width: 100%;
  height: auto;
  display: flex;
  padding: 15px 10px 0px 12px;
  cursor: pointer;
  .map-box--content {
    height: 100%;
    width: 230px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e4e4;
  }
  .wk-location {
    color: red;
    display: inline-block;
    margin-right: 10px;
    font-size: 20px;
      }
/deep/.map-info--name {
      width: 100%;
      display: flex;
      font-size: 14px;
      padding-bottom: 10px;
      position: relative;
      color: #2362FB;
      .map-customer-name {
         width: 260px;
         margin-top: 4px;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
      }
      .fun-count {
        position: absolute;
        left: 2px;
        top: 1px;
        color: red;
        font-size: 10px;
        transform: scale(0.5);
      }
  }
  .map-info--content {
     font-size: 13px;
     width: 240px;
     overflow: hidden;
     padding-bottom: 6px;
     white-space: nowrap;
     text-overflow: ellipsis;
     color: #333;
  }
}
  .map--top {
    margin-top: 15px;
  }
  /deep/ .map-window--name {
    display: flex;
    color: #2362FB;
    padding-bottom: 10px;
    /deep/.info--name {
         width: 260px;
         line-height: 14px;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
      }
  }
  /deep/ .map-window--img {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }
  /deep/ .map-window--content{
     font-size: 12px;
     padding: 0px 10px 8px 0px;
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
     color: #333;
  }
  /deep/.map-marker--custom {
    background-color: #2362FB;
    width: 180px;
    height: 30px;
    border-radius: 6px;
    line-height: 30px;
    font-size: 12px;
    padding-bottom: 10px;
    text-align: center;
    opacity: 0.95;
    position: relative;
    .map-custom--text {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .map-marker_img {
       position: absolute;
       top: 30px;
       left: 81px;
       }
    .map-custom--pover {
      position: absolute;
      bottom: -23px;
      font-size: 14px;
      color: #2362FB;
      opacity: 0.8;
    }
  }
  .optionCustom {
    width: 100%;
    .el-button--text {
       color: #666;
    }
  }
   /deep/.el-select-dropdown__item {
      background-color: #fff !important;
    }
  .optionCustom:hover {
    .el-button--text {
       color: #2362FB;
    }
    background-color: #F5F7FA;
  }
  .type-popper {
  .type-content {
    max-height: 250px;
    overflow-y: auto;
    .type-content-item {
      height: 34px;
      line-height: 34px;
      padding: 0 20px;
      color: #606266;
      position: relative;
      cursor: pointer;
      /deep/.el-input {
        margin-bottom: 5px;
      }
      .mark {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: $xr-border-radius-base;
        margin-right: 5px;
        background-color: transparent;
      }
    }

    .selected {
      color: #409eff;
      font-weight: 700;
      .mark {
        background-color: #409eff;
      }
    }
    .type-content-item:hover {
      background-color: #f5f7fa;
    }
  }

  .type-content-custom {
    padding: 5px 20px 10px;
    position: relative;
    overflow: hidden;
    .el-date-editor {
      width: 100%;
      margin-bottom: 8px;
    }

    button {
      margin-top: 5px;
      float: right;
    }
  }
}
.el-icon-arrow-up {
  position: absolute;
  top: 18px;
  right: 5px;
  color: #c0c4cc;
  font-size: 14px;
  transition: transform .3s;
  transform: rotate(180deg);
  cursor: pointer;
}
.el-icon-arrow-up.is-reverse {
  transform: rotate(0deg);
}

.d-view {
  position: fixed;
  min-width: 926px;
  width: 75%;
  top: 60px;
  bottom: 0px;
  right: 0px;
}
</style>
