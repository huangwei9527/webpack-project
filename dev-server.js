const express = require('express');

const opn = require('opn')
const webpack = require('webpack');
var proxyMiddleware = require('http-proxy-middleware')


const app = express();
webpackConfig = require('./webpack.config.local');

webpackConfig.entry['common'].push('./dev-client.js');
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());



let compiler = webpack(webpackConfig);



var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	quiet: true
});
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	log: () => {},
	heartbeat: 2000
});
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		hotMiddleware.publish({ action: 'reload' });
		cb()
	})
});


var proxyTable = require('./proxyTable');

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
});



// serve webpack bundle output
app.use(devMiddleware);
// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

app.use('/',express.static('./product-local/'));


console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    // console.log('> Listening at ' + uri + '\n');
    // when env is testing, don't need open it
    opn('http://localhost:8088')
});

var server = app.listen(8088);
