<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>微信用户生日</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-input placeholder="用户名称" v-model="keyword" class="handle-input mr10"></el-input>
                <el-select v-model="searchDays" placeholder="选择近日天数" class="mr10">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="searchUsers" icon="el-icon-search">搜索</el-button>
            </div>
            <!--列表-->
            <el-table
                    ref="multipleTable"
                    tooltip-effect="dark"
                    :data="openUsers"
                    style="width: 100%"
                    v-loading="isShowloading"
                    border
            >
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
        </div>
    </div>
</template>

<script>

    import {
        getOpenUserBirthdayList
    } from "../../../api/openUser/openUser";

    export default {
        data(){
            return {
                keyword:"", //关键字
                openUsers:[], //列表数据
                isShowloading:true, //表格是否需要加载
                total:0, //数据总数
                pageSize:10, //当前页数
                pageNo:1, //当前页
                formLabelWidth:'120px',
                searchDays:'7',
                options: [{
                    value: '3',
                    label: '3天'
                }, {
                    value: '7',
                    label: '7天'
                }, {
                    value: '10',
                    label: '10天'
                }, {
                    value: '15',
                    label: '15天'
                }]
            }
        },
        created() {
            this.loadUserList();
        },
        methods:{
            loadUserList(){
                //加载列表数据
                getOpenUserBirthdayList(this.pageNo,this.pageSize,this.keyword,this.searchDays,res=>{
                    this.isShowloading=false;
                    if (res.data.code=="0"){
                        this.openUsers=res.data.data.list;
                        this.pageNo = res.data.data.pageNum;
                        this.pageSize = res.data.data.pageSize;
                        this.total = res.data.data.total;
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