<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
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
                <el-button type="primary" @click="addSystemMenuVisible=true">添加系统系统菜单</el-button>
            </div>
        </div>

        <!--列表  default-expand-all-->
        <el-table
                ref="multipleTable"
                tooltip-effect="dark"
                :data="systemMenus"
                row-key="id"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"

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
                    prop="menuCode"
                    label="菜单编码"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="menuName"
                    label="菜单名称"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="url"
                    label="访问路径"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="icon"
                    label="菜单图标"
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
        <!--新增窗口-->
        <el-dialog title="添加菜单" :before-close="handleClose" :visible.sync="addSystemMenuVisible"  v-dialogDrag>
            <el-form :model="systemMenuForm" :rules="systemMenuFormRule" ref="addSystemMenuFormForm">
                <el-form-item label="菜单编码" :label-width="formLabelWidth" prop="menuCode">
                    <el-input v-model="systemMenuForm.menuCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
                    <el-input v-model="systemMenuForm.menuName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="访问路径" :label-width="formLabelWidth" prop="url">
                    <el-input v-model="systemMenuForm.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="父级菜单" :label-width="formLabelWidth" >
<!--                    <el-input v-model="systemMenuForm.parentId" autocomplete="off"></el-input>-->
                    <el-select v-model="systemMenuForm.parentId" clearable placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.url}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单图标地址" :label-width="formLabelWidth">
                    <el-input v-model="systemMenuForm.icon" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addSystemMenuVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitSave('addSystemMenuFormForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--编辑窗口-->
        <el-dialog title="编辑菜单" :before-close="handleClose" :visible.sync="updateSystemMenuVisible"  v-dialogDrag>
            <el-form :model="systemMenuForm" :rules="systemMenuFormRule" ref="updateSystemMenuFormForm">
                <el-form-item label="菜单编码" :label-width="formLabelWidth" prop="menuCode">
                    <el-input v-model="systemMenuForm.menuCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
                    <el-input v-model="systemMenuForm.menuName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="访问路径" :label-width="formLabelWidth" prop="url">
                    <el-input v-model="systemMenuForm.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="父级菜单" :label-width="formLabelWidth" >
<!--                    <el-input v-model="systemMenuForm.parentId" autocomplete="off"></el-input>-->
                    <el-select v-model="systemMenuForm.parentId" filterable clearable placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.url}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单图标地址" :label-width="formLabelWidth">
                    <el-input v-model="systemMenuForm.icon" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateSystemMenuVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUpate('updateSystemMenuFormForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {
        addSystemMenu,
        batchDeleteSystemMenu,
        deleteSystemMenu,
        systemMenuList,
        updateSystemMenu
    } from "../../../api/system/systemMenu";

    export default {
        data(){
            return {
                keyword:"",//搜索栏关键字
                isShowloading:true,//列表加载动画
                addSystemMenuVisible:false,
                updateSystemMenuVisible:false,
                multipleSelection:[],//选择的数据集合
                formLabelWidth:'120px', //弹窗表单宽度
                systemMenus:[],
                systemMenuForm:{},
                systemMenuFormRule:{
                    menuCode: [
                        {required: true, message: "请输入菜单编码", trigger: "blur"}
                    ],
                    menuName: [
                        {required: true, message: "请输入菜单名称", trigger: "blur"}
                    ],
                    url: [
                        {required: true, message: "请输入访问路径", trigger: "blur"}
                    ]
                },
                options:[]
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
                systemMenuList(this.keyword,res=>{
                    this.isShowloading=false;
                    if (res.data.code=='0'){
                        this.systemMenus=res.data.data;
                        this.options=[];
                        for (let elem of this.systemMenus.values()){
                           this.options.push({"label":elem.menuName,"value":elem.id,"url":elem.url})
                        }
                    }
                });
            },
            batchDelete(){
                //批量删除
                if (this.multipleSelection.length>0){
                    let ids=[];
                    for (let elem of this.multipleSelection.values()){
                        ids.push(elem.id)
                    }
                    batchDeleteSystemMenu(ids,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.loadList();
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
            handleClose(done) {
                //添加窗口关闭前表单置空
                this.systemMenuForm={};
                done();
            },
            submitSave(addSystemMenuFormForm) {
                //添加表单提交
                this.$refs[addSystemMenuFormForm].validate((valid)=>{
                    if (!valid){
                        return false;
                    }
                    this.systemMenuForm.menuResource=0;
                    if (this.systemMenuForm.parentId==null||this.systemMenuForm.parentId==""){
                        this.systemMenuForm.parentId='0';
                    }
                   addSystemMenu(this.systemMenuForm,res=>{
                       if (res.data.code=='0'){
                           this.$message({
                               message: res.data.msg,
                               type: 'success'
                           });
                           this.loadList();
                           this.systemMenuForm={};
                           this.addSystemMenuVisible=false;
                       }else{
                           this.$message.error(res.data.msg);
                       }
                   })
                })
            },
            handleEdit(index, row){
                //编辑
                this.systemMenuForm=row;
                this.updateSystemMenuVisible=true;
            },
            submitUpate(updateSystemMenuFormForm) {
                //编辑表单提交
                this.$refs[updateSystemMenuFormForm].validate((valid)=>{
                    if (!valid){
                        return false;
                    }
                    if (this.systemMenuForm.parentId==null||this.systemMenuForm.parentId==""){
                        this.systemMenuForm.parentId='0';
                    }
                    updateSystemMenu(this.systemMenuForm,res=>{
                        if (res.data.code=='0'){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.loadList();
                            this.systemMenuForm={};
                            this.updateSystemMenuVisible=false;
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })

                })
            },
            handleDelete(index, row) {
                //删除
                deleteSystemMenu(row.id,res=>{
                    if (res.data.code=='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
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