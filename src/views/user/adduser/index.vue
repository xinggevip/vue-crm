<template>
  <div class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="会员名" prop="field101">
        <el-input v-model="formData.field101" placeholder="请输入会员名" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="性别" prop="field102">
        <el-radio-group v-model="formData.field102" size="medium">
          <el-radio v-for="(item, index) in field102Options" :key="index" :label="item.value"
            :disabled="item.disabled">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" :maxlength="11" show-word-limit clearable
          prefix-icon='el-icon-mobile' :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="field103">
        <el-input v-model="formData.field103" type="textarea" placeholder="请输入备注"
          :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  name: 'AddUser',
  components: {},
  props: [],
  data() {
    return {
      user: JSON.parse(this.$store.state.user),
      loading:false,
      formData: {
        field101: undefined,
        field102: '男',
        mobile: '',
        field103: undefined,
      },
      rules: {
        field101: [{
          required: true,
          message: '请输入会员名',
          trigger: 'blur'
        }],
        field102: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        field103: [],
      },
      field102Options: [{
        "label": "男",
        "value": "男"
      }, {
        "label": "女",
        "value": "女"
      }],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
        this.loading = true;

        let item = {
          "comment": this.formData.field103,
          "empid": this.user.id,
          "phonenumber": this.formData.mobile,
          "sex": this.formData.field102,
          "username": this.formData.field101
        }

        this.$post('/user', item).then((result) => {
          console.log(result);
          Message.success(result.message);
          this.$router.push("/user/userlist");

        }).catch((err) => {
          
        }).finally(() => this.loading = false);


      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}

</script>
<style>
</style>
