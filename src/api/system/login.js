import axios from 'axios';
import qs from 'qs';
import {baseUrl} from '../base';
import {baseRequest} from "../baseRequest";

function login(userName,passWord,callback) {
    let data={"userCode":userName,"password":passWord};
   /* axios.post(baseUrl+"/manager/api/sysUser/login",qs.stringify(data)).then(res=>{
        console.log('res=>',res);
        callback(res);
    })*/
   baseRequest("/manager/api/sysUser/login",data,"POST",res=>{
       callback(res);
    })
}

//对外暴露login方法
export {login};
