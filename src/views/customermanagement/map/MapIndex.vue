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
        <el-input v-model="place" class="el-input--width"/>
        <span class="place-text"> 米的客户</span>
      </flexbox>
      <flexbox align="stretch">
        <div class="map-content--left">
          <div>
            <ul>
              <li class="">1</li>
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
function myFun(result) {
  var map = new BMap.Map('choicemap', { enableMapClick: false })
  map.centerAndZoom(new BMap.Point(116.404, 39.915), 14)
  var cityName = result.name
  console.log(result, 'result==')
  map.setCenter(cityName)
  alert('当前定位城市:' + cityName)
}
function add_oval(centre, x, y) {
  var assemble = []
  var angle
  var dot
  var tangent = x / y
  for (let i = 0; i < 36; i++) {
    angle = (2 * Math.PI / 36) * i
    dot = new BMap.Point(centre.lng + Math.sin(angle) * y * tangent, centre.lat + Math.cos(angle) * y)
    assemble.push(dot)
  }
  return assemble
}
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
      point: '',
      place: '',
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
        this.addMarkerLabel(this.pointAddress)
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
      this.addMarkerLabel(item.point)
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
    // 创建标注
    addMarkerLabel(point) {
      this.map.clearOverlays()
      this.map.centerAndZoom(point, 14)
      this.map.addOverlay(new BMap.Marker(point))
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
    getMyFun() {
      var myCity = new BMap.LocalCity()
      myCity.get(myFun)
      var oval = new BMap.Polygon(add_oval(this.point, 0.1, 0.1), { strokeColor: 'blue', strokeWeight: 6, strokeOpacity: 0.5 })
      this.map.addOverlay(oval)
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
</style>
