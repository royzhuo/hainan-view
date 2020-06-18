<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
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
                <el-button type="primary" @click="addSystemRoleVisible=true">添加系统系统角色</el-button>
            </div>
        </div>

        <!--列表-->
        <el-table
                ref="multipleTable"
                tooltip-effect="dark"
                :data="systemRoles"
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
                    prop="code"
                    label="角色编码"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="name"
                    label="角色名称"
            >
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
            <el-table-column label="操作" width="220" align="center">
                <template slot-scope="scope">
                    <el-button
                            title="编辑"
                            type="primary"
                            icon="el-icon-edit"
                            circle
                            @click="handleEdit(scope.$index, scope.row)"
                    ></el-button>
                    <el-button
                            title="菜单授权"
                            type="primary"
                            icon="el-icon-menu"
                            circle
                            @click="handleMenuAuthorization(scope.$index, scope.row)"
                    ></el-button>
                    <el-button
                            title="角色授权"
                            type="primary"
                            icon="el-icon-s-check"
                            circle
                            @click="handleUserAuthorization(scope.$index, scope.row)"
                    ></el-button>
                    <el-button
                            title="删除"
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
        <el-dialog title="添加角色" :before-close="handleClose" :visible.sync="addSystemRoleVisible"  v-dialogDrag>
            <el-form :model="systemRoleForm" :rules="systemRoleFormRule" ref="addSystemRoleFormForm">
                <el-form-item label="角色编码" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="systemRoleForm.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="systemRoleForm.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addSystemRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitSave('addSystemRoleFormForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--编辑窗口-->
        <el-dialog title="编辑角色" :before-close="handleClose" :visible.sync="updateSystemRoleVisible"  v-dialogDrag>
            <el-form :model="systemRoleForm" :rules="systemRoleFormRule" ref="updateSystemRoleFormForm">
                <el-form-item label="角色编码" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="systemRoleForm.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="systemRoleForm.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateSystemUserVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUpate('updateSystemRoleFormForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--菜单授权窗口-->
        <el-dialog title="添加菜单授权" :visible.sync="addMenuAuthorizationVisible"  v-dialogDrag>
            <el-tree
                    v-loading="isMenuTreeLoaddding"
                    ref="tree"
                    :data="systemMenus"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    :props="defaultProps"
                    @check="handleMenuTreeCheck"
            >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMenuAuthorizationVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitMenuAthorization()">确 定</el-button>
            </div>
        </el-dialog>
        <!--用户授权窗口-->
        <el-dialog title="添加用户授权" :visible.sync="addUserAuthorizationVisible"  v-dialogDrag>
            <el-tree
                    v-loading="isUserTreeLoaddding"
                    ref="tree"
                    :data="systemUsers"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    :props="defaultUserProps"
                    @check="handleUserTreeCheck"
            >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserAuthorizationVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUserAthorization()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import {
        addSystemRole, authorizationSystemUserList,
        batchDeleteSystemRole,
        deleteSystemRole, listMenuByRole, listSystemUsers, menuAuthorization,
        systemRoleList,
        updateSystemRole, userAuthorization
    } from "../../../api/system/systemRole";
    import {systemMenuList} from "../../../api/system/systemMenu";
    import {closeLoading, startLoading} from "../../../api/base";

    export default {
        data(){
            return {
                keyword:"",//搜索栏关键字
                addSystemRoleVisible:false,
                updateSystemRoleVisible:false,//编辑角色弹窗
                addMenuAuthorizationVisible:false,//菜单授权弹窗
                addUserAuthorizationVisible:false,//角色授权弹窗
                systemRoles:[],//系统角色数据列表
                multipleSelection:[],//选择的数据集合
                isShowloading:true,//列表加载动画
                total:0, //数据总数
                pageSize:10, //当前页数
                pageNo:1, //当前页
                formLabelWidth:'120px', //弹窗表单宽度
                systemRoleForm:{}, //表单对象
                systemRoleFormRule:{
                    code: [
                        {required: true, message: "请输入角色编码", trigger: "blur"}
                    ],
                    name: [
                        {required: true, message: "请输入角色名称", trigger: "blur"}
                    ]
                }, //表单校验规则
                systemMenus:[],//菜单列表
                defaultProps: {
                    children: 'children',
                    label: 'menuName'
                },
                selectedMenuIds:[],//已选择授权窗口选择菜单id
                menuDefaultCheckedKeys:[],//默认选中菜单的数据
                isMenuTreeLoaddding:true,
                systemUsers:[],//用户列表
                defaultUserProps: {
                    children: 'children',
                    label: 'name'
                },
                isUserTreeLoaddding:true,
                selectedUserIds:[],//已选择授权窗口选择菜单id
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
            loadList(){
                //列表
                systemRoleList(this.pageNo,this.pageSize,this.keyword,res=>{
                    this.isShowloading=false;
                    if (res.data.code=='0'){
                        this.pageNo = res.data.data.pageNum;
                        this.pageSize = res.data.data.pageSize;
                        this.total = res.data.data.total;
                        this.systemRoles=res.data.data.list;
                    }
                })
            },
            batchDelete(){
                //批量删除
                if (this.multipleSelection.length>0){
                    let ids=[];
                    for (let elem of this.multipleSelection.values()){
                        ids.push(elem.id)
                    }
                    batchDeleteSystemRole(ids,res=>{
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
            handleClose(done) {
                //添加窗口关闭前表单置空
                this.systemRoleForm={};
                done();
            },
            /*角色保存*/
            submitSave(addSystemRoleFormForm) {
                //添加表单提交
                this.$refs[addSystemRoleFormForm].validate((valid)=>{
                    if (!valid){
                        return false;
                    }
                    addSystemRole(this.systemRoleForm,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.systemRoleForm={};
                            this.addSystemRoleVisible=false;
                            this.loadList();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                })
            },
            /*角色编辑*/
            handleEdit(index, row){
                //编辑
                this.systemRoleForm=row;
                this.updateSystemRoleVisible=true;
            },
            submitUpate(updateSystemRoleFormForm) {
                //编辑表单提交
                this.$refs[updateSystemRoleFormForm].validate((valid)=>{
                    if (!valid){
                        return false;
                    }
                    updateSystemRole(this.systemRoleForm,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.systemRoleForm={};
                            this.updateSystemRoleVisible=false;
                            this.loadList();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                })
            },
            /*菜单授权模块*/
            handleMenuAuthorization(index, row){
                //角色对菜单进行授权
                this.addMenuAuthorizationVisible=true;
                this.systemRoleForm=row;
                this.systemMenus=[];
                this.menuDefaultCheckedKeys=[];
                this.isMenuTreeLoaddding=true;
                systemMenuList("",res=>{
                    if (res.data.code=='0'){
                        var rootMenu={"menuName":"系统菜单","children":res.data.data};
                        this.systemMenus.push(rootMenu);
                        console.log("tree:"+this.systemMenus)
                    }
                    listMenuByRole(row.id,res=>{
                        this.isMenuTreeLoaddding=false;
                        if (res.data.code=='0'&&res.data.data.length>0){
                            for (let elem of res.data.data.values()){
                                this.menuDefaultCheckedKeys.push(elem.id);
                            }
                            this.$nextTick(() => {
                                this.$refs.tree.setCheckedKeys(this.menuDefaultCheckedKeys) // CheckedArr 一个选中的数组element Ui的东西，关键是看$nextTick的用法
                            });
                            this.selectedMenuIds=this.menuDefaultCheckedKeys;
                        }
                    });
                })


            },
            handleMenuTreeCheck(currentNewSelectObj,selectCurrentTreeObj){
                this.selectedMenuIds=selectCurrentTreeObj.checkedKeys;
            },
            submitMenuAthorization(){
                //提交菜单授权
                this.isMenuTreeLoaddding=true;
                if (this.systemRoleForm.id==null&&this.systemRoleForm.id==""){
                    this.$message.error("角色id为空");
                    this.isMenuTreeLoaddding=false;
                    return null;
                }
                menuAuthorization(this.selectedMenuIds,this.systemRoleForm.id,res=>{
                    this.isMenuTreeLoaddding=false;
                    if (res.data.code=='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.addMenuAuthorizationVisible=false;
                        this.systemRoleForm={};
                        this.selectedMenuIds=[];
                        this.loadList();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            /*用户授权模块*/
            handleUserAuthorization(index, row){
                //对用户进行角色赋予
                this.addUserAuthorizationVisible=true;
                this.systemRoleForm=row;
                this.systemUsers=[];
                this.isUserTreeLoaddding=true;
                listSystemUsers(res=>{
                    var rootUser={"name":"系统用户列表","children":res.data.data};
                    this.systemUsers.push(rootUser);
                    authorizationSystemUserList(row.id,res=>{
                        this.isUserTreeLoaddding=false;
                        let userIds=[];
                        for (let elem of res.data.data.values()){
                            userIds.push(elem.id);
                        }
                        this.$nextTick(() => {
                            this.$refs.tree.setCheckedKeys(userIds) // CheckedArr 一个选中的数组element Ui的东西，关键是看$nextTick的用法
                        });
                        this.selectedUserIds=userIds;
                    })
                })

            },
            handleUserTreeCheck(currentNewSelectObj,selectCurrentTreeObj){
                this.selectedUserIds=selectCurrentTreeObj.checkedKeys;
            },
            submitUserAthorization(){
                this.isUserTreeLoaddding=true;
                userAuthorization(this.selectedUserIds,this.systemRoleForm.id,res=>{
                    this.isUserTreeLoaddding=false;
                    if (res.data.code=='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.addUserAuthorizationVisible=false;
                        this.systemRoleForm={};
                        this.selectedUserIds=[];
                        this.loadList();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            /*角色删除*/
            handleDelete(index, row){
                //删除
                deleteSystemRole(row.id,res=>{
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