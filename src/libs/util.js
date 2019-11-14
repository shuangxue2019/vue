let util = {

};

util.title = function (title) {
    title = title ? title + ' - Home' : 'View UI project';
    window.document.title = title;
};

/**
* @param {String} url
* @description 从URL中解析参数
*/
export const getParams = url => {
    const keyValueArr = url.split('?')[1].split('&')
    let paramObj = {}
    keyValueArr.forEach(item => {
        const keyValue = item.split('=')
        paramObj[keyValue[0]] = keyValue[1]
    })
    return paramObj
}

export default util;
