import {baseRequest,uploadFile} from "../baseRequest";
import qs from 'qs';

function systemMenuList(keyword,callback) {
    //获取系统菜单列表
    let params={};
    if (Object.keys(keyword).length>0){
        params.name=keyword;
    }
    let url="/manager/api/systemMenu/list";
    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

function addSystemMenu(systemMenu,callback) {
    let url="/manager/api/systemMenu/add";
    baseRequest(url,systemMenu,"POST",res=>{
        callback(res);
    })
}

function updateSystemMenu(systemMenu,callback) {
    let url="/manager/api/systemMenu/update";
    baseRequest(url,systemMenu,"POST",res=>{
        callback(res);
    })
}

function deleteSystemMenu(id,callback) {
    let url="/manager/api/systemMenu/delete/"+id;
    baseRequest(url,null,"POST",res=>{
        callback(res);
    })
}

function batchDeleteSystemMenu(ids,callback) {
    let url="/manager/api/systemMenu/batchDelete";
    let params={"ids":ids};
    params=qs.stringify(params, { arrayFormat: "brackets" });
    baseRequest(url,params,"POST",res=>{
        callback(res);
    })
}

export {systemMenuList,addSystemMenu,batchDeleteSystemMenu,deleteSystemMenu,updateSystemMenu}