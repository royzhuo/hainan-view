<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
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
                <el-input placeholder="商品名称" v-model="keyword" class="handle-input mr10"></el-input>
                <el-select v-model="value" placeholder="商品类型" class="mr10">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="searchInfo" icon="el-icon-search">搜索</el-button>
                <el-button type="primary" @click="addCommondityVisible=true">添加商品</el-button>
            </div>
            <!--列表-->
            <el-table
                    ref="multipleTable"
                    tooltip-effect="dark"
                    :data="commodities"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="isShowloading"
                    border
            >
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column label="商品缩撸图" align="center">
                    　　<template slot-scope="scope">
                    　　　　<img :src="scope.row.watchBaseUrl" width="100%" height="50" class="head_pic"/>
                    　　</template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="itemNo"
                        label="商品编号"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="name"
                        label="商品名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="commodityType"
                        label="商品类别"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="commodityNumber"
                        label="商品数量"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="price"
                        label="商品价格"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="specifications"
                        label="商品规格"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createTime"
                        label="创建日期"
                       >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                icon="el-icon-view"
                                circle
                                @click="handleDetail(scope.$index, scope.row)"
                        ></el-button>
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
            <el-dialog title="添加商品" :visible.sync="addCommondityVisible"  v-dialogDrag>
                <el-form :model="addCommondityForm" :rules="addCommondityRule" ref="addCommondityForm">
                    <el-form-item label="商品编号" :label-width="formLabelWidth" prop="itemNo">
                        <el-input v-model="addCommondityForm.itemNo" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="addCommondityForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品类型" :label-width="formLabelWidth" prop="commodityType">
                        <el-input v-model="addCommondityForm.commodityType" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" :label-width="formLabelWidth">
                        <el-input v-model="addCommondityForm.commodityNumber" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" :label-width="formLabelWidth">
                        <el-input v-model="addCommondityForm.price" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品规格" :label-width="formLabelWidth">
                        <el-input v-model="addCommondityForm.specifications" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品描述" :label-width="formLabelWidth">
                        <el-input type="textarea" :autosize="{ minRows: 3}"
                                  v-model="addCommondityForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="商品缩略图" ref="uploadThumbnailFileRef" :label-width="formLabelWidth" prop="thumbnailFile">
                        <el-upload
                                ref="addThumbnailUpload"
                                action="http://localhost:9000/manager/api/commodity/uploadFile"
                                list-type="picture-card"
                                :multiple="false"
                                :limit="1"
                                accept="image/*"
                                :auto-upload="false"
                                :on-remove="handleThumbnailRemove"
                                :on-change="thumbnailFileChange">
                            <i slot="default" class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <!--商品详情图-->
                    <el-form-item label="商品详情图" :label-width="formLabelWidth">
                        <el-upload
                                action="#"
                                ref="addDetailFileUpload"
                                list-type="picture-card"
                                :auto-upload="false"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleDetailPicRemove"
                                :on-change="detailPicChange"
                               >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogDetailPicVisible" append-to-body>
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addCommondityVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitUpload('addCommondityForm')">确 定</el-button>
                </div>
            </el-dialog>
            <!--查看详情-->
            <Detail @getData="getData" :dialog-detail-visible="dialogDetailPicVisible" :detail-commondity-form="detailCommondityForm"></Detail>
            <!--编辑窗口-->
            <el-dialog title="编辑商品" :visible.sync="updateCommondityVisible" :close-on-click-modal="false"  v-dialogDrag>
                <el-form :model="updateCommondityForm" :rules="addCommondityRule" ref="updateCommondityForm">
                    <el-form-item label="商品编号" :label-width="formLabelWidth" prop="itemNo">
                        <el-input v-model="updateCommondityForm.itemNo" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="updateCommondityForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品类型" :label-width="formLabelWidth" prop="commodityType">
                        <el-input v-model="updateCommondityForm.commodityType" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" :label-width="formLabelWidth">
                        <el-input v-model="updateCommondityForm.commodityNumber" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" :label-width="formLabelWidth">
                        <el-input v-model="updateCommondityForm.price" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品规格" :label-width="formLabelWidth">
                        <el-input v-model="updateCommondityForm.specifications" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品描述" :label-width="formLabelWidth">
                        <el-input type="textarea" :autosize="{ minRows: 3}"
                                  v-model="updateCommondityForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="商品缩略图" :label-width="formLabelWidth" prop="thumbnailFile">
                        <el-upload
                                action="#"
                                list-type="picture-card"
                                :multiple="false"
                                :limit="1"
                                accept="image/*"
                                :auto-upload="false"
                                :file-list="updateCommondityForm.thumbnailFileList"
                                :on-remove="handleThumbnailRemove"
                                :on-change="thumbnailFileChange">
                            <i slot="default" class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="商品详情图" :label-width="formLabelWidth">
                        <el-upload
                                action="#"
                                list-type="picture-card"
                                :auto-upload="false"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleDetailPicRemove"
                                :on-change="detailPicChange"
                                :file-list="updateCommondityForm.detailFileList"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogDetailPicVisible" append-to-body>
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="updateCommondityVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateCommondity('updateCommondityForm')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {
        addCommodity, batchDelete, commondityTypes, deleteCommodity,
        detailById,
        getCommodityList,
        updateCommodity,
        uploadThumbnailFile
    } from "../../../api/commodity/commodity";
    import detail from "./detail";

    export default {
        data() {
            return {
                isShowloading: false,
                multipleSelection: [],//已选择的列表对象列表对象
                commodities: [],//商品列表数据
                keyword: "",//搜索框关键字
                commodityType: "",
                pageNo: 1,
                pageSize: 10,
                total: 0,
                addCommondityVisible: false,//新建用户窗口
                addCommondityForm: {
                    itemNo: "",
                    name: "",
                    commodityType: "",
                    commodityNumber: "",
                    price: "",
                    specifications: "",
                    description: ""
                },//添加商品模型
                updateCommondityForm:{},//编辑商品模型
                addCommondityRule: {
                    itemNo: [
                        {required: true, message: "请输入商品编号", trigger: "blur"}
                    ],
                    name: [
                        {required: true, message: "请输入商品名称", trigger: "blur"}
                    ],
                    commodityType: [
                        {required: true, message: "请输入商品类型", trigger: "blur"}
                    ],
                    commodityNumber: [
                        {required: true, message: "请输入商品数量", trigger: "blur"}
                    ],
                    price: [
                        {required: true, message: "请输入商品价格", trigger: "blur"}
                    ],
                    specifications: [
                        {required: true, message: "请输入商品规格", trigger: "blur"}
                    ],
                    description: [
                        {required: true, message: "请输入商品描述", trigger: "blur"}
                    ],
                    thumbnailFile: [
                        {required: true, message: "请上传缩略图", trigger: "blur"}
                    ]
                },
                options: [],
                formLabelWidth: "120px",
                value: '',//商品类型下拉框值
                thumbnailFile:"",//缩略图
                dialogImageUrl: '',//图片详情弹窗
                files:[],
                dialogVisible: false,
                dialogDetailPicVisible: false,//商品详情图片遮罩
                disabled: false,
                detailCommondityForm:{
                    itemNo: "",
                    name: "",
                    commodityType: "",
                    commodityNumber: "",
                    price: "",
                    specifications: "",
                    description: ""
                },
                dialogDetailVisible:false,
                updateCommondityVisible:false //编辑窗口

            }
        },
        created() {
            this.loadDatas();
            this.commodityTypes();
        },
        methods: {
            loadDatas() {
                //商品列表加载
                console.log("商品类型值:"+this.value);
                getCommodityList(this.pageNo, this.pageSize, this.keyword, this.value, res => {
                    if (res.data.code == "0") {
                        this.commodities = res.data.data.list;
                        this.pageNo = res.data.data.pageNum;
                        this.pageSize = res.data.data.pageSize;
                        this.total = res.data.data.total;
                    }
                })
            },
            commodityTypes(){
                //商品类型下拉框
              commondityTypes(res=>{
                  let initOption={"value":"all","label":"全部"};
                  this.options.push(initOption);
                  if (res.data.code=='0'){
                      for (let elem of res.data.data.values()){
                          let subOption={"value":elem,"label":elem};
                          this.options.push(subOption);
                      }
                  }
              })
            },
            searchInfo(){
               this.loadDatas();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleDetail(index, row) {
                //商品详情
                detailById(row.id,res=>{
                    this.detailCommondityForm=res.data.data;
                    this.dialogDetailPicVisible=true;
                    if (this.detailCommondityForm.galleries!=null&&this.detailCommondityForm.galleries.length>0){
                        let detailFileList=[];
                        for (let elem of this.detailCommondityForm.galleries.values()){
                            if (elem.fileType=='1'){
                                let thumbnailFileList=[{"name":elem.fileName,"url":elem.watchBaseUrl}];
                                this.detailCommondityForm.thumbnailFileList=thumbnailFileList;
                            }
                            if (elem.fileType=='2'){
                                let detailFile={"name":elem.fileName,"url":elem.watchBaseUrl,"id":elem.id};
                                detailFileList.push(detailFile);
                            }
                        }
                        this.detailCommondityForm.detailFileList=detailFileList;
                    }
                })

            },
            getData(data){
               //this.dialogDetailPicVisible=data;
                this.dialogDetailPicVisible=false;
            },
            handleEdit(index, row) {
                //商品编辑
                this.updateCommondityVisible=true;
                detailById(row.id,res=>{
                    this.updateCommondityForm=res.data.data;
                    if (this.updateCommondityForm.galleries!=null&&this.updateCommondityForm.galleries.length>0){
                        let detailFileList=[];
                        for (let elem of this.updateCommondityForm.galleries.values()){
                            if (elem.fileType=='1'){
                                let thumbnailFileList=[{"name":elem.fileName,"url":elem.watchBaseUrl,"id":elem.id}];
                                this.updateCommondityForm.thumbnailFileList=thumbnailFileList;
                            }
                            if (elem.fileType=='2'){
                                let detailFile={"name":elem.fileName,"url":elem.watchBaseUrl,"id":elem.id};
                                detailFileList.push(detailFile);
                            }
                        }
                        this.updateCommondityForm.detailFileList=detailFileList;
                    }
                })

            },
            handleDelete(index, row) {
                //删除商品
                deleteCommodity(row.id,res=>{
                    if (res.data.code=='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.loadDatas();
                    }else{
                        this.$message.error(res.data.msg);
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
                    batchDelete(ids,res=>{
                        debugger;
                        if (res.data.code=='0'){
                            this.loadDatas();
                            this.commodityTypes();
                            this.multipleSelection=[];
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
                debugger;
                this.pageNo = val;
                this.loadDatas();
                console.log(`当前页: ${val}`);
            },
            handlePictureCardPreview(file){
                //放大查看详情图片
                this.dialogImageUrl = file.url;
                this.dialogDetailPicVisible = true;
            },
            handleThumbnailRemove(file, fileList) {
                //缩略图片删除
                if(this.updateCommondityForm!=null&&this.updateCommondityForm.id!=null){
                    //编辑页面
                    this.updateCommondityForm.thumbnailFileList=fileList;
                }else{
                    //添加页面
                    this.thumbnailFile='';
                }

            },
            handleDetailPicRemove(file, fileList) {
                //详情图片删除
                if(this.updateCommondityForm!=null&&this.updateCommondityForm.id!=null){
                    //编辑页面
                    this.updateCommondityForm.detailFileList=fileList;
                }else{
                    //添加页面
                    this.files=fileList;

                }
            },
            thumbnailFileChange(file,fileList){
                //选择缩略图
                if(this.updateCommondityForm!=null&&this.updateCommondityForm.id!=null){
                    //编辑页面
                    this.updateCommondityForm.thumbnailFileList=fileList;
                    this.$refs.updateCommondityForm.clearValidate();//关闭校验
                }else{
                    //添加页面
                    this.thumbnailFile=file.raw;
                    this.$refs.addCommondityForm.clearValidate();//关闭校验
                }


            },
            detailPicChange(file, fileList){
                //选择详情图片
                if(this.updateCommondityForm!=null&&this.updateCommondityForm.id!=null){
                    //编辑页面
                    this.updateCommondityForm.detailFileList=fileList;
                }else{
                    //添加页面
                    this.files=fileList;

                }
            },
            submitUpload(addCommondityForm) {
                //添加表单提交===先上传图片
                this.$refs[addCommondityForm].validate((valid)=>{
                    if (this.thumbnailFile!=null&&this.thumbnailFile!=""&&this.addCommondityForm.itemNo!=''&&
                        this.addCommondityForm.name!=""&&this.addCommondityForm.commodityType!=""){
                        this.$refs.addCommondityForm.clearValidate();//关闭校验
                    }else{
                        return false;
                    }
                    if ((this.thumbnailFile!=undefined&&this.thumbnailFile!="")||this.files.length>0){
                        const fd = new FormData();
                        fd.append('thumbnailFile', this.thumbnailFile);
                        if (this.files.length>0){
                            for (let elem of this.files.values()){
                                fd.append("files",elem.raw,elem.raw.name);
                            }
                        }
                        uploadThumbnailFile(fd,res=>{
                            if (res.data.code=="0"){
                                let galleries=res.data.data;
                                this.addCommondityForm.galleries=galleries;
                                this.submitCommodityForm(this.addCommondityForm)
                            }
                        });
                    }else{
                        this.submitCommodityForm(this.addCommondityForm)
                    }
                })
            },
            submitCommodityForm(addCommondityForm){
                //提交添加表单
                addCommodity(addCommondityForm,res=>{
                    if (res.data.code=='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.loadDatas();
                        this.commodityTypes();
                        this.addCommondityVisible = false;
                        this.thumbnailFile={};
                        this.files=[];
                        this.addCommondityForm={};
                        this.$refs['addThumbnailUpload'].clearFiles();
                        this.$refs['addDetailFileUpload'].clearFiles();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            updateCommondity(updateCommondityForm){
                //编辑表单提交
                this.$refs[updateCommondityForm].validate((valid)=>{
                    if (!valid){
                        if (this.updateCommondityForm.thumbnailFileList!=null&&this.updateCommondityForm.itemNo!=''&&
                            this.updateCommondityForm.name!=""&&this.updateCommondityForm.commodityType!=""){
                            this.$refs.updateCommondityForm.clearValidate();//关闭校验
                        }else{
                            return false;
                        }
                    }
                    let localGalleries=[];
                    if (this.updateCommondityForm.thumbnailFileList!=null&&this.updateCommondityForm.detailFileList.length>0){
                        const fd = new FormData();
                        if (this.updateCommondityForm.thumbnailFileList[0].raw!=null){
                            fd.append('thumbnailFile', this.updateCommondityForm.thumbnailFileList[0].raw);
                        }else{
                            localGalleries.push(this.updateCommondityForm.thumbnailFileList[0]);
                        }
                        if (this.updateCommondityForm.detailFileList.length>0){
                            for (let elem of this.updateCommondityForm.detailFileList.values()){
                                if (elem.raw!=undefined){
                                    fd.append("files",elem.raw,elem.raw.name);
                                }else{
                                    localGalleries.push(elem);
                                }
                            }
                        }
                        if (fd.get("thumbnailFile")==null&&fd.get("files")==null){
                            this.commiteUpdateCommodityForm(this.updateCommondityForm)
                        }else{
                            uploadThumbnailFile(fd,res=>{
                                if (res.data.code=="0"){
                                    for (let elem of res.data.data.values()){
                                        let detailFile=elem;
                                        detailFile.commodityId=this.updateCommondityForm.id;
                                        localGalleries.push(detailFile)
                                    }
                                    this.updateCommondityForm.galleries=localGalleries;
                                    this.commiteUpdateCommodityForm(this.updateCommondityForm)
                                }
                            });
                        }
                    }else{
                        this.commiteUpdateCommodityForm(this.updateCommondityForm)
                    }
                })
            },
            commiteUpdateCommodityForm(updateCommondityForm){
                //表单提交
                updateCommodity(updateCommondityForm,res=>{
                    if (res.data.code=='0'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.loadDatas();
                        this.commodityTypes();
                        this.updateCommondityVisible = false
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            }
        },
        components:{
            "Detail":detail
        }
    };

</script>

<style scoped>

</style>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .pagination {
        margin: 20px 0;
        text-align: right;
    }


    .mr10 {
        margin-right: 10px;
    }
</style>