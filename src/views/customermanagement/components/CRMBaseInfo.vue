<template>
  <div class="b-cont">
    <div>
      <sections
        class="b-cells"
        title="基本信息"
        content-height="auto">
        <flexbox
          :gutter="0"
          align="stretch"
          wrap="wrap"
          style="padding: 10px 8px 0;">
          <flexbox-item
            v-for="(item, index) in list"
            :span="getShowBlock(item.formType) ? 12 : 0.5"
            :key="index"
            :class="{'b-cell': item.formType !== 'map_address'}">
            <flexbox
              v-if="item.formType === 'map_address'"
              :gutter="0"
              wrap="wrap">
              <flexbox-item
                :span="0.5"
                class="b-cell"
                @click.native="checkMapView(item)">
                <flexbox
                  class="b-cell-b"
                  align="stretch">
                  <div class="b-cell-name">定位</div>
                  <div
                    class="b-cell-value"
                    style="color: #3E84E9;cursor: pointer;">{{ item.value.location }}</div>
                </flexbox>
              </flexbox-item>
              <flexbox-item
                :span="0.5"
                class="b-cell">
                <flexbox
                  class="b-cell-b"
                  align="stretch">
                  <div class="b-cell-name">区域</div>
                  <div class="b-cell-value">{{ item.value.address }}</div>
                </flexbox>
              </flexbox-item>
              <flexbox-item
                :span="0.5"
                class="b-cell">
                <flexbox
                  class="b-cell-b"
                  align="stretch">
                  <div class="b-cell-name">详细地址</div>
                  <div class="b-cell-value">{{ item.value.detailAddress }}</div>
                </flexbox>
              </flexbox-item>
            </flexbox>

            <flexbox
              v-else-if="item.formType === 'customer' || item.formType === 'business' || item.formType === 'contract' || item.formType === 'contacts'"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">{{ getModuleName(item) }}
              </div>
            </flexbox>

            <flexbox
              v-else-if="item.formType === 'checkbox' || item.formType === 'structure' || item.formType === 'user'"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">
                <flexbox
                  :gutter="0"
                  wrap="wrap"
                  style="padding: 0px 10px 10px 0px;">
                  <div>{{ item.value | arrayValue(getArrayKey(item.formType)) }}</div>
                </flexbox>
              </div>
            </flexbox>

            <flexbox
              v-else-if="item.formType === 'file'"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">
                <file-list-view :list="item.value || []" />
              </div>
            </flexbox>

            <flexbox
              v-else
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">{{ item.value }}</div>
            </flexbox>
          </flexbox-item>
        </flexbox>
      </sections>
    </div>
    <map-view
      v-if="showMapView"
      :title="mapViewInfo.title"
      :lat="mapViewInfo.lat"
      :lng="mapViewInfo.lng"
      @hidden="showMapView=false" />
  </div>
</template>

<script>
import loading from '../mixins/loading'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import Sections from '../components/Sections'
import { filedGetInformation } from '@/api/customermanagement/common'
import MapView from '@/components/MapView' // 地图详情
import FileListView from '@/components/FileListView'

export default {
  // 客户管理 的 基本信息
  name: 'CRMBaseInfo',
  components: {
    Sections,
    MapView,
    FileListView
  },
  filters: {
    arrayValue(array, field) {
      if (
        !array ||
        Object.prototype.toString.call(array) !== '[object Array]'
      ) {
        return ''
      }

      return array
        .map(item => {
          return field ? item[field] : item
        })
        .join('，')
    }
  },
  mixins: [loading],
  props: {
    // 模块ID
    id: [String, Number],
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 没有值就是全部类型 有值就是当个类型
    crmType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      // 控制展示地图详情
      showMapView: false,
      // 地图详情信息
      mapViewInfo: {}
    }
  },
  computed: {},
  watch: {
    id: function(val) {
      this.getBaseInfo()
    }
  },
  mounted() {
    this.getBaseInfo()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    /**
     * 获取基础信息
     */
    getBaseInfo() {
      this.loading = true
      filedGetInformation({
        types: crmTypeModel[this.crmType],
        id: this.id
      })
        .then(res => {
          this.list = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 查看地图详情
     */
    checkMapView(item) {
      if (item.value && item.value !== '') {
        this.mapViewInfo = {
          title: item.value.location,
          lat: item.value.lat,
          lng: item.value.lng
        }
        this.showMapView = true
      }
    },

    getArrayKey(type) {
      if (type === 'structure') {
        return 'name'
      } else if (type === 'user') {
        return 'realname'
      }

      return ''
    },

    getShowBlock(type) {
      return ['map_address', 'file'].includes(type)
    },

    getModuleName(item) {
      const field = {
        customer: 'customerName',
        business: 'businessName',
        contract: 'contractNum',
        contacts: 'contactsName'
      }[item.formType]
      return item.value ? item.value[field] : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.b-cont {
  position: relative;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
  overflow-y: overlay;
}

.b-cells {
  margin-top: 25px;
}

.b-cell {
  padding: 0 10px;
}

.b-cell-b {
  width: auto;
  padding: 8px;
  .b-cell-name {
    width: 100px;
    margin-right: 10px;
    font-size: 13px;
    flex-shrink: 0;
    color: #777;
  }
  .b-cell-value {
    font-size: 13px;
    color: #333;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
  .b-cell-foot {
    flex-shrink: 0;
    display: block;
    width: 15px;
    height: 15px;
    margin-left: 8px;
  }
}

.f-item {
  padding: 3px 0;
  height: 25px;
  .f-img {
    position: block;
    width: 15px;
    height: 15px;
    padding: 0 1px;
    margin-right: 8px;
  }
  .f-name {
    color: #666;
    font-size: 12px;
    margin-right: 10px;
  }
}

</style>
