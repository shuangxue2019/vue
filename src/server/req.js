import axios from './request'

export const req = async payload => {
    let res = await axios.request(payload)
    return res.status == 200 ? res.data : {
        isOk: false,
        message: '请求失败',
        code: 's000009'
    }
}