<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
    <el-dialog title="密码修改"  :visible.sync="isShow" v-dialogDrag :before-close="handleClose">
      <el-form :model="form" :rules="editPwdFormRulues" ref="form" class="form">
        <el-form-item label="原密码" :label-width="formLabelWidth" prop="oldPassword">
          <el-input type="password" v-model="form.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
            <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="newCheckPassword">
            <el-input type="password"  show-password v-model="form.newCheckPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDailog">取 消</el-button>
        <el-button type="primary" @click="commitUpdatePassword('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vTags from "./Tags.vue";
import bus from "./bus";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import {updateSystemUserPassword} from "../../api/system/systemUser";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.form.newCheckPassword !== '') {
          this.$refs.form.validateField('newCheckPassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入新密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      tagsList: [],
      collapse: false,
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          oldPassword:"",
          newPassword:"",
          newCheckPassword:"",
        },
        formLabelWidth: '120px',
      editPwdFormRulues:{
        oldPassword:[
          {required: true, message: "请输入原密码", trigger: "blur"}
        ],
        newPassword:[
          { validator: validatePass, trigger: 'blur' }
        ],
        newCheckPassword:[
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters("dailog", {
      isShow: "isShow"
    })
  },
  methods: {
    ...mapActions("dailog", ["hideDailog", "showDailog"]),
    handleClose(){
       this.$confirm('确认关闭？')
          .then(_ => {
            this.hideDailog();
            //this.$store.dispatch('dailog/hideDailog')
          }).bind(this)
          .catch(_ => {});
    },
    commitUpdatePassword(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          updateSystemUserPassword(this.form.oldPassword,this.form.newPassword,res=>{
            if (res.data.code=='0'){
              this.hideDailog();
              this.$message({
                message: "操作成功,需重新登录当前用户！",
                type: 'success'
              });
              localStorage.removeItem("currentUser");
              localStorage.removeItem("token");
              this.$router.push("/login");
            }else{
              this.$message.error(res.data.msg);
            }
          })
        }
      });
    }
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  created() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }
};
</script>
