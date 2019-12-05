<template>
  <flexbox
    v-loading="loading"
    align="stretch"
    class="web-box">
    <create-sections title="官网设置">
      <div class="web-content">
        <p class="web-text">可在这里统一更新编辑官网，最多只能上传十张图片</p>
        <div class="web-image">
          <p class="image-title">官网详情图</p>
          <div slot="tip" class="el-upload__tip">图片建议上传：750*1108</div>
          <div v-if="fileList.length < 10" class="content-cross" @click="upLoadImg">
            <input
              ref="imgInput"
              accept="image/*"
              type="file"
              class="file-input"
              @change="upLoad">
            <el-button
              type="text"
              icon="el-icon-plus"
              class="cross"/>
          </div>
          <div class="draggable-scroll--box">
            <div :class="fileList.length < 10 ? '' : 'draggable-scroll--height'" class="draggable-scroll">
              <draggable
                v-model="fileList"
                :group="{ name: 'sort'}"
                :options="{ forceFallback: false }"
                class="draggable-box">
                <flexbox
                  v-for="(item, index) in fileList"
                  :key="index"
                  class="content"
                  @mousemove="imgId = item.officialImgId">
                  <el-image
                    :src="item.url"
                    :preview-src-list="imgList"
                    class="draggable-image"
                    @click.native="piewImg(item)"/>
                  <span class="draggable-text">{{ item.name }}</span>
                  <el-button
                    v-if="imgId == item.officialImgId"
                    type="text"
                    icon="el-icon-close"
                    class="draggable-close"
                    @click="handleRemove(item, index)"/>
                </flexbox>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </create-sections>
    <create-sections title="预览官网" class="web-content">
      <div class="web-image phone">
        <el-image :src="require('@/assets/img/weixin_ding2.png')"/>
        <div class="web-image-box">
          <div class="web-box-scroll">
            <el-image
              v-for="item in fileList"
              :key="item.url" :src="item.url" class="web-image-main"/>
          </div>
        </div>
        <el-image :src="require('@/assets/img/weixin_di2.png')"/>
      </div>
    </create-sections>
  </flexbox>
</template>

<script type="text/javascript">
import { officialImgSaveAPI,
  officialImgDeleteAPI,
  officialImgSortImgAPI,
  officialImgQueryListByTypeAPI } from '@/api/systemManagement/poster'
import draggable from 'vuedraggable'
import CreateSections from '@/components/CreateSections'

export default {
  components: {
    draggable,
    CreateSections
  },
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imageUrl: '',
      fileList: [],
      imgList: [],
      imgId: -1,
      loading: false
    }
  },
  watch: {
    fileList: {
      handler(val) {
        this.imgList = []
        val.forEach(item => {
          this.imgList.push(item.url)
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getFileList()
  },
  destroyed() {
    this.sortSave()
  },
  methods: {
    /** 查看图片列表 */
    getFileList() {
      this.loading = true
      this.fileList = []
      officialImgQueryListByTypeAPI({ type: 1 }).then(res => {
        res.data.forEach(item => {
          this.fileList.push(
            { name: item.name, url: item.filePath, officialImgId: item.officialImgId }
          )
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 上传到服务器 */
    upLoad(event) {
      const params = {
        file: event.target.files[0],
        type: '1'
      }
      this.loading = true
      officialImgSaveAPI(params).then(res => {
        this.loading = false
        this.fileList.push(
          { name: res.data.name, url: res.data.filePath, officialImgId: res.data.officialImgId }
        )
      }).catch(() => {
        this.loading = false
      })
    },


    /**
     * 删除图片
     */
    handleRemove(item, index) {
      this.loading = true
      officialImgDeleteAPI({
        officialImgId: item.officialImgId
      }).then(res => {
        this.loading = false
        this.$message.success('删除成功')
        this.fileList.splice(index, 1)
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 预览图片
     */
    piewImg(item) {
      this.imgList = []
      this.imgList.push(item.url)
    },

    upLoadImg() {
      this.$refs.imgInput.click()
    },

    /**
     * 图片排序
     */
    sortSave() {
      const list = []
      this.fileList.forEach((item, index) => {
        list.push({ officialImgId: item.officialImgId, tactic: index })
      })
      officialImgSortImgAPI(list).then(res => {
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.web-box {
    height: 100%;
}

.create-sections {
  flex: 1;
  /deep/ .create-sections-content {
    height: calc(100% - 26px);
    overflow: auto;
  }
}

.web-content {
    padding-left: 0;
    margin-top: 0;
    color: #333;
    .web-text {
        padding-left: 15px;
        font-size: 12px;
        margin: 20px 0;
    }
    .phone {
        border-bottom: 8px solid #333;
        border-top: 5px solid #333;
        border-left: 3px solid #333;
        border-right: 3px solid #333;
        border-radius: 6px;
        margin-top: 20px;
        padding-left: 0;
        width: 262.5px;
        height: 492.5px;
        .web-image-box {
            overflow-x: hidden;
            .web-box-scroll {
                overflow-y: auto;
                overflow-x: hidden;
                width: 264px;
                height: 400px;
            }
        }
    }
    .web-image {
        margin-left: 15px;
        .web-image-main {
            display: block;
            margin: 0 !important;
            width: 262px !important;
            height: 400px !important;
        }
        .image-title {
            margin: 20px 0 15px 0;
            color: #333;
            font-size: 14px;
        }
        .web-image-text {
            width: 242px;
            height: 50px;
            text-align: center;
        }
        .image-text {
            width: 262px;
            height: 18px;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            text-align: left;
            margin-top: 5px;
        }
    }
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 187.5px;
    height: 263px;
    line-height: 263px;
    text-align: center;
}

.avatar {
    width: 187.5px;
    height: 263px;
    display: block;
}

.content-cross {
    width: 400px;
    height: 92px;
    display: flex;
    border-radius: 6px;
    margin-top: 10px;
    margin-bottom: 20px;
    position: relative;
    text-align: center;
    border: 1px #c0ccda dashed;
    .cross {
        color: #606266;
        font-size: 20px;
        margin-left: 190px;
    }
}

.content {
    overflow: hidden;
    width: 400px;
    height: 92px;
    border-radius: 6px;
    margin-top: 10px;
    position: relative;
    border: 1px #c0ccda solid;
}

.draggable-image {
    flex-shrink: 0;
    width: 100px;
    padding: 10px;
    height: 90px;
}

.draggable-box {
    width: 400px;
}

.draggable-scroll {
    width: 420px;
    height: 420px;
    overflow-y: auto;
}

.draggable-scroll--height {
    height: 500px;
}

.draggable-scroll--box {
    width: 400px;
    overflow: hidden;
}

.draggable-text {
    display: inline-block;
    height: 90px;
    line-height: 90px;
    padding-left: 4px;
    color: #606266;
    font-size: 14px;
}

.draggable-close {
    position: absolute;
    left: 370px;
    color: #606266;
}

.file-input {
    display: none;
}
</style>
