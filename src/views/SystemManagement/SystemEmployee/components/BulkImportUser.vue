<template>
  <el-dialog
    :visible.sync="showDialog"
    :append-to-body="true"
    title="批量导入"
    width="550px"
    @close="closeView">
    <div class="dialog-body">
      <div class="sections">
        <div>请选择需要导入的文件</div>
        <div class="content">
          <flexbox class="file-select">
            <el-input
              v-model="file.name"
              :disabled="true"/>
            <el-button
              type="primary"
              @click="selectFile">选择文件</el-button>
          </flexbox>
        </div>
        <div
          class="download"
          @click="download">
          点击下载《员工导入模板》</div>
        <div class="content content-tips">
          <div>操作步骤：</div>
          <div>1、下载《员工导入模板》</div>
          <div>2、填写表格文件</div>
          <div>3、选择填写好的表格文件，选择导入，导入成功即导入完成</div>
        </div>
      </div>
      <input
        id="importInputFile"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="uploadFile">
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="closeView">取 消</el-button>
      <el-button
        type="primary"
        @click="sure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  userImportTemplateURL,
  userExcelImportAPI
} from '@/api/systemManagement/EmployeeDepManagement'

import { Loading } from 'element-ui'

export default {
  // 批量导入员工股
  name: 'BulkImportUser',
  components: {
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // CRM类型
    crmType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      file: { name: '' }
    }
  },
  computed: {},
  watch: {
    show: function(val) {
      this.showDialog = val
    }
  },
  mounted() {

  },
  methods: {
    sure() {
      if (!this.file.name) {
        this.$message.error('请选择导入文件')
      } else {
        const loading = Loading.service({ fullscreen: true })
        userExcelImportAPI({
          file: this.file
        })
          .then(res => {
            loading.close()
            this.$emit('success')
            this.$message.success('操作成功')
            this.closeView()
          })
          .catch(() => {
            loading.close()
          })
      }
    },

    /**
     * 下载模板操作
     */
    download() {
      window.open(userImportTemplateURL)
    },

    /**
     * 选择文件选择文件
     */
    selectFile() {
      document.getElementById('importInputFile').click()
    },

    /**
     * 选择触发
     */
    uploadFile(event) {
      var files = event.target.files
      const file = files[0]
      this.file = file
      event.target.value = ''
    },

    /**
     * 关闭
     */
    closeView() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.sections {
  font-size: 14px;
  .download {
    cursor: pointer;
    color: #2362FB;
    margin-bottom: 15px;
  }
}

.content {
  padding: 10px 0;
}

.content-tips {
  font-size: 12px;
  color: #a9a9a9;
  line-height: 15px;
}

#importInputFile {
  display: none;
}

.file-select {
  .el-input {
    width: 300px;
  }
  button {
    margin-left: 20px;
  }
}
</style>
