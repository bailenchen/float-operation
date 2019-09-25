<template>
  <div class="section">
    <div class="examine-cell">
      <flexbox class="person">
        <div
          v-photo="data.createUser"
          v-lazy:background-image="$options.filters.filterUserLazyImg(data.createUser.img)"
          class="div-photo person__hd" />
        <div class="person__bd">
          <div class="person__bd-name">{{ data.createUser.realname }}</div>
          <div class="person__bd-des">{{ `创建审批于 ${data.createTime}` }}</div>
        </div>

        <div class="rt-setting">
          <span class="dep">
            <span>{{ data.categoryTitle }} - </span>
            <span>{{ getStatusName(data.examineStatus) }}</span>
          </span>
          <span
            :style="{ 'background-color': getStatusColor(data.examineStatus) }"
            class="bg-color" />
        </div>
      </flexbox>

      <div class="examine-cell__bd">
        <p
          v-if="data.content"
          class="examine-cell__bd--content">{{ data.content }}</p>

        <flexbox class="examine-content">
          <i
            :class="['wk', 'examine-content__hd', `wk-${iconObj.icon}`]"
            :style="{ backgroundColor: iconObj.color}" />
          <div class="examine-content__bd">
            <div>
              <a>{{ data.categoryTitle }}</a>
            </div>
            <div
              v-if="data.causeTitle"
              class="examine-content__bd--des">{{ data.causeTitle }}</div>
          </div>
        </flexbox>

        <div class="examine-stage">
          <i class="wk wk-time" /><span>待张倩进行审批</span>
        </div>
      </div>
    </div>

    <div class="section__ft">
      <el-button
        class="xr-btn--red handle-button"
        icon="wk wk-close"
        type="primary"
        @click="handleClick('reject')">驳回</el-button>
      <el-button
        class="xr-btn--green handle-button"
        icon="wk wk-success"
        type="primary"
        @click.native="handleClick('pass')">通过</el-button>
    </div>
  </div>
</template>

<script>
import Examine from './ExamineMixin'
import CheckStatus from '@/mixins/CheckStatusMixin'

export default {
  /** 审批Cell */
  name: 'ExamineCell',
  components: {},
  mixins: [Examine, CheckStatus],
  props: {
    data: Object
  },
  data() {
    return {}
  },
  computed: {
    iconObj() {
      return this.getCategoryIcon(this.data.categoryId)
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    handleClick(type) {
      console.log('handleClick---', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  background-color: white;
  border-radius: 4px;
  border: 1px solid $xr-border-line-color;
  margin-bottom: 15px;

  &__ft {
    background-color: #f4f7ff;
    overflow: hidden;
    padding-right: 10px;
    .el-button {
      padding: 6px 10px;
      margin: 5px 5px 5px 0;
      float: right;
    }
  }
}

.examine-cell {
  padding: 15px;

  &__bd {
    margin-left: 40px;
    margin-top: 20px;

    &--content {
      font-size: 13px;
      color: #333;
    }
  }
}

// 审批内容
.examine-content {
  margin-top: 15px;
  padding: 5px;
  background-color: #f4f7ff;
  &__hd {
    display: block;
    border-radius: 5px;
    margin-right: 8px;
    padding: 7px 8px;
    color: white;
  }

  &__bd {
    flex: 1;

    a {
      font-size: 12px;
      color: $xr-color-primary;
    }

    a:hover {
      text-decoration: underline;
    }

    &--des {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
}

// 人 信息
.person {
  &__hd {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 17px;
    margin-right: 8px;
  }

  &__bd {
    flex: 1;

    &-name {
      font-size: 13px;
      color: #333;
    }

    &-des {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
}

//审核阶段
.examine-stage {
  color: #333;
  font-size: 12px;
  margin-top: 15px;

  i {
    color: #ffa22a;
    margin-right: 5px;
    font-size: 12px;
  }
}

// 状态展示
.rt-setting {
  float: right;
  line-height: 30px;
  font-size: 12px;
  .dep {
    color: #333333;
    margin-right: 5px;
  }
  img {
    width: 16px;
    cursor: pointer;
    vertical-align: middle;
  }
  .bg-color {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
</style>
