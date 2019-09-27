<template>
  <div class="edit-pwd">
    <div class="head">
      <span class="wk wk-user icon" />
      <span class="text">个人信息</span>
    </div>
    <el-form
      label-position="left"
      label-width="120px">
      <el-form-item label="原密码">
        <el-input
          v-model="form.oldPwd"
          type="password" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          v-model="form.newPwd"
          type="password" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          v-model="form.confirmPwd"
          type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'EditPwd',
  data() {
    return {
      form: {}
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
  @import "./style";
  .edit-pwd {
    width: 100%;
    background-color: white;
    padding: 22px 25px;
  }
</style>
