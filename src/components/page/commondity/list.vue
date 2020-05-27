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
                >批量删除
                </el-button>
                <el-input placeholder="商品名称" class="handle-input mr10"></el-input>
                <el-select v-model="value" placeholder="商品类型" class="mr10">
                    <!--<el-option label="水果" value="shanghai"></el-option>
                    <el-option label="玩物" value="beijing"></el-option>-->
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
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
                <el-table-column
                        prop="itemNo"
                        label="商品编号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="商品名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="commodityType"
                        label="商品类别"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="commodityNumber"
                        label="商品数量"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="商品价格"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="specifications"
                        label="商品规格"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        label="创建日期"
                        width="120">
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
                        layout="prev, pager, next, jumper"
                        :total="this.total"
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
                                action="http://localhost:9000/manager/api/commodity/uploadFile"
                                list-type="picture-card"
                                :multiple="false"
                                :limit="1"
                                accept="image/*"
                                :auto-upload="false"
                                :before-upload="beforeAvatarUpload"
                                :on-remove="handleThumbnailRemove"
                                :on-change="thumbnailFileChange">
                            <i slot="default" class="el-icon-plus"></i>
                            <div slot="file" slot-scope="{file}">
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                                <span class="el-upload-list__item-actions">
                                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleThumbnailRemove(file)">
                                          <i class="el-icon-delete"></i>
                                        </span>
                                </span>
                            </div>
                        </el-upload>
<!--                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>-->
                    </el-form-item>
                    <!--商品详情图-->
                    <el-form-item label="商品详情图" :label-width="formLabelWidth">
                        <el-upload
                                action="#"
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
        addCommodity,
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
                multipleSelection: [],
                commodities: [],//商品列表数据
                searchInfo: "",
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
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }],
                formLabelWidth: "120px",
                value: '',
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
        },
        methods: {
            loadDatas() {
                getCommodityList(this.pageNo, this.pageSize, this.searchInfo, this.commodityType, res => {
                    if (res.data.code == "0") {
                        this.commodities = res.data.data.list;
                        this.pageNo = res.data.data.pageNum;
                        this.pageSize = res.data.data.pageSize;
                        this.total = res.data.data.total;
                    }
                })
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
                        for (let elem of this.detailCommondityForm.galleries.values()){
                            if (elem.fileType=='1'){
                                let thumbnailFileList=[{"name":elem.fileName,"url":elem.watchBaseUrl}];
                                this.detailCommondityForm.thumbnailFileList=thumbnailFileList;
                            }
                            if (elem.fileType=='2'){
                                let detailFileList=[{"name":elem.fileName,"url":elem.watchBaseUrl}];
                                this.detailCommondityForm.detailFileList=detailFileList;
                            }
                        }
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
            beforeAvatarUpload(file) {
                debugger;
                // 文件类型进行判断
                const isJPG = file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 JPG 格式!");

                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                return isLt2M;
                }
                return isLt2M;
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
                    debugger;
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
                    if (valid){
                        console.log(this.addCommondityForm);
                        if (this.thumbnailFile!=undefined&&this.thumbnailFile!=""&&this.files.length>0){
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

                    }else{
                        return false;
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
                        this.addCommondityVisible = false
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
                        console.log("-----:"+this.updateCommondityForm.thumbnailFileList[0].raw);
                        if (this.updateCommondityForm.thumbnailFileList[0].raw!=null){
                            fd.append('thumbnailFile', this.updateCommondityForm.thumbnailFileList[0].raw);
                        }else{
                            console.log("thumbnailFileList:"+this.updateCommondityForm.thumbnailFileList[0]);
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
                                    console.log(this.updateCommondityForm.galleries);
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