import {baseRequest,uploadFile} from "../baseRequest";

function getCommodityList(pageNo,pageSize,name,commodityType,callback) {
    //获取商品列表
    let params={"pageSize":pageSize,"pageIndex":pageNo};
    if (Object.keys(name).length>0){
        params.name=name;
    }
    if (Object.keys(commodityType).length>0){
        params.commodityType=commodityType;
    }
    let url="/manager/api/commodity/list";
    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

function addCommodity(param,callback) {
    //添加商品
    let url="/manager/api/commodity/add";
    baseRequest(url,param,"POST",res=>{
        callback(res);
    })
}

function updateCommodity(param,callback) {
    //编辑商品
    let url="/manager/api/commodity/update";
    baseRequest(url,param,"POST",res=>{
        callback(res);
    })
}

function detailById(id,callback) {
    //根据id获取详情
    let url="/manager/api/commodity/"+id;
    baseRequest(url,null,"GET",res=>{
        callback(res);
    })
}

function uploadThumbnailFile(param,callback) {
    //上传图片（缩略图和详情图片）
    let url="/manager/api/commodity/uploadFile";
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    uploadFile(url,param,"POST",config,res=>{
        callback(res);
    })
}

export {getCommodityList,uploadThumbnailFile,addCommodity,detailById,updateCommodity};