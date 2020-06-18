import {baseRequest,uploadFile} from "../baseRequest";
import qs from 'qs';
import ca from "element-ui/src/locale/lang/ca";

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

function menuAuthorization(menuIds,roleId,callback) {
    let url="/manager/api/systemMenuPermission/menuAuthorization";
    let params={"roleId":roleId};
    params.menuIds=menuIds;
    params=qs.stringify(params, { arrayFormat: "brackets" });

    baseRequest(url,params,"POST",res=>{
        callback(res);
    })
}

function listMenuByRole(roleId,callback) {
    let url="/manager/api/systemMenu/listMenuByRole";
    let params={"roleId":roleId};
    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

function listSystemUsers(callback) {
    let url="/manager/api/systemMenuPermission/systemUserList";
    baseRequest(url,null,"GET",res=>{
        callback(res);
    })
}

function userAuthorization(userIds,roleId,callback) {
    //在该角色下添加用户
    let url="/manager/api/systemMenuPermission/userAuthorization";
    let params={"roleId":roleId};
    params.userIds=userIds;
    params=qs.stringify(params, { arrayFormat: "brackets" });

    baseRequest(url,params,"POST",res=>{
        callback(res);
    })
}
function authorizationSystemUserList(roleId,callback) {
    //获取已授权的用户列表
    let url="/manager/api/systemMenuPermission/authorizationSystemUserList";
    let params={"roleId":roleId};

    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

export {systemRoleList,addSystemRole,updateSystemRole,deleteSystemRole,batchDeleteSystemRole,menuAuthorization,
    listMenuByRole,listSystemUsers,userAuthorization,authorizationSystemUserList}

