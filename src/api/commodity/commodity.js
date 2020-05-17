import {baseRequest} from "../baseRequest";

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

export {getCommodityList};