<template>
  <div class="file-list-view">
    <div
      v-for="(file, fileIndex) in list"
      :key="fileIndex"
      class="file-item">
      <img
        :src="getFileTypeIcon(file.filePath)"
        alt=""
        class="pic-icon">
      <span class="file-name">
        {{ file.name }}
      </span>
      <span class="file-size">
        ( {{ file.size }} )
      </span>
      <span class="down" @click="downloadClick(file)">
        下载
      </span>
    </div>
  </div>
</template>

<script>
/**
 * 文件列表
 * @props list {Array} 文件列表
 */
import { downloadFile } from '@/utils'

export default {
  name: 'FileListView',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {
    getFileTypeIcon(url) {
      if (!url) return ''
      const temps = url ? url.split('.') : []
      let ext = ''
      if (temps.length > 0) {
        ext = temps[temps.length - 1]
      } else {
        ext = ''
      }
      if (this.arrayContain(['jpg', 'png', 'gif', 'jpeg'], ext)) {
        return require('@/assets/img/file_img.png')
      } else if (this.arrayContain(['mp4', 'mp3', 'avi'], ext)) {
        return require('@/assets/img/file_excle.png')
      } else if (this.arrayContain(['xlsx', 'xls', 'XLSX', 'XLS'], ext)) {
        return require('@/assets/img/file_excle.png')
      } else if (this.arrayContain(['doc', 'docx', 'DOC', 'DOCX'], ext)) {
        return require('@/assets/img/file_word.png')
      } else if (this.arrayContain(['rar', 'zip'], ext)) {
        return require('@/assets/img/file_zip.png')
      } else if (ext === 'pdf') {
        return require('@/assets/img/file_pdf.png')
      } else if (ext === 'ppt' || ext === 'pptx') {
        return require('@/assets/img/file_ppt.png')
      } else if (this.arrayContain(['txt', 'text'], ext)) {
        return require('@/assets/img/file_txt.png')
      }
      return require('@/assets/img/file_unknown.png')
    },
    arrayContain(array, string) {
      return array.some(item => {
        return item === string
      })
    },
    downloadClick(file) {
      downloadFile({ path: file.filePath, name: file.name })
    }
  }
}
</script>

<style scoped lang="scss">
  .file-list-view {
    .file-item {
      width: 100%;
      font-size: 12px;
      line-height: 1;
      box-sizing: border-box;
      padding: 5px 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .pic-icon {
        width: 14px;
        margin-right: 16px;
      }
      .file-name {
        margin-right: 14px;
      }
      .file-size {
        color: #999;
        margin-right: 15px;
      }
      .down {
        color: #2362FB;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
