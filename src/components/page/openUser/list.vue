<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>微信用户管理</el-breadcrumb-item>
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
                <el-input placeholder="用户名称" v-model="keyword" class="handle-input mr10"></el-input>
                <el-button type="primary" @click="searchUsers" icon="el-icon-search">搜索</el-button>
            </div>
            <!--列表-->
            <el-table
                    ref="multipleTable"
                    tooltip-effect="dark"
                    :data="openUsers"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="isShowloading"
                    border
            >
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column label="用户头像" align="center">
                    　　<template slot-scope="scope">
                    　　　　<img :src="scope.row.avatarurl" width="100%" height="50" class="head_pic"/>
                    　　</template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="name"
                        label="用户名"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="nickname"
                        label="昵称"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="birthday"
                        label="生日"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="gallery"
                        :formatter="formatSex"
                        label="性别"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="country"
                        label="所在国家"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="province"
                        label="省份"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="city"
                        label="城市"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="detailAddress"
                        label="详细地址"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        width="140"
                        align="center"
                        prop="createtime"
                        label="创建日期"
                >
                </el-table-column>
                <el-table-column label="操作" width="140" align="center">
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
            <!--用户页面-->
            <el-dialog title="编辑人员信息" :visible.sync="updateOpenUserDialogVisible"  v-dialogDrag>
                <el-form :model="openUserForm"  ref="addOpenUserForm">
                    <el-form-item label="头像地址" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.avatarurl" :disabled="true" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" :label-width="formLabelWidth">
                        <el-input v-model="openUserForm.nickname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth" >
                        <el-radio-group v-model="openUserForm.gallery" size="medium">
                            <el-radio border label="1">男</el-radio>
                            <el-radio border label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="生日" :label-width="formLabelWidth" >
                        <el-date-picker
                                v-model="openUserForm.birthday"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="国家" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.country" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="省份" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.province" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="城市" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.city" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="updateOpenUserDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitUpdate('addOpenUserForm')">确 定</el-button>
                </div>
            </el-dialog>
            <!--编辑用户页面-->
            <el-dialog title="编辑人员信息" :visible.sync="updateOpenUserDialogVisible"  v-dialogDrag>
                <el-form :model="openUserForm"  ref="addOpenUserForm">
                    <el-form-item label="头像地址" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.avatarurl" :disabled="true" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" :label-width="formLabelWidth">
                        <el-input v-model="openUserForm.nickname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth" >
                        <el-radio-group v-model="openUserForm.gallery" size="medium">
                            <el-radio border label="1">男</el-radio>
                            <el-radio border label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="生日" :label-width="formLabelWidth" >
                        <el-date-picker
                                v-model="openUserForm.birthday"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="国家" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.country" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="省份" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.province" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="城市" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.city" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" :label-width="formLabelWidth" >
                        <el-input v-model="openUserForm.detailAddress" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="updateOpenUserDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitUpdate('addOpenUserForm')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import {
        batchDeleteOpenUsers,
        deleteOpenUserById,
        getOpenUserList,
        upateOpenUser
    } from "../../../api/openUser/openUser";

    export default {
        data(){
            return {
                keyword:"", //关键字
                openUsers:[], //列表数据
                isShowloading:true, //表格是否需要加载
                multipleSelection:[], //列表已选择的对象
                total:0, //数据总数
                pageSize:10, //当前页数
                pageNo:1, //当前页
                updateOpenUserDialogVisible:false, //是否开启编辑窗口
                openUserForm:{}, //用户表单
                formLabelWidth:'120px'
            }
        },
        created() {
            this.loadUserList();
        },
        methods:{
            loadUserList(){
                //加载列表数据
                getOpenUserList(this.pageNo,this.pageSize,this.keyword,res=>{
                    this.isShowloading=false;
                    if (res.data.code=="0"){
                        this.openUsers=res.data.data.list;
                        this.pageNo = res.data.data.pageNum;
                        this.pageSize = res.data.data.pageSize;
                        this.total = res.data.data.total;
                    }
                });

            },
            handleSizeChange(val) {
                //pageSize 改变时会触发
                this.pageSize = val;
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                //currentPage 改变时会触发
                this.pageNo = val;
                this.loadUserList();
                console.log(`当前页: ${val}`);
            },
            searchUsers(){
                //搜索
                this.loadUserList();
            },
            formatSex: function (row, column) {
                //列表性别显示格式化
                return row.gallery === '1' ? '男' : row.gallery === '2' ? '女' : '未知'
            },
            batchDelete(){
                //批量删除
                if (this.multipleSelection.length>0){
                    let ids=[];
                    for (let elem of this.multipleSelection.values()){
                        ids.push(elem.id)
                    }
                    batchDeleteOpenUsers(ids,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.loadUserList();
                            this.multipleSelection=[];
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            },
            handleSelectionChange(val){
                //选择事件---->选中列表中的数据
                this.multipleSelection = val;
            },
            handleEdit(index, row) {
                //编辑用户---->跳转用户页面
                this.openUserForm=row;
                this.updateOpenUserDialogVisible=true;
            },
            submitUpdate(addOpenUserForm){
                //表单提交修改
                console.log(this.openUserForm)
                upateOpenUser(this.openUserForm,res=>{
                    if (res.data.code='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.openUserForm={};
                        this.updateOpenUserDialogVisible=false;
                        this.loadUserList();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            handleDelete(index, row) {
                //删除用户
                deleteOpenUserById(row.id,res=>{
                    if (res.data.code='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.loadUserList();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            }

        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .mr10 {
        margin-right: 10px;
    }
</style>