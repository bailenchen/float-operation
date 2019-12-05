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
                @change="upLoad">
              <el-button
                type="text"
                icon="el-icon-plus"
                class="cross"/>
            </div>
            <div v-else class="detail-upload" @mouseleave="enterId = 0">
              <el-image
                :src="primaryUrl"
                class="content-cross"
                @mouseenter.native="enterId = 1"/>
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
              <el-image
                :src="detaiUrl"
                class="content-cross cross-two"
                @mouseenter.native="enterId = 2"/>
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
              show-word-limit
              type="textarea"
              @blur="saveIntroduce"/>
          </div>
        </div>
      </div>
    </sections>
  </div>

</template>

<script type="text/javascript">
import Sections from '../../components/Sections'
import {
  crmProductDetailImgSave,
  crmProductDetailImgQueryListByType,
  crmProductDetailImgDelete,
  crmProductDetailImgSaveImg
} from '@/api/customermanagement/product'

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
      type: 1,
      imgId: -1,
      loading: false
    }
  },
  watch: {
    id: function(val) {
      this.getImgData()
    }
  },
  mounted() {
    this.getImgData()
  },
  methods: {
    getImgData() {
      this.loading = true
      crmProductDetailImgQueryListByType({
        productId: this.id
      }).then(res => {
        const data = res.data
        this.primaryObj = data.mainImg || {}
        this.primaryUrl = this.primaryObj.filePath

        this.detailObj = data.detailImg || {}
        this.detaiUrl = this.detailObj.filePath
        this.productRemark = data.remarks
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
      crmProductDetailImgSave(params).then(res => {
        if (this.type === 1) {
          this.primaryObj = res.data
          this.primaryUrl = res.data.filePath
        } else {
          this.detaiObj = res.data
          this.detaiUrl = res.data.filePath
        }
        this.loading = false
        this.$message.success('上传图片成功')
      }).catch(() => {
        this.loading = false
      })
    },
    /** 删除图片 */
    deleteImg(index) {
      const params = {}
      if (index == 1) {
        params.imgId = this.primaryObj.imgId
      } else {
        params.imgId = this.detailObj.imgId
      }
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crmProductDetailImgDelete(params).then(res => {
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
        name = 'primary.jpg'
      } else {
        name = 'detail.jpg'
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
    /** 保存简介 */
    saveIntroduce() {
      this.loading = true
      crmProductDetailImgSaveImg({
        productId: this.id,
        remarks: this.productRemark }
      ).then(res => {
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
