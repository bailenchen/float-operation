<template>
  <div v-loading="loading" class="b-cont">
    <div class="detail-box">
      <div class="detail-item">
        <label class="detail-label"><span class="label-start">*</span> 活动主图</label>
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
          <div class="detail-select--text">选择默认活动图片</div>
          <flexbox>
            <img
              v-for="(src, index) in srcList"
              :key="index"
              :src="src"
              :class="index === 0 ? 'content-cross-list--one' : ''"
              class="content-cross-list"
              alt="加载失败" @click="selectImg(src)">
          </flexbox>
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
  </div>

</template>

<script type="text/javascript">
import { crmFileSave, crmFileDelete } from '@/api/common'
import { filePathToBlob } from '@/utils'

export default {
  name: 'DetailImg',
  components: {},
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      enterId: -1,
      primaryObj: null,
      detailObj: null,
      primaryUrl: '',
      detaiUrl: '',
      type: 1,
      imgId: -1,
      srcList: [
        require('@/assets/activity/activity_one.jpg'),
        require('@/assets/activity/activity_two.jpg'),
        require('@/assets/activity/activity_three.jpg'),
        require('@/assets/activity/activity_four.jpg'),
        require('@/assets/activity/activity_five.jpg'),
        require('@/assets/activity/activity_six.jpg')
      ],
      loading: false
    }
  },
  watch: {
    detail: {
      handler(data) {
        if (data) {
          this.primaryObj = data.mainFile
          this.primaryUrl = this.primaryObj ? this.primaryObj.filePath : ''

          this.detailObj = data.detailFile
          this.detaiUrl = this.detailObj ? this.detailObj.filePath : ''
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    upLoadImg(index) {
      this.type = index
      if (index === 1) {
        this.$refs.primaryImgInput.click()
      } else {
        this.$refs.detailImgInput.click()
      }
    },

    /**
     * 处理选择的图片
     */
    selectImg(url) {
      filePathToBlob(url).then(blob => {
        var type = url.split('.').slice(-1) || 'png'
        var name = url.split('/').slice(-1)
        const file = new File([blob], name, { type: `image/${type}` })
        var even = {
          target: {
            files: [file]
          }
        }
        this.upLoad(even)
      })
    },

    /**
     * 上传
     */
    upLoad(event) {
      this.loading = true
      crmFileSave({ file: event.target.files[0] }).then(res => {
        res.filePath = res.url
        if (this.type === 1) {
          this.primaryObj = res
          this.primaryUrl = res.url
          this.loading = false
          this.$emit('change', 'mainFile', this.primaryObj)
        } else {
          this.detaiObj = res
          this.detaiUrl = res.url
          this.loading = false
          this.$emit('change', 'detailFile', this.detaiObj)
        }
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 删除图片
     */
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
            this.primaryObj = null
            this.$emit('change', 'mainFile', null)
            this.$emit('delete', 'mainFile')
          } else {
            this.detaiUrl = ''
            this.detailObj = null
            this.$emit('change', 'detailFile', null)
            this.$emit('delete', 'detailFile')
          }
        }).catch(() => {})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /**
     * 预览图片
     */
    player(path, type) {
      let name = ''
      if (type === 1) {
        name = '活动主图.jpg'
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
    }
  }
}
</script>

<style lang="scss" scoped>
.b-cont {
    position: relative;
}

.detail-box {
    .file-input {
        display: none;
    }
    .detail-item {
        margin-top: 8px;
    }
    .detail-label {
        font-weight: 500;
        margin-left: 20px;
        margin-top: 20px;
        word-break: keep-all;
        white-space: nowrap;
        font-size: 13px;
        .label-start {
            color: red;
        }
    }
    .detail-upload {
        position: relative;
        .close {
            color: #C1C1C1;
            position: absolute;
            top: 0px;
            right: 70px;
        }
    }
    .detail-tip {
        color: #C1C1C1;
        font-size: 12px;
        margin-left: 20px;
    }
    .detail-select--text {
        color: #333;
        font-size: 12px;
        margin: 10px 0 10px 20px;
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
        .set-img-delete {
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
    .content-cross-list {
        width: 110.5px;
        height: 66;
        margin: 10px;
        cursor: pointer;
        border-radius: 6px;
        border: 1px #c0ccda dashed;
    }
    .content-cross-list--one {
        margin-left: 20px;
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
