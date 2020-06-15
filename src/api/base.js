export const baseUrl = process.env.NODE_ENV === 'production'?'http://47.104.176.42:9100':'http://localhost:9000'

import { Loading } from 'element-ui';

let loaddingObj=null;
function startLoading(text) {
    loaddingObj=Loading.service({
        lock: true,
        text: text+'.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
}

function closeLoading() {
    loaddingObj.close();
}

export {startLoading,closeLoading}
