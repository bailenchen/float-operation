<template>
  <div v-loading="loading" class="b-cont">
    <sections
      class="b-cells"
      title="产品信息"
      content-height="auto">
      <div class="detail-box">
        <div class="detail-item">
          <label class="detail-label"><span class="label-start">*</span> 产品主图</label>
          <div class="detail-upload">
            <div v-if="!primaryUrl" class="content-cross" @click="upLoadImg(1)">
              <input
                ref="primaryImgInput"
                accept="image/*"
                type="file"
                class="file-input"
                multiple
                @change="upLoad">
              <el-button
                type="text"
                icon="el-icon-plus"
                class="cross"/>
            </div>
            <div v-else class="detail-upload" @mouseleave="enterId = 0">
              <img
                v-src="primaryUrl"
                :key="primaryUrl"
                class="content-cross"
                @mouseenter="enterId = 1">
              <div
                v-if="enterId === 1"
                class="img-model"
                @mouseleave="enterId = 0">
                <i
                  class="el-icon-zoom-in set-img-zoom"
                  @click.stop="player(primaryUrl, 1)"/>
                <i
                  class="el-icon-delete set-img-delete"
                  @click.stop="deleteImg(1)"/>
              </div>
            </div>
            <div class="detail-tip">图片建议上传：290(宽) * 220(高) (应用于小图式)</div>
          </div>
        </div>
      </div>
      <div class="detail-box">
        <div class="detail-item">
          <label class="detail-label"><span class="label-start">*</span> 详情图片</label>
          <div class="detail-upload">
            <div v-if="!detaiUrl" class="content-cross cross-two" @click="upLoadImg(2)">
              <input
                ref="detailImgInput"
                accept="image/*"
                type="file"
                class="file-input"
                @change="upLoad">
              <el-button
                type="text"
                icon="el-icon-plus"
                class="cross"/>
            </div>
            <div v-else class="detail-upload" @mouseleave="enterId = 0">
              <img
                v-src="detaiUrl"
                :key="detaiUrl"
                class="content-cross cross-two"
                @mouseenter="enterId = 2">
              <!-- <el-image
                :src="detaiUrl"
                class="content-cross cross-two"
                @mouseenter.native="enterId = 2"/> -->
              <div
                v-if="enterId === 2"
                class="img-model cross-two--model"
                @mouseleave="enterId = 0">
                <i
                  class="el-icon-zoom-in set-img-zoom"
                  @click.stop="player(detaiUrl, 2)"/>
                <i
                  class="el-icon-delete set-img-delete"
                  @click.stop="deleteImg(2)"/>
              </div>
            </div>
            <div class="detail-tip">图片建议上传：750(宽) * 600(高) (应用于大图式)</div>
          </div>
        </div>
      </div>
      <div class="detail-box">
        <div class="detail-item">
          <label class="detail-label"><span class="label-start">*</span> 产品简介</label>
          <div class="detail-input">
            <el-input
              v-model="productRemark"
              :rows="5"
              :maxlength="1000"
              type="textarea"
              @blur="saveIntroduce"/>
            <div class="input-remark">{{ productRemark.length }} / 1000</div>
          </div>
        </div>
      </div>
    </sections>
  </div>

</template>

<script type="text/javascript">
'use strict'
import Sections from '../../components/Sections'
import {
  crmProductDetailImgQueryListByType,
  crmProductDetailImgSave
} from '@/api/customermanagement/product'
import { crmFileSave, crmFileDelete } from '@/api/common'
export default {
  components: {
    Sections
  },
  props: {
    id: {
      type: [String, Number],
      default: 0
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      productRemark: '',
      enterId: -1,
      primaryObj: {},
      detailObj: {},
      primaryUrl: '',
      detaiUrl: '',
      fileList: [],
      imgList: [],
      type: 1,
      imgId: -1,
      loading: false
    }
  },
  watch: {
    id() {
      this.getImglist()
    }
  },
  mounted() {
    this.getImglist()
  },
  methods: {
    getImglist() {
      this.loading = true
      crmProductDetailImgQueryListByType(
        { productId: this.id }
      ).then(res => {
        this.detailObj = res.data.detailFile
        this.detaiUrl = res.data.detailFile.filePath
        this.primaryObj = res.data.mainFile
        this.primaryUrl = res.data.mainFile.filePath
        this.productRemark = res.data.remarks
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    upLoadImg(index) {
      this.type = index
      if (index === 1) {
        this.$refs.primaryImgInput.click()
      } else {
        this.$refs.detailImgInput.click()
      }
    },
    upLoad(event) {
      const params = {
        file: event.target.files[0],
        type: this.type,
        productId: this.id
      }
      this.loading = true
      crmFileSave(params).then(res => {
        if (this.type === 1) {
          this.primaryObj = res
          this.primaryUrl = res.url
        } else {
          this.detailObj = res
          this.detaiUrl = res.url
        }
        this.saveIntroduce()
      }).catch(() => {
        this.loading = false
      })
    },
    /** 删除图片 */
    deleteImg(index) {
      const params = {}
      if (index == 1) {
        params.id = this.primaryObj.fileId
      } else {
        params.id = this.detailObj.fileId
      }
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crmFileDelete(params).then(res => {
          this.$message.success('删除成功')
          if (index == 1) {
            this.primaryUrl = ''
            this.primaryObj = {}
          } else {
            this.detaiUrl = ''
            this.detailObj = {}
          }
        }).catch(() => {})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /** 预览图片 */
    player(path, type) {
      let name = ''
      if (type === 1) {
        name = '产品主图.jpg'
      } else {
        name = '详情图片.jpg'
      }
      this.$bus.emit('preview-image-bus', {
        index: 0,
        data: [{
          url: path,
          src: path,
          name: name
        }]
      })
    },
    /** 保存详情 */
    saveIntroduce() {
      const params = {}
      if (this.detailObj.fileId) {
        params.detailFileId = this.detailObj.fileId
      }
      if (this.primaryObj.fileId) {
        params.mainFileId = this.primaryObj.fileId
      }
      params.productId = this.id
      params.remarks = this.productRemark
      crmProductDetailImgSave(params).then(res => {
        this.$message.success('操作成功')
        this.loading = false
      }).catch(res => {
        this.loading = false
      })
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
 .detail-box {
   .file-input {
     display: none;
   }
   .detail-item {
     display: flex;
   }
   .detail-label {
     font-weight: 500;
     margin-left: 20px;
     margin-top: 20px;
     font-size: 13px;
     .label-start {
       color: red;
     }
   }
   .detail-upload {
     position: relative;
     .close {
       color: #C1C1C1;
       position:absolute;
       top: 0px;
       right: 70px;
     }
   }
   .detail-tip {
     color: #C1C1C1;
     font-size: 12px;
     margin-left: 20px;
   }
   .img-model {
      position: absolute;
      z-index: 10;
      line-height: 108px;
      background-color: #2d3037;
      opacity: 0.8;
      width: 193px;
      height: 108px;
      border-radius: 6px;
      top: 1px;
      left: 21px;
      .set-img-delete{
          font-size: 20px;
          color: white;
          cursor: pointer;
    }
    .set-img-zoom {
       font-size: 20px;
       color: white;
       padding-left: calc(50% - 30px);
       cursor: pointer;
    }
   }
   .content-cross {
    width: 195px;
    height: 110px;
    margin: 20px;
    display: flex;
    cursor: pointer;
    border-radius: 6px;
    position: relative;
    text-align: center;
    border: 1px #c0ccda dashed;
    .cross {
      color: #606266;
      font-size: 20px;
      margin-left: calc(50% - 10px);
    }
  }
  .detail-input {
    margin: 20px;
    width: 400px;
    position: relative;
    .input-remark {
      position:absolute;
      color: #C1C1C1;
      font-size: 12px;
      bottom: 10px;
      right: 10px;
    }
  }
  .cross-two {
    height: 157px;
  }
   .cross-two--model {
    height: 155px;
    line-height: 155px;
  }
  /deep/.el-icon-zoom-in {
    margin-right: 10px;
  }
 }
</style>
