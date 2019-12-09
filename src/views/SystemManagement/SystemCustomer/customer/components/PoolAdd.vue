<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="pool-add-container">
      <flexbox class="pool-add-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">{{ title }}</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>

      <div class="pool-add-content">
        <create-sections title="基本信息">
          <flexbox
            direction="column"
            align="stretch">
            <el-form
              ref="ruleForm"
              :model="baseFrom"
              :rules="baseRules"
              label-position="top"
              class="pool-add-items">
              <el-form-item
                label="公海名称"
                prop="name"
                class="pool-add-item pool-add-item__left">
                <xh-input v-model="baseFrom.name" />
              </el-form-item>
              <el-form-item
                label="公海管理员"
                prop="name1"
                class="pool-add-item pool-add-item__right">
                <xh-user-cell v-model="baseFrom.name1" />
              </el-form-item>
              <el-form-item
                label="公海成员"
                prop="name2"
                class="pool-add-item pool-add-item__left">
                <xh-struc-user-cell v-model="baseFrom.name2" />
              </el-form-item>
            </el-form>
          </flexbox>
        </create-sections>
        <create-sections title="规则设置">
          <div />
        </create-sections>
      </div>

      <div class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <el-button
          class="handle-button"
          type="primary"
          @click.native="saveClick">保存</el-button>
      </div>
    </flexbox>
  </create-view>
</template>

<script>
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import {
  XhInput,
  XhUserCell,
  XhStrucUserCell
} from '@/components/CreateCom'


export default {
  // 公海规则添加
  name: 'PoolAdd',
  components: {
    CreateView,
    CreateSections,
    XhInput,
    XhUserCell,
    XhStrucUserCell
  },
  props: {
    /**
     * type save:添加、update:编辑
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: '',
          data: {} // 编辑所需信息
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      baseFrom: {
        name: '',
        name1: [],
        name2: []
      },
      baseRules: {
        name: [
          { required: true, message: '请输入公海名称 ', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      if (this.action.type == 'update') {
        return '编辑公海'
      }

      return '新建公海'
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {

    /**
     * 保存数据
     */
    saveClick() {

    },

    /**
     * 关闭页面
     */
    hidenView() {
      this.$emit('hiden-view')
    }
  }
}
</script>

<style lang="scss" scoped>
.pool-add-container {
  position: relative;
  height: 100%;
}

.pool-add-content {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.pool-add-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
  .close:hover {
    color: $xr-color-primary;
  }
}

.pool-add-items {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 15px;
}

.pool-add-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
  &__left {
    padding-right: 25px;
  }
  &__right {
    padding-right: 25px;
  }
}

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}
</style>
