
import toolBar from './components/toolBar'
import toolButton from './components/toolButton'
import vspin from './components/vspin'

const Components = {
    toolBar,
    toolButton,
    vspin,
}

const install = function (Vue) {
    if (install.installed) return;

    Object.keys(Components).forEach(key => {
        Vue.component(key, Components[key]);
    });

    Vue.prototype.$u = {
        // 消息
        msg: {
            info: function (v, message) {
                v.$Message.info({
                    background: true,
                    content: message
                })
            },
            error: function (v, message) {
                v.$Message.error({
                    background: true,
                    content: message
                })
            },
            warning: function (v, message) {
                v.$Message.warning({
                    background: true,
                    content: message
                })
            },
            success: function (v, message) {
                v.$Message.success({
                    background: true,
                    content: message
                })
            },
            problem: function (v, message) {
                this.error(v, `${message || '服务器异常'}(0000000)`)
            }
        },
        // 返回消息
        resMsg: function (v, res, err) {
            if (err) {
                this.msg.error(v, `${res.message}(${res.code})`)
            } else {
                if (res.isOk) {
                    if (res.message) this.msg.success(v, res.message)
                } else {
                    this.msg.error(v, `${res.message}(${res.code})`)
                }
            }
        },
        // 调用返回方法
        resCall: function (v, res, success, error) {
            if (res.isOk) {
                if (success) {
                    success(res);
                }
            } else {
                if (error) {
                    error(res);
                }
            }
            this.resMsg(v, res);
        },
        // 调用返回方法，简洁版
        call: function (v, fun, opts) {
            if (opts && opts.start) {
                opts.start();
            }
            let obj = {
                success: null,
                error: null
            };
            const res = fun(obj);
            res.then(r => {
                if (r.isOk) {
                    if (obj.success) {
                        obj.success(r);
                    }
                } else {
                    if (obj.error) {
                        obj.error(r);
                    }
                }
                this.resMsg(v, r);
            }).catch(e => {
                this.msg.problem(v, e)
            }).then(() => {
                if (opts && opts.end) {
                    opts.end();
                }
            })
        }
    };
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install
}