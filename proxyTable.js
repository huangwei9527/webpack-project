let target = 'http://119.254.226.115';

let proxyTable = {
    '/sysNoticeAction!getNoticeList.action': {
        target: target,
        changeOrigin: true
    }
};

module.exports = proxyTable;
