import {baseRequest,uploadFile} from "../baseRequest";
import qs from 'qs';

function getOpenUserList(pageNo,pageSize,keyword,callback) {
    //获取微信用户列表
    let params={"pageSize":pageSize,"pageIndex":pageNo};
    if (Object.keys(keyword).length>0){
        params.name=keyword;
    }
    let url="/openUser/list";
    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

function getOpenUserBirthdayList(pageNo,pageSize,keyword,futureDayNum,callback) {
    //获取微信用户列表
    let params={"pageSize":pageSize,"pageIndex":pageNo,"futureDayNum":futureDayNum};
    if (Object.keys(keyword).length>0){
        params.keyword=keyword;
    }
    let url="/openUser/listFutureBirthdays";
    baseRequest(url,params,"GET",res=>{
        callback(res);
    })
}

function upateOpenUser(param,callback) {
    //编辑用户
    let url="/openUser/update";
    baseRequest(url,param,"POST",res=>{
        callback(res);
    })
}

function deleteOpenUserById(id,callback) {
    //删除用户
    let url="/openUser/delete/"+id;
    baseRequest(url,id,"POST",res=>{
        callback(res);
    })
}

function batchDeleteOpenUsers(ids,callback) {
    //批量删除用户
    let url="/openUser/batchDelete";
    let params={"ids":ids};
    params=qs.stringify(params, { arrayFormat: "brackets" });
    baseRequest(url,params,"POST",res=>{
        callback(res);
    })

}

export {getOpenUserList,upateOpenUser,deleteOpenUserById,batchDeleteOpenUsers,getOpenUserBirthdayList}