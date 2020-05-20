import {baseUrl} from "./base";
import axios from "axios";
import qs from "qs";
import router from '../router'
import { Message } from 'element-ui';


///配置axios请求头，axios每次发起请求携带token，在Network中的headers看的到
axios.interceptors.request.use(config=>{
    let token=localStorage.getItem("token");
    if (token!=null){
        config.headers.Authorization = token;
    }
    return config;
});

function baseRequest(interfaceUrl,param,method,callback) {
    axiosBaseRequest(interfaceUrl,param,method,res=>{
        if (res.data==""||res.data.code=='5002'||res.data.code=='5003'||res.data.code=="401"){
            if (res.data!=""){
                Message.error(res.data.msg);
            }
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
            router.push('/login');
        }else{
            callback(res);
        }
    })
}

function uploadFile(interfaceUrl,param,method,config,callback) {
    if (!param instanceof FormData){
        param=qs.stringify(param)
    }
    axios.post(baseUrl+interfaceUrl,param,config).then(res=>{
        if (res.data==""||res.data.code=='5002'||res.data.code=='5003'||res.data.code=="401"){
            if (res.data!=""){
                Message.error(res.data.msg);
            }
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
            router.push('/login');
        }else{
            callback(res);
        }
    })
}

function axiosBaseRequest(interfaceUrl,param,method,callback) {
    if (method=="POST"){
/*        if (!param instanceof FormData){
            param=qs.stringify(param)
        }*/
        axios.post(baseUrl+interfaceUrl,param).then(res=>{
            callback(res);
        })
    }
    if (method=="GET"){
        axios.get(baseUrl+interfaceUrl,{params:param}).then(res=>{
            callback(res);
        })
    }
}


export {baseRequest,uploadFile}