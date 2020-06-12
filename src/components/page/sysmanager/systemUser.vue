<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-button
                        type="danger"
                        icon="delete"
                        class="handle-del mr10"
                        @click="batchDelete"
                >批量删除
                </el-button>
                <el-input placeholder="用户名" v-model="keyword" class="handle-input mr10"></el-input>
                <el-button type="primary" @click="searchInfo" icon="el-icon-search">搜索</el-button>
                <el-button type="primary" @click="addSystemUserVisible=true">添加系统用户</el-button>
            </div>
        </div>

        <!--列表-->
        <el-table
                ref="multipleTable"
                tooltip-effect="dark"
                :data="systemUsers"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="isShowloading"
                border
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="userCode"
                    label="用户编码"
                    >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="name"
                    label="用户名"
                   >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="sex"
                    label="性别"
                    :formatter="formatSex"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="isblack"
                    :formatter="formatBlack"
                    label="是否黑名单"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="createTime"
                    label="创建时间"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="updateTime"
                    label="更新时间"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button
                            type="primary"
                            icon="el-icon-edit"
                            circle
                            @click="handleEdit(scope.$index, scope.row)"
                    ></el-button>
                    <el-button
                            type="primary"
                            icon="el-icon-delete"
                            circle
                            @click="handleDelete(scope.$index, scope.row)"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    layout="total,prev, pager, next, jumper"
                    :total="total"
                    :page-size="this.pageSize"
            >
            </el-pagination>
        </div>
        <!--新增窗口-->
        <el-dialog title="添加人员" :before-close="handleClose" :visible.sync="addSystemUserVisible"  v-dialogDrag>
            <el-form :model="systemUserForm" :rules="systemUserFormRule" ref="addSystemUserFormForm">
                <el-form-item label="用户编码" :label-width="formLabelWidth" prop="userCode">
                    <el-input v-model="systemUserForm.userCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="systemUserForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-radio-group v-model="systemUserForm.sex" size="medium">
                        <el-radio border label="0">男</el-radio>
                        <el-radio border label="1">女</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addSystemUserVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitSave('addSystemUserFormForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--编辑窗口-->
        <el-dialog title="编辑人员" :before-close="handleClose" :visible.sync="updateSystemUserVisible"  v-dialogDrag>
            <el-form :model="systemUserForm" :rules="systemUserFormRule" ref="updateSystemUserFormForm">
                <el-form-item label="用户编码" :label-width="formLabelWidth" prop="userCode">
                    <el-input v-model="systemUserForm.userCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="systemUserForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-radio-group v-model="sex" size="medium">
                        <el-radio border label="0">男</el-radio>
                        <el-radio border label="1">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否黑名单" :label-width="formLabelWidth">
                    <el-radio-group v-model="isblack" size="medium">
                        <el-radio border label="0">是</el-radio>
                        <el-radio border label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateSystemUserVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUpate('updateSystemUserFormForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {
        addSystemUser,
        batchDeleteSystemUser,
        deleteSystemUser,
        systemUserList,
        updateSystemUser
    } from "../../../api/system/systemUser";

    export default {
       data(){
           return {
               keyword:"",//搜索栏关键字
               addSystemUserVisible:false,//添加用户弹窗
               updateSystemUserVisible:false,//编辑用户弹窗
               systemUsers:[],//系统用户数据列表
               multipleSelection:[],//选择的数据集合
               isShowloading:true,//列表加载动画
               total:0, //数据总数
               pageSize:10, //当前页数
               pageNo:1, //当前页
               formLabelWidth:'120px', //弹窗表单宽度
               systemUserForm:{}, //表单对象
               systemUserFormRule:{
                   userCode: [
                       {required: true, message: "请输入用户编码", trigger: "blur"}
                   ],
                   name: [
                       {required: true, message: "请输入用户名称", trigger: "blur"}
                   ]
               }, //表单校验规则
               sex:'',
               isblack:""
           }
       },
        created() {
           this.loadList();
        },
        methods:{
            searchInfo(){
                //搜索
                this.loadList();
            },
            batchDelete(){
                //批量删除
                if (this.multipleSelection.length>0){
                    let ids=[];
                    for (let elem of this.multipleSelection.values()){
                        ids.push(elem.id)
                    }
                    batchDeleteSystemUser(ids,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.loadList();
                            this.multipleSelection=[];
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            },
            loadList(){
                //列表
                systemUserList(this.pageNo,this.pageSize,this.keyword,res=>{
                    this.isShowloading=false;
                    if (res.data.code=='0'){
                        this.pageNo = res.data.data.pageNum;
                        this.pageSize = res.data.data.pageSize;
                        this.total = res.data.data.total;
                        this.systemUsers=res.data.data.list;
                    }
                })

            },
            formatSex: function (row, column) {
                //列表性别显示格式化
                return row.sex === 0 ? '男' : row.sex === 1 ? '女' : '未知'
            },
            formatBlack: function (row, column) {
                //列表性别显示格式化
                return row.isblack === 0 ? '是' : row.isblack === 1 ? '否' : '未知'
            },
            handleSizeChange(val) {
                //pageSize 改变时会触发
                this.pageSize = val;
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                //currentPage 改变时会触发
                this.pageNo = val;
                this.loadList();
                console.log(`当前页: ${val}`);
            },
            handleSelectionChange(val){
                //选择事件---->选中列表中的数据
                this.multipleSelection = val;
            },
            submitSave(addSystemUserFormForm){
                //添加表单提交
                this.$refs[addSystemUserFormForm].validate((valid)=>{
                    if (!valid){
                        return false;
                    }
                    addSystemUser(this.systemUserForm,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.addSystemUserVisible=false;
                            this.loadList();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                })
            },
            handleClose(done) {
                //添加窗口关闭前表单置空
                this.systemUserForm={};
                done();
            },
            handleEdit(index, row){
                //编辑
                this.systemUserForm=row;
                this.sex=this.systemUserForm.sex+'';
                this.isblack=this.systemUserForm.isblack+'';
                this.updateSystemUserVisible=true;
            },
            submitUpate(updateSystemUserFormForm){
                //编辑表单提交
                this.$refs[updateSystemUserFormForm].validate((valid)=>{
                    if (!valid){
                        return false;
                    }
                    this.systemUserForm.sex=this.sex;
                    this.systemUserForm.isblack=this.isblack;
                    updateSystemUser(this.systemUserForm,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.updateSystemUserVisible=false;
                            this.loadList();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                })
            },
            handleDelete(index, row){
                //删除
                deleteSystemUser(row.id,res=>{
                    if (res.data.code=='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        //this.updateSystemUserVisible=false;
                        this.loadList();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .mr10 {
        margin-right: 10px;
    }
</style>