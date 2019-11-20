<template>
  <div class="file-list-view">
    <div
      v-for="(file, fileIndex) in list"
      :key="fileIndex"
      class="file-item">
      <img
        :src="getFileTypeIcon(file.name)"
        alt=""
        class="pic-icon">
      <div class="file-name">{{ file.name }}</div>
      <div class="file-size">( {{ file.size | fontSizeValue }} )</div>
      <div class="down" @click="downloadClick(file)">
        <span>下载</span>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 文件列表
 * @props list {Array} 文件列表
 */
import { downloadFile, getFileIconWithSuffix } from '@/utils'

import { fileSize } from '@/utils/index'

export default {
  name: 'FileListView',
  filters: {
    fontSizeValue(size) {
      return fileSize(size)
    }
  },
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

      return getFileIconWithSuffix(ext)
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
        width: 12px;
        margin-right: 8px;
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
          span {
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>
