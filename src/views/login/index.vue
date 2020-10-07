<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">零纪元VR-CRM</h3>
      <el-form-item prop="phonenumber">
        <el-input v-model="loginForm.phonenumber" type="text" auto-complete="off" placeholder="手机号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020-{{year}} 高公子 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      year:new Date().getFullYear(),
      loading:false,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        phonenumber: "15937067033",
        password: "123456",
      },
      loginRules: {
        phonenumber: [
          { required: true, trigger: "blur", message: "手机号不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
      },
    };
  },
  watch: {

  },
  created() {

  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$postQs('/emp/login',this.loginForm).then(response => {
            if(response.data != ''){
                let objStr = JSON.stringify(response.data);
                this.$store.commit('SET_USER', objStr);
                this.$message.success('登陆成功');


                setTimeout(()=>{
                  window.location.href='/';
                }, 1000);
              }
            // console.log(response);
          }).catch(error => {

          }).finally(() => this.loading = false)

        }else {
          return false;
        }
      })

    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
