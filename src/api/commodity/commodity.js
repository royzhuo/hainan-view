import {baseRequest,uploadFile} from "../baseRequest";

function getCommodityList(pageNo,pageSize,name,commodityType,callback) {
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
    let url="/manager/api/commodity/add";
    baseRequest(url,param,"POST",res=>{
        callback(res);
    })
}

function uploadThumbnailFile(param,callback) {
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

export {getCommodityList,uploadThumbnailFile,addCommodity};