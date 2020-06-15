import {baseRequest} from "../baseRequest";
import qs from 'qs';


function systemMenuPermissionList(pageNo,pageSize,keyword,menuId,callback) {
    //获取微信用户列表
    let params={"pageSize":pageSize,"pageIndex":pageNo,"menuId":menuId};
    if (Object.keys(keyword).length>0){
        params.name=keyword;
    }
    let url="/manager/api/systemMenuPermission/list";
    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

function addSystemMenuPermission(systemMenuPermission,callback) {
    let url="/manager/api/systemMenuPermission/add";
    baseRequest(url,systemMenuPermission,"POST",res=>{
        callback(res);
    })
}

function updateSystemMenuPermission(systemMenuPermission,callback) {
    let url="/manager/api/systemMenuPermission/update";
    baseRequest(url,systemMenuPermission,"POST",res=>{
        callback(res);
    })
}

function deleteSystemMenuPermission(id,callback) {
    let url="/manager/api/systemMenuPermission/delete/"+id;
    baseRequest(url,null,"POST",res=>{
        callback(res);
    })
}

function batchDeleteSystemMenuPermission(ids,callback) {
    let url="/manager/api/systemMenuPermission/batchDelete";
    let params={"ids":ids};
    params=qs.stringify(params, { arrayFormat: "brackets" });
    baseRequest(url,params,"POST",res=>{
        callback(res);
    })
}

export {systemMenuPermissionList,addSystemMenuPermission,updateSystemMenuPermission,deleteSystemMenuPermission,batchDeleteSystemMenuPermission}