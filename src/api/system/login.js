import axios from 'axios';
import qs from 'qs';
import {baseUrl} from '../base';
import da from "element-ui/src/locale/lang/da";

function login(userName,passWord,callback) {
    let data={"userCode":userName,"password":passWord};
    axios.post(baseUrl+"/manager/api/sysUser/login",qs.stringify(data)).then(res=>{
        console.log('res=>',res);
        callback(res);
    })
}

//对外暴露login方法
export {login};
