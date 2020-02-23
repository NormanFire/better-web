<template>
  <div class="container">
    <el-row class="login-container">
      <el-col :span="12" class="login-picture">

      </el-col>
      <el-col :span="12" class="login-form">
        <el-row class="title-container">Login</el-row>
        <el-row class="form-container">
          <el-form ref="loginForm" :rules="loginRules" :model="loginForm" autocomplete="off" label-position="top">
            <el-form-item prop="username" label="Username">
              <el-input ref="username" name="username" type="text"
                        v-model="loginForm.username" autocomplete="off"
                        @keyup.enter.native="handleLogin"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input ref="password" v-model="loginForm.password"
                        type="password" name="password" autocomplete="off"
                        @keyup.enter.native="handleLogin"></el-input>
            </el-form-item>
            <el-form-item prop="code" label="ValidateCode">
              <el-row>
                <el-input ref="code" v-model="loginForm.code"
                          name="code" type="text" autocomplete="off"
                          @keyup.enter.native="handleLogin"
                          class="validate-code"></el-input>
                <img :src="imageCode" alt="codeImage" class="code-image" @click="getCodeImage">
              </el-row>
            </el-form-item>
            <el-form-item style="padding-top: 20px">
              <el-button type="primary" @click.native.prevent="handleLogin">login</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { randomNum } from '@/utils'
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      codeUrl: `${process.env.VUE_APP_BASE_API}auth/captcha`,
      randomId: randomNum(24, 16),
      imageCode:'',
      loginForm: {
        username: '',
        password: '',
        code:'',
      },
      loginRules: {
        username: [{ required: true, message: 'require', trigger: 'blur', }],
        password: [{ required: true, message: 'require', trigger: 'blur',}],
        code: [{ required: true, message: 'require', trigger: 'blur' }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getCodeImage()
  },
  methods: {
    //获取验证码
    getCodeImage(){
      axios({
        method:'GET',
        url: `${this.codeUrl}?key=${this.randomId}`,
        responseType:'arraybuffer'
      }).then(res => {
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }).then((res) => {
        this.imageCode = res
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      const vm = this
      let username_c = false
      let password_c = false
      let code_c = false
      this.$refs.loginForm.validateField('username', e => { if (!e) { username_c = true } })
      this.$refs.loginForm.validateField('password', e => { if (!e) { password_c = true } })
      this.$refs.loginForm.validateField('code', e => { if (!e) { code_c = true } })
      if (username_c && password_c && code_c) {
        vm.$login('auth/oauth/token',{
          ...vm.loginForm,
          key:this.randomId
        }).then((r) => {
          const data = r.data
          console.log(r.data)
          vm.saveLoginData(data)
          vm.getUserDetailInfo()
          vm.loginSuccessCallback()
        }).catch((error) => {
          console.error(error)
          vm.getCodeImage()
        })
      }
    },
    saveLoginData(data) {
      this.$store.commit('account/setAccessToken', data.access_token)
      this.$store.commit('account/setRefreshToken', data.refresh_token)
      const current = new Date()
      const expireTime = current.setTime(current.getTime() + 1000 * data.expires_in)
      this.$store.commit('account/setExpireTime', expireTime)
    },
    getUserDetailInfo() {
      this.$get('auth/user').then((r) => {
        this.$store.commit('account/setUser', r.data.principal)
        this.$message({
          message: 'loginSuccess',
          type: 'success'
        })
        this.loading = false
        this.$router.push('/')
      }).catch((error) => {
        this.$message({
          message: 'loginFail',
          type: 'error'
        })
        console.error(error)
        this.loading = false
      })
    },
    loginSuccessCallback() {
      // this.$get('upms/user/success').catch((e) => { console.log(e) })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

.el-form-item__label{
  padding-bottom: 0!important;
  line-height: 30px;
  height: 30px;
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.container {
  height: 100%;
  width: 100%;
  background-color: #409EFF;
  position: relative;

  .login-container{
    height: 400px;
    width: 740px;
    overflow: hidden;
    background-color: #f4f4f5;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -370px;
    margin-top: -200px;
    border-radius: 10px;

    .login-picture,.login-form{
      height: 100%;
      width: 50%;
    }

    .login-form{
      background-color: #ffffff;

      .title-container{
        font-size: 1.5rem;
        height: 50px;
        width: 100%;
        padding: 21px 21px 3.5px;
      }

      .form-container{
        padding: 20px 20px 0;

        .validate-code{
          width: 65%;
        }
        .code-image{
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
          height: 40px;
        }
      }
    }
  }
}

.el-form-item{
  margin-bottom: 0;
}
</style>
