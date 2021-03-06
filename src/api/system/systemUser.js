import {baseRequest,uploadFile} from "../baseRequest";
import qs from 'qs';

function systemUserList(pageNo,pageSize,keyword,callback) {
    //获取系统用户列表
    let params={"pageSize":pageSize,"pageIndex":pageNo};
    if (Object.keys(keyword).length>0){
        params.name=keyword;
    }
    let url="/manager/api/sysUser/list";
    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

function addSystemUser(systemUser,callback) {
    let url="/manager/api/sysUser/register";
    baseRequest(url,systemUser,"POST",res=>{
        callback(res);
    })
}

function updateSystemUser(systemUser,callback) {
    let url="/manager/api/sysUser/update";
    baseRequest(url,systemUser,"POST",res=>{
        callback(res);
    })
}

function deleteSystemUser(id,callback) {
    let url="/manager/api/sysUser/delete/"+id;
    baseRequest(url,null,"POST",res=>{
        callback(res);
    })
}

function batchDeleteSystemUser(ids,callback) {
    let url="/manager/api/sysUser/batchDelete";
    let params={"ids":ids};
    params=qs.stringify(params, { arrayFormat: "brackets" });
    baseRequest(url,params,"POST",res=>{
        callback(res);
    })
}

function updateSystemUserPassword(oldPassword,newPassword,callback) {
    let params={"oldPassword":oldPassword,"newPassword":newPassword};
    params=qs.stringify(params);
    let url="/manager/api/sysUser/updatePassword";
    baseRequest(url,params,"POST",res=>{
        callback(res);
    })

}

function initPassword(userId,callback) {
    let params={"userId":userId};
    params=qs.stringify(params);
    let url="/manager/api/sysUser/initPassword";
    baseRequest(url,params,"POST",res=>{
        callback(res);
    })

}

export {systemUserList,addSystemUser,updateSystemUser,deleteSystemUser,
    batchDeleteSystemUser,updateSystemUserPassword,initPassword}