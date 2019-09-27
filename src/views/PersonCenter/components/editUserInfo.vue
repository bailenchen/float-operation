<template>
  <div class="edit-user-info">
    <div class="head">
      <span class="wk wk-user icon" />
      <span class="text">个人信息</span>
    </div>
    <el-form
      label-position="left"
      label-width="120px">
      <el-form-item label="头像">
        <flexbox class="user-box">
          <div
            v-photo="userInfo"
            v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img || '')"
            class="user-img div-photo" />
          <div class="change-avatar">
            更换头像
          </div>
        </flexbox>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in fieldList"
        :key="index"
        :label="item.label">
        <el-input
          v-if="item.type !== 'select'"
          v-model="form[item.field]"
          :disabled="item.disabled" />
        <el-select
          v-else
          v-model="form[item.field]">
          <el-option
            v-for="option in item.setting"
            :key="option.value"
            :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'EditUserInfo',
  data() {
    const sexMap = [
      { label: '请选择', value: 0 },
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]
    return {
      fieldList: [
        { label: '姓名', field: 'realname' },
        { label: '手机号(登录名)', field: 'mobile', disabled: true },
        { label: '直属上级', field: 'parentName', disabled: true },
        { label: '性别', field: 'sex', type: 'select', setting: sexMap },
        { label: '邮箱', field: 'email' },
        { label: '部门', field: 'deptName', disabled: true },
        { label: '岗位', field: 'post' }
      ],
      form: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      console.log(this.userInfo)
      this.form = Object.assign({}, this.userInfo)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./style";
  .edit-user-info {
    width: 100%;
    background-color: white;
    padding: 22px 25px;
  }
</style>
