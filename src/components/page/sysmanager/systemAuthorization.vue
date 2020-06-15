<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>菜单权限管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-container>
            <el-aside width="25%" >
                <el-tree default-expand-all
                         :check-on-click-node="true"
                         :highlight-current="true"
                         :expand-on-click-node="false"
                         :data="systemMenus"
                         :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </el-aside>
            <el-main>
                <div class="container">
                    <div class="handle-box">
                        <el-button
                                type="danger"
                                icon="delete"
                                class="handle-del mr10"
                                @click="batchDelete"
                        >批量删除
                        </el-button>
                        <el-input placeholder="接口地址名称" v-model="keyword" class="handle-input mr10"></el-input>
                        <el-button type="primary" @click="searchInfo" icon="el-icon-search">搜索</el-button>
                        <el-button type="primary" @click="addSystemMenuPermissionVisible=true">添加授权接口</el-button>
                    </div>
                </div>

                <!--列表  default-expand-all-->
                <el-table
                        ref="multipleTable"
                        tooltip-effect="dark"
                        :data="systemMenuPermissions"
                        row-key="id"
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
                            prop="name"
                            label="许可地址名称"
                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="url"
                            label="接口地址"
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
                <el-dialog title="添加接口" :before-close="handleClose" :visible.sync="addSystemMenuPermissionVisible"  v-dialogDrag>
                    <el-form :model="systemMenuPermissionForm" :rules="systemMenuPermissionFormRule" ref="addSystemMenuPermissionFormForm">
                        <el-form-item label="许可地址名称" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="systemMenuPermissionForm.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="接口地址" :label-width="formLabelWidth" prop="url">
                            <el-input v-model="systemMenuPermissionForm.url" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addSystemMenuPermissionVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitSave('addSystemMenuPermissionFormForm')">确 定</el-button>
                    </div>
                </el-dialog>
                <!--编辑窗口-->
                <el-dialog title="编辑接口" :before-close="handleClose" :visible.sync="updateSystemMenuPermissionVisible"  v-dialogDrag>
                    <el-form :model="systemMenuPermissionForm" :rules="systemMenuPermissionFormRule" ref="updateSystemMenuPermissionFormForm">
                        <el-form-item label="许可地址名称" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="systemMenuPermissionForm.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="接口地址" :label-width="formLabelWidth" prop="url">
                            <el-input v-model="systemMenuPermissionForm.url" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="updateSystemMenuPermissionVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitUpate('updateSystemMenuPermissionFormForm')">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>




    </div>
</template>

<script>
    import {systemMenuList} from "../../../api/system/systemMenu";
    import {
        addSystemMenuPermission, batchDeleteSystemMenuPermission, deleteSystemMenuPermission,
        systemMenuPermissionList,
        updateSystemMenuPermission
    } from "../../../api/system/systemMenuPermission";
    import {addSystemRole, updateSystemRole} from "../../../api/system/systemRole";

    export default {
       data(){
           return{
               systemMenus:[],//菜单列表
               keyword:"",
               defaultProps: {
                   children: 'children',
                   label: 'menuName'
               },
               systemMenus:[],
               isShowloading:false,
               addSystemMenuPermissionVisible:false,
               updateSystemMenuPermissionVisible:false,
               systemMenuPermissionForm:{},
               systemMenuPermissionFormRule:{
                   name: [
                       {required: true, message: "请输入接口名称", trigger: "blur"}
                   ],
                   url: [
                       {required: true, message: "请输入接口地址", trigger: "blur"}
                   ]
               }, //表单校验规则
               multipleSelection:[],//选择的数据集合
               formLabelWidth:'120px', //弹窗表单宽度
               systemMenuPermissions:[],
               selectedMenuId:"",//被选中的菜单id
               total:0, //数据总数
               pageSize:10, //当前页数
               pageNo:1, //当前页
           }
       },
        created() {
           this.loadMenus();
        },
        methods:{
            loadMenus(){
                systemMenuList("",res=>{
                    if (res.data.code=='0'){
                        var rootMenu={"menuName":"系统菜单","children":res.data.data};
                        this.systemMenus.push(rootMenu);
                    }
                })
            },
            handleNodeClick(data) {
                if (data.id!=null&&data.id!=""){
                    this.selectedMenuId=data.id;
                    this.loadMenuPermissionInfo();
                }
            },
            batchDelete(){
                //批量删除
                if (this.multipleSelection.length>0){
                    let ids=[];
                    for (let elem of this.multipleSelection.values()){
                        ids.push(elem.id)
                    }
                    batchDeleteSystemMenuPermission(ids,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.loadMenuPermissionInfo();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            },
            loadMenuPermissionInfo(){
                this.isShowloading=true;
                systemMenuPermissionList(this.pageNo,this.pageSize,this.keyword,this.selectedMenuId,res=>{
                    this.isShowloading=false;
                    if (res.data.code=='0') {
                        this.pageNo = res.data.data.pageNum;
                        this.pageSize = res.data.data.pageSize;
                        this.total = res.data.data.total;
                        this.systemMenuPermissions = res.data.data.list;
                    }
                })
            },
            handleSizeChange(val) {
                //pageSize 改变时会触发
                this.pageSize = val;
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                //currentPage 改变时会触发
                this.pageNo = val;
                this.loadMenuPermissionInfo();
                console.log(`当前页: ${val}`);
            },
            searchInfo(){
                this.loadMenuPermissionInfo();
            },
            handleSelectionChange(val){
                //选择事件---->选中列表中的数据
                this.multipleSelection = val;
            },
            handleClose(done) {
                //添加窗口关闭前表单置空
                this.systemMenuPermissionForm={};
                done();
            },
            submitSave(addSystemMenuPermissionFormForm) {
                //添加表单提交
                this.$refs[addSystemMenuPermissionFormForm].validate((valid)=>{
                    if (!valid){
                        return false;
                    }
                    if (this.selectedMenuId==""){
                        this.$message.error("请选择菜单");
                        return false;
                    }
                    this.systemMenuPermissionForm.menuId=this.selectedMenuId;
                    addSystemMenuPermission(this.systemMenuPermissionForm,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.systemMenuPermissionForm={};
                            this.addSystemMenuPermissionVisible=false;
                            this.loadMenuPermissionInfo();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                })
            },
            handleEdit(index, row){
                //编辑
                this.systemMenuPermissionForm=row;
                this.updateSystemMenuPermissionVisible=true;
            },
            submitUpate(updateSystemMenuPermissionFormForm) {
                //编辑表单提交
                this.$refs[updateSystemMenuPermissionFormForm].validate((valid)=>{
                    if (!valid){
                        return false;
                    }
                    updateSystemMenuPermission(this.systemMenuPermissionForm,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.systemMenuPermissionForm={};
                            this.updateSystemMenuPermissionVisible=false;
                            this.loadMenuPermissionInfo();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                })
            },
            handleDelete(index, row){
                deleteSystemMenuPermission(row.id,res=>{
                    if (res.data.code=='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.loadMenuPermissionInfo();
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