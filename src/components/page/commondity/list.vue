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
              >批量删除</el-button>
              <el-input  placeholder="商品名称" class="handle-input mr10"></el-input>
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
              <el-button type="primary"  icon="el-icon-search" >搜索</el-button>
              <el-button type="primary" @click="addCommondityVisible=true" >添加商品</el-button>
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
          <el-dialog title="添加商品" :visible.sync="addCommondityVisible" ref="addCommondityForm" v-dialogDrag>
              <el-form :model="addCommondityForm" :rules="addCommondityRule">
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
                      <el-input type="textarea" :autosize="{ minRows: 3}" v-model="addCommondityForm.description"></el-input>
                  </el-form-item>
                  <el-form-item label="角色名称" :label-width="formLabelWidth" prop="rolename">
                      <el-select v-model="addCommondityForm.itemNo">
                          <el-option label="admin" value="admin"></el-option>
                          <el-option label="管理员" value="管理员"></el-option>
                          <el-option label="超级管理员" value="超级管理员"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="状态" :label-width="formLabelWidth">
                      <el-radio v-model="addCommondityForm.isable" label="1">正常</el-radio>
                      <el-radio v-model="addCommondityForm.isable" label="0">禁用</el-radio>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="addCommondityVisible = false">取 消</el-button>
                  <el-button type="primary" @click="">确 定</el-button>
              </div>
          </el-dialog>
      </div>
  </div>
</template>
<script>
    import {getCommodityList} from "../../../api/commodity/commodity";
    export default {
        data() {
            return {
                isShowloading: false,
                multipleSelection: [],
                commodities: [],//商品列表数据
                searchInfo:"",
                commodityType:"",
                pageNo: 1,
                pageSize: 10,
                total:0,
                addCommondityVisible:false,//新建用户窗口
                addCommondityForm:{
                    itemNo:"",
                    name:"",
                    commodityType:"",
                    commodityNumber:"",
                    price:"",
                    specifications:"",
                    description:"",
                    isable: "0"
                },
                addCommondityRule: {
                    itemNo: [
                        { required: true, message: "请输入商品编号", trigger: "blur" }
                    ],
                    name: [
                        { required: true, message: "请输入商品名称", trigger: "blur" }
                    ],
                    commodityType: [
                        { required: true, message: "请输入商品类型", trigger: "blur" }
                    ],
                    commodityNumber: [
                        { required: true, message: "请输入商品数量", trigger: "blur" }
                    ],
                    price: [
                        { required: true, message: "请输入商品价格", trigger: "blur" }
                    ],
                    specifications: [
                        { required: true, message: "请输入商品规格", trigger: "blur" }
                    ],
                    description: [
                        { required: true, message: "请输入商品描述", trigger: "blur" }
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
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                formLabelWidth: "120px",
                value: ''
            }
        },
        created() {
            this.loadDatas();
        },
        methods:{
            loadDatas(){
                getCommodityList(this.pageNo,this.pageSize,this.searchInfo,this.commodityType,res=>{
                    if (res.data.code=="0"){
                        this.commodities=res.data.data.list;
                        this.pageNo=res.data.data.pageNum;
                        this.pageSize=res.data.data.pageSize;
                        this.total=res.data.data.total;
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleDetail(index, row){},
            handleEdit(index, row){},
            handleDelete(index, row){},
            handleSizeChange(val){
                //pageSize 改变时会触发
                this.pageSize=val;
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val){
                //currentPage 改变时会触发
                debugger;
                this.pageNo=val;
                this.loadDatas();
                console.log(`当前页: ${val}`);
            }
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