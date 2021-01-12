<template>
  <div class="mian1">
    <el-dialog :visible="visible" width="900px" title="上传人脸照片" @close="handleCancel">
      <div class="main">
        <div class="example">示例：</div>
        <section>
          <!-- <div class="example">
          示例： -->
          <div class="sample">
            <img src="@/assets/img/facial _sample.png" alt="">
          </div>
          <!-- </div> -->

          <!-- <img src="@/assets/img/facial _sample.png" alt=""> -->
          <div class="upload-box">
            <add-image-list
              :width="244"
              :max="maxFileCount"
              :data="imgFile"
              :show-all-delete="false"
              style="padding: 0;margin: 0;"
              @delete="deletePayImage"
              @upload="uploadPayFile" />
          </div>
        </section>

        <div class="reminder">
          <p>上传照片支持格式：PNG、JPG、EMP、GIF、RAW</p>
          <p>照片大小：&lt; 10M</p>
        </div>

        <div class="standard">
          <img src="@/assets/img/facial _standard.png" alt="">
        </div>
      </div>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { crmFileSave } from '@/api/common'

import AddImageList from '@/components/quickAdd/AddImageList'

export default {
  components: {
    AddImageList
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: [String, Number],
    // 操作数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      maxFileCount: 1,
      imgFile: []
    }
  },
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      console.log('关闭人脸上传dialog')
      this.$emit('update:visible', false)
    },
    /**
     * 附件操作
     */
    deletePayImage(item, index) {
      this.imgFile.splice(index, 1)
    },

    uploadPayFile() {
      var files = event.target.files
      if (files.length) {
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          if (
            file.type.indexOf('image') == -1 &&
            this.showRelativeType == 'img'
          ) {
            this.$message.error('请上传正确的文件类型')
            return
          }
        }
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          crmFileSave({ file: file, batchId: this.selectionList[0].batchId, type: 'portrait' }).then(res => {
            var data = {}
            for (const k in res) {
              if (!res.hasOwnProperty(k)) break
              if (k == 'code') continue
              data[k] = res[k]
            }
            this.imgFile.push(data)
            this.$message.success('上传成功')
            // this.$set(this.form, 'applyCertificate', path)
          }).catch(() => {
            this.loading = false
          })
        }
        event.target.value = ''
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.main {
  margin: auto;
  width: 620px;
}
.example {
  margin-bottom: 14px;
}
section {
  display: flex;
  justify-content: space-between;
}

.sample {
  width: 170px;
  height: 241px;
  // background-color: rgb(255, 0, 0);
  border: 8px solid #fff;
  overflow: hidden;
  box-shadow: 0 0 12px rgba(0, 0, 0, .1);
  position: relative;
  img {
    height: 100%;
  }
}

.reminder {
  margin-top: 14px;
  p {
    line-height: 24px;
  }
}
.standard {
  margin-top: 14px;
}
</style>
