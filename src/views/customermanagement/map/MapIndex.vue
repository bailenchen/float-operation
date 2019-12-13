<template>
  <div class="map-box">
    <div class="map-title">
      <flexbox class="map-title-content">
        <img
          :src="titleIcon"
          class="title-icon">
        附近的客户
      </flexbox>
    </div>
    <div class="map-content" >
      <flexbox align="stretch" class="map-content--title">
        <el-select v-model="searchSelect" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-button type="text" class="el-button--text">选择地址</el-button>
        <span class="place-text">附近</span>
        <el-input v-model="mapData.radius" class="el-input--width" @blur="getMapInfo"/>
        <span class="place-text"> 米的客户</span>
      </flexbox>
      <flexbox align="stretch">
        <div class="map-content--left">
          <div>
            <ul>
              <li
                v-for="(item, index) in mapList"
                :key="index"
                :class="index > 0 ? 'map--top' : ''"
                class="map-info--box"
                @click="selectAddress(item)">
                <div class="map-info--name">
                  <img :src="funImg" alt="">
                  <span class="fun-count">{{ index + 1 }}</span>
                  <div :title="item.customerName" class="info-name">{{ item.customerName }}</div>
                </div>
                <div class="map-info--content">负责人: {{ item.ownerUserName }}</div>
                <div :title="item.detailAddress" class="map-info--content">{{ item.detailAddress }}</div>
                <div class="map-info--content">距离选择地址: {{ item.distance / 1000 }} km</div>
              </li>
            </ul>
          </div>
        </div>
        <flexbox-item :style="{height: mapHeight + 'px'}" class="map-primity">
          <!-- <el-autocomplete
        v-model="searchInput"
        :fetch-suggestions="querySearchAsync"
        style="width: 100%;"
        placeholder="请输入详细位置名称"
        @blur="inputBlur"
        @focus="inputFocus"
        @select="handleSelect">
        <template slot-scope="{ item }">
          <div class="name">{{ item.address + item.title }}</div>
        </template>
      </el-autocomplete> -->
          <div
            id="choicemap"
            class="map"/>
        </flexbox-item>
      </flexbox>
    </div>
  </div>

</template>
<script type="text/javascript">
import VDistpicker from 'v-distpicker'
import { crmCrmCustomerNearbyCustomerAPI } from '@/api/customermanagement/map'
export default {
  name: 'MapIndex', // 新建 客户位置
  components: {
    VDistpicker
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /** 索引值 用于更新数据 */
    index: Number,
    /** 包含数据源 */
    item: Object
  },
  data() {
    return {
      map: null,
      /** 搜索地图输入框 */
      searchInput: 1,
      // 选中的搜索
      searchSelect: '',
      mapList: [],
      markerArr: [],
      // 定位图标
      funImg: require('@/assets/img/fun.png'),
      customerImg: require('@/assets/img/customer_active.png'),
      point: '',
      // 储存搜索的数据
      mapData: {
        radius: '1000',
        type: ''
      },
      place: '1000',
      div: '',
      span: '',
      arrow: '',
      mapHeight: document.documentElement.clientHeight - 240, // 地图的高度
      options: [
        {
          value: 1,
          label: '全部'
        }
      ],
      searchCopyInput: '', // 避免修改
      /** 完整地址输入框 */
      detailAddress: '',
      pointAddress: null, // 经纬度点
      /** 区域选择 */
      addressSelect: {
        province: '',
        city: '',
        area: ''
      },
      /** 防止联动情况  */
      canExecute: true
    }
  },
  computed: {
    titleIcon() {
      return require(`@/assets/img/crm/customer.png`)
    }
  },
  watch: {
    pointAddress: function(newValue) {
      this.valueChange()
    },
    detailAddress: function(newValue) {
      this.valueChange()
    }
  },
  mounted() {
    var map = new BMap.Map('choicemap', { enableMapClick: true })
    var point = new BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, 14)
    this.map = map
    this.point = point
    this.getMyPosition()
    // map.disableDragging() //禁止拖拽
    // map.disableDoubleClickZoom()
    // map.disableScrollWheelZoom()
    // map.disableContinuousZoom()
  },
  methods: {
    initInfo(val) {
      this.searchInput = val.location
      this.detailAddress = val.detailAddress
      if (val.lng != 0 && val.lat != 0) {
        this.pointAddress = new BMap.Point(val.lng, val.lat)
      }
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        var options = {
          onSearchComplete: function(results) {
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
              var address = []
              for (var i = 0; i < results.getCurrentNumPois(); i++) {
                address.push(results.getPoi(i))
              }
              cb(address)
            } else {
              cb([])
            }
          },
          pageCapacity: 20
        }
        var local = new BMap.LocalSearch(this.map, options)
        local.search(queryString)
      } else {
        cb([])
      }
    },
    /** 搜索结果选择 */
    handleSelect(item) {
      this.searchInput = item.address + item.title
      this.searchCopyInput = this.searchInput // 只能通过这种方式修改

      this.detailAddress = this.searchInput
      this.pointAddress = item.point
      this.mapSelectArea(item)
    },
    /** Input 失去焦点  searchInput 只能通过选择更改*/
    inputBlur() {
      if (this.searchCopyInput !== this.searchInput) {
        this.searchInput = this.searchCopyInput
      }
    },
    inputFocus() {
      this.searchCopyInput = this.searchInput
    },
    // 创建标注 addMarkerLabel
    addMarkerLabel() {
      this.markerArr = []
      const that = this
      this.mapList.forEach(item => {
        const Marker = new BMap.Overlay()
        this.selectAddress(item)
        Marker.initialize = (map) => {
          var div = this.div = document.createElement('div')
          div.style.position = 'absolute'
          div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
          div.style.backgroundColor = '#EE5D5B'
          div.style.border = '1px solid #BC3B3A'
          div.style.color = 'white'
          div.style.height = '18px'
          div.style.padding = '2px'
          div.style.lineHeight = '18px'
          div.style.whiteSpace = 'nowrap'
          div.style.MozUserSelect = 'none'
          div.style.fontSize = '12px'
          var span = document.createElement('span')
          div.appendChild(span)
          span.appendChild(document.createTextNode(item.customerName))
          var that = this
          var arrow = this.arrow = document.createElement('div')
          arrow.style.position = 'absolute'
          arrow.style.width = '11px'
          arrow.style.height = '10px'
          arrow.style.top = '22px'
          arrow.style.left = '10px'
          arrow.style.overflow = 'hidden'
          div.appendChild(arrow)
          div.onmouseover = function() {
            that.style.backgroundColor = '#6BADCA'
            that.style.borderColor = '#0000ff'
            that.getElementsByTagName('span')[0].innerHTML = item.customerName + '111'
            arrow.style.backgroundPosition = '0px -20px'
          }

          div.onmouseout = function() {
            that.style.backgroundColor = '#EE5D5B'
            that.style.borderColor = '#BC3B3A'
            that.getElementsByTagName('span')[0].innerHTML = item.customerName
            arrow.style.backgroundPosition = '0px 0px'
          }

          this.map.getPanes().labelPane.appendChild(div)

          return div
        }
        Marker.draw = () => {
          var pixel = this.map.pointToOverlayPixel(this.point)
          this.div.style.left = pixel.x - parseInt(this.arrow.style.left) + 'px'
          this.div.style.top = pixel.y - 30 + 'px'
        }
        this.markerArr.push(new BMap.Point(item.lng, item.lat))
        this.map.addOverlay(Marker)
        Marker.addEventListener('click', function(e) {
          console.log('marker click: ', e)

          // 取上一个信息窗口的高度，重新绘制信息窗口
          const contentDOM = document.getElementsByClassName('BMap_bubble_content')
          // 高度默认 78px
          let height = 78
          if (contentDOM.length > 0) {
            height = contentDOM[0].clientHeight - 15
          }

          that.selectAddress(item, height)

          // 延时等待信息窗口渲染完成
          setTimeout(() => {
            const children = document.getElementsByClassName('BMap_pop')[0].children
            // 隐藏关闭按钮
            const divArr = []
            for (let i = 0; i < children.length; i++) {
              if (children[i].localName === 'img') {
                children[i].style.display = 'none'
              } else if (children[i].localName === 'div') {
                divArr.push(children[i])
              }
            }
            // 去掉默认边框颜色
            for (let j = 0; j < divArr.length; j++) {
              const firstChild = divArr[j].firstChild || null
              if (firstChild && firstChild.localName === 'div') {
                firstChild.style.borderColor = '#fff'
              }
            }
          }, 200)
        })
      })
    },
    /** 地图选择区域 */
    mapSelectArea(data) {
      if (this.canExecute) {
        this.canExecute = false
        // this.addressSelect.province = data.province ? data.province : "";
        // this.addressSelect.city = data.city ? data.city : "";
        /** 因为poi里面不包含区域 所以需要逆地址解析 */
        var myGeo = new BMap.Geocoder()
        // 根据坐标得到地址描述
        var self = this
        myGeo.getLocation(
          new BMap.Point(data.point.lng, data.point.lat),
          function(result) {
            if (result) {
              // 获取经纬度点
              self.pointAddress = result.point
              self.addressSelect.province = result.addressComponents.province
                ? result.addressComponents.province
                : ''
              self.addressSelect.city = result.addressComponents.city
                ? result.addressComponents.city
                : ''
              self.addressSelect.area = result.addressComponents.district
                ? result.addressComponents.district
                : ''
            }
          }
        )

        setTimeout(() => {
          self.canExecute = true
        }, 500)
      }
    },
    // 获取定位
    getMyPosition() {
      var myCity = new BMap.LocalCity()
      myCity.get(this.getFirstPosition)
    },
    /**
     * 定位函数
    */
    getFirstPosition(result) {
      // Circle.setCenter(result.center.lng, result.center.lat)
      // Circle.setRadius(1000)
      // Circle.setStrokeColor()
      // Circle.setFillColor('#2362FB')
      // Circle.setStrokeOpacity(0.8)
      // Circle.setStrokeWeight(2)
      // Circle.setStrokeStyle('solid')
      // Circle.disableMassClear()
      // alert('当前定位城市:' + cityName)
      this.point = new BMap.Point(result.center.lng, result.center.lat)
      this.mapData.lng = result.center.lng
      this.mapData.lat = result.center.lat
      this.getMapInfo()
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
      this.map.clearOverlays()
      crmCrmCustomerNearbyCustomerAPI(this.mapData).then(res => {
        this.mapList = res.data
        this.addMarkerLabel()
        this.setCircle(this.mapData)
      }).catch(() => {})
    },

    /**
       * 打开信息窗口
       * @param point 坐标点
       * @param height 信息窗口高度
       */
    selectAddress(item, height) {
      const point = new BMap.Point(item.lng, item.lat)
      const that = this
      const opts = {
        width: 200, // 信息窗口宽度
        height: 80, // 信息窗口高度
        title: '' // 信息窗口标题
      }
      // const ttt = Math.random()
      window.appNavMap = function() {
      // console.log('nav map', ttt)
        that.$emit('sheet', 55)
      }

      // 内容模版
      const tpl = '<div class="map-window--name">' +
      ` <img src="${this.customerImg}" alt='' class="map-window--img"/>` +
      `  <div :title="item.customerName" class="info--name">${item.customerName}</div>` +
      '</div>' + `<div class="map-window--content">负责人: ${item.ownerUserName}</div>` +
      ` <div :title="item.detailAddress" class="map-window--content">${item.detailAddress}</div>` +
      ` <div class="map-window--content">距离选择地址: ${item.distance / 1000} km</div>`

      // console.log('opts', opts)

      const infoWindow = new BMap.InfoWindow(tpl, opts) // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
    },
    /** 添加圆形覆盖物 */
    setCircle() {
      const Circle = new BMap.Circle(this.point, this.place, {
        strokeColor: '#2362FB',
        fillColor: '#2362FB',
        strokeWeight: 2,
        fillOpacity: 0.2,
        strokeOpacity: 0.5,
        strokeStyle: 'solid'
      })
      this.map.addOverlay(Circle)
      this.map.setCenter(this.point)
      this.map.panTo(this.point)
      this.map.setViewport(this.markerArr)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.map-box {
  height: calc(100% - 95px);
}
.map-primity {
  height: 100%;
  margin-right: 25px;
  .map {
     height:100%;
     width: 100%;
     overflow: hidden;
     margin-top: 5px;
}
}
.map-content--title {
  line-height: 35px;
  width: 100%;
  padding: 10px 15px;
  .el-button--text {
    color: #2362FB;
    font-size: 12px;
    font-weight: 500;
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
  overflow-y: auto;
  ul {
    height: 700px;
    overflow-y: auto;
  }
}
.map-content {
  width: 100%;
  height: 100%;
  margin: 10.5px 0px;
  background-color: #fff;
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
    font-weight: 600;
    margin-top: 15px;
    .title-icon {
      width: 30px;
      height: 30px;
      margin-right: 10px;
  }
  }
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
/deep/.map-info--box {
  width: 280px;
  height: auto;
  margin-left: 6px;
  margin-top: 5px;
  font-family: MicrosoftYaHei;
  border-bottom: 1px solid #e4e4e4;
  cursor: pointer;
/deep/.map-info--name {
      width: 100%;
      display: flex;
      font-size: 15px;
      letter-spacing:1px;
      padding-bottom: 15px;
      font-weight: 600;
      position: relative;
      color: #2362FB;
      .info-name {
         width: 260px;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
      }
      img {
        width: 12px;
        margin-right: 5px;
      }
      .fun-count {
        position: absolute;
        left: 2px;
        top: 1px;
        color: red;
        font-size: 10px;
        transform: scale(0.5);
        font-weight: 100;
      }
  }
  .map-info--content {
     font-size: 14px;
     letter-spacing:1px;
     padding: 0px 10px 8px 19px;
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
     font-weight: 600;
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
         font-weight: 600;
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
     letter-spacing:1px;
     padding: 0px 10px 8px 0px;
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
     font-weight: 500;
     color: #333;
  }
  /deep/.BMap_pop .BMap_center {
    width: 252px !important;
    border: none;
  }
  /deep/ .BMap_pop .BMap_top {
    border: none;
  }
  /deep/ .BMap_pop .BMap_bottom {
     border: none;
     height: 25px !important;
  }
</style>
