import {baseRequest,uploadFile} from "../baseRequest";
import qs from 'qs';

function systemRoleList(pageNo,pageSize,keyword,callback) {
    //获取微信用户列表
    let params={"pageSize":pageSize,"pageIndex":pageNo};
    if (Object.keys(keyword).length>0){
        params.name=keyword;
    }
    let url="/manager/api/sysRole/list";
    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

function addSystemRole(systemRole,callback) {
    let url="/manager/api/sysRole/add";
    baseRequest(url,systemRole,"POST",res=>{
        callback(res);
    })
}

function updateSystemRole(systemRole,callback) {
    let url="/manager/api/sysRole/update";
    baseRequest(url,systemRole,"POST",res=>{
        callback(res);
    })
}

function deleteSystemRole(id,callback) {
    let url="/manager/api/sysRole/delete/"+id;
    baseRequest(url,null,"POST",res=>{
        callback(res);
    })
}

function batchDeleteSystemRole(ids,callback) {
    let url="/manager/api/sysRole/batchDelete";
    let params={"ids":ids};
    params=qs.stringify(params, { arrayFormat: "brackets" });
    baseRequest(url,params,"POST",res=>{
        callback(res);
    })
}

export {systemRoleList,addSystemRole,updateSystemRole,deleteSystemRole,batchDeleteSystemRole}

