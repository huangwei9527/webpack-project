let target = 'http://127.0.0.1:3000';

let proxyTable = {
    '/comments': {
        target: target,
        changeOrigin: true
    }
}

module.exports = proxyTable;
