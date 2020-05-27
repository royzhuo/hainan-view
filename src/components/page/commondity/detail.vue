<template>
   <el-dialog :before-close="handleClose" title="商品详情" :visible.sync="dialogDetailVisible"  v-dialog-drag>
       <el-form :model="detailCommondityForm" ref="detailCommondityForm">
           <el-form-item label="商品编号" :label-width="formLabelWidth">
               <el-input v-model="detailCommondityForm.itemNo" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="商品名称" :label-width="formLabelWidth">
               <el-input v-model="detailCommondityForm.name" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="商品类型" :label-width="formLabelWidth" >
               <el-input v-model="detailCommondityForm.commodityType" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="商品数量" :label-width="formLabelWidth">
               <el-input v-model="detailCommondityForm.commodityNumber" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="商品价格" :label-width="formLabelWidth">
               <el-input v-model="detailCommondityForm.price" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="商品规格" :label-width="formLabelWidth">
               <el-input v-model="detailCommondityForm.specifications" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="商品描述" :label-width="formLabelWidth">
               <el-input type="textarea" :autosize="{ minRows: 3}"
                         v-model="detailCommondityForm.description"></el-input>
           </el-form-item>
           <el-form-item label="商品缩略图" :label-width="formLabelWidth">
               <el-upload
                       action="#"
                       list-type="picture-card"
                       :disabled="true"
                       :auto-upload="false"
                       :file-list="detailCommondityForm.thumbnailFileList"
                       >
                   <i class="el-icon-plus"></i>
               </el-upload>
           </el-form-item>
           <el-form-item label="商品详情图片" :label-width="formLabelWidth">
               <el-upload
                       action="#"
                       list-type="picture-card"
                       :auto-upload="false"
                       :disabled="true"
                       :file-list="detailCommondityForm.detailFileList"
               >
                   <i class="el-icon-plus"></i>
               </el-upload>
               <!--<el-dialog :visible.sync="dialogDetailPicVisible" append-to-body>
                   <img width="100%" :src="dialogImageUrl" alt="">
               </el-dialog>-->
           </el-form-item>
       </el-form>
   </el-dialog>
</template>

<script>
    export default {
        data(){
            return{
                // detailCommondityForm:{
                //     itemNo: "",
                //     name: "",
                //     commodityType: "",
                //     commodityNumber: "",
                //     price: "",
                //     specifications: "",
                //     description: ""
                // },
                // dialogDetailVisible:false, //商品详情页
                formLabelWidth: "120px",
                isColse:false,
                src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
            }
        },
        name: "aaaa",
        props: {
            dialogDetailVisible:Boolean,
            detailCommondityForm:Object
        },
        methods:{
            handleClose(done) {
                debugger;
                this.isColse=false;
                this.$emit("getData", this.isColse);
                console.log()
                done();

            }
        }

    }
</script>

<style scoped>

</style>