const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const MyReplaceLoaderPlugin = require('./my-replace-loader');



//可以设置html中要替换的字符串
let replaceOtions = {
	"%staticResource%" : "/static/"
}

var exports = {
	devtool: "source-map",    //生成sourcemap,便于开发调试
	entry:{
		'common':['es5-shim','es5-shim/es5-sham','./src/common/index.js']
	},
	output:{
		path:path.resolve(__dirname,'product-local'),
        publicPath:'/',
		filename:'static/[name].js'
	},
	module:{
		loaders:[
			{
				test:/\.(html)$/,
				exclude:[path.resolve(__dirname,'src/pages')],
				loader:"html-loader"
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use:[
					{loader: 'babel-loader'}
				]
			},
			{
				test: /\.js$/,
				enforce: 'post', // post-loader处理
				exclude: /node_modules/,
				use:[
					{loader: 'es3ify-loader'}
				]
			},
			{
				test: /\.css$/,
				include:[path.resolve(__dirname,'src/components')],
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: 'css-loader',
							// options:{
							//     minimize: !outputConfig.IS_DEBUG //css压缩
							// }
						},
						{
							loader: 'postcss-loader',
							options:{
								plugins:function(){
									return [
										require('postcss-import')(),        //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
										require("autoprefixer")({browsers:['ie>=8','>1% in CN']})
									]
								}
							}
						}
					]
				})
			},
			{
				test:/\.(scss)$/,
				include:[path.resolve(__dirname,'src/components')],
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: 'css-loader',
							// options:{
							//     minimize: !outputConfig.IS_DEBUG //css压缩
							// }
						},
						{
							loader: 'postcss-loader',
							options:{
								plugins:function(){
									return [
										require('postcss-import')(),        //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
										require("autoprefixer")({browsers:['ie>=8','>1% in CN']})
									]
								}
							}
						},
						{loader:'sass-loader'}
					]
				})
			},
			{
				test: /\.css$/,
				include:[path.resolve(__dirname,'src/common')],
				use: [
					{loader: 'style-loader'},
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
						options:{
							plugins:function(){
								return [
									require('postcss-import')(),        //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
									require("autoprefixer")({browsers:['ie>=8','>1% in CN']})
								]
							}
						}
					}
				]
			},
			{
				test:/\.(scss)$/,
				include:[path.resolve(__dirname,'src/common')],
				use: [
					{loader: 'style-loader'},
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
						options:{
							plugins:function(){
								return [
									require('postcss-import')(),        //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
									require("autoprefixer")({browsers:['ie>=8','>1% in CN']})
								]
							}
						}
					},
					{loader: 'sass-loader'}
				]
			},
			{
				test:/\.(jpe?g|png|gif)$/i,
				include:[path.resolve(__dirname,'src/common'),path.resolve(__dirname,'src/components')],
				loader:'url-loader?hash=sha512&digest=hex&limit=5&name=static/common/images/[name][hash].[ext]'
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg)$/,
				loader: 'url?limit=10240&name=static/common/fonts/[name].[ext]'
			}
		]
	},
    externals : {
		$: "jquery",
		"window.jQuery": "jquery"
    },
	resolve : {
		alias : {
			node_modules	: __dirname + '/node_modules',
			pages			: __dirname + '/src/pages',
			components		: __dirname + '/src/components',
			common			: __dirname + '/src/common'
		}
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
        	name:'common',
        	filename:'static/common/js/base.js'
        }),
		// new webpack.HotModuleReplacementPlugin(),
		// new ExtractTextPlugin("static/[name].css"),
        new ExtractTextPlugin({
            filename:  (getPath) => {
                let filePath = getPath("static/[name].css").split('/');
                let last = filePath.pop();
                last = filePath.length>1?(last):(last.split('.')[0]+'/css/'+last);
                filePath = filePath.concat(last);
                return filePath.join('/')
            },
            allChunks: true
        }),
		new CleanWebpackPlugin(
			['product-local'],　 //匹配删除的文件
			{
				root: __dirname,       　　　　　　　　　　//根目录
				verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
				dry:      false        　　　　　　　　　　//启用删除文件
			}
		),
        new CopyWebpackPlugin([
            {
                from: './src/assets',
                to: 'static/assets'
            }
        ]),
		new MyReplaceLoaderPlugin(replaceOtions),
		new MyReplaceLoaderPlugin(replaceOtions),
		// new OptimizeCSSPlugin({//css去重
		// 	cssProcessorOptions: {
		// 		safe: true
		// 	}
		// }),
	]
};



var glob = require("glob");
var files = glob.sync("src/pages/**/index.js", {});


files.forEach(function(item){
    let folder = /src\/pages\/?(.+)?\/js\/(.+)/ig.exec(item);
    let entryPath

    //entry
    if(folder[1] == undefined) {
        exports.entry['index'] = path.resolve(__dirname, folder[0]);
        entryPath = 'index/';
    } else {
        exports.entry[folder[1] + '/index'] =path.resolve(__dirname, folder[0]);
        entryPath = folder[1] + '/';
    }


    //html
    let entryPathName=entryPath.slice(0,-1);
    let outPutFile=entryPathName=='index'?"index.html":entryPathName+'.html';
    var htmlPlugin = new HtmlWebpackPlugin({
        filename: outPutFile,
        template: "./src/pages/" +entryPath  + "index.html",
        chunks:['common',entryPath + 'index']
    });
    exports.plugins.push(htmlPlugin);


    //css
    let extractCSSPlugin = new ExtractTextPlugin('static/'+entryPath+'css/style.css');
    let cssExtract = {
        test: /\.(css)$/,
        include:[path.resolve(__dirname,'./src/pages/'+entryPath+'css')],
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
                { loader: 'css-loader?sourceMap', options: { importLoaders: 1 } },
                {
                    loader: 'postcss-loader',
                    options:{
                        plugins:function(){
                            return [
                                require('postcss-import')(),        //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
                                require("autoprefixer")({browsers:['ie>=8','>1% in CN']})
                            ]
                        }
                    }
                }
            ]
        })
    };
	//sass
	let sassExtract = {
		test: /\.(scss)$/,
		include:[path.resolve(__dirname,'./src/pages/'+entryPath+'sass')],
		use: ExtractTextPlugin.extract({
			fallback: "style-loader",
			use: [
				{
					loader: 'css-loader?sourceMap',
					// options:{
					//     minimize: !outputConfig.IS_DEBUG //css压缩
					// }
				},
				{
					loader: 'postcss-loader',
					options:{
						plugins:function(){
							return [
								require('postcss-import')(),        //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
								require("autoprefixer")({browsers:['ie>=8','>1% in CN']})
							]
						}
					}
				},
				{loader:'sass-loader?sourceMap'}
			]
		})
	};
    exports.module.loaders.push(cssExtract);
	exports.module.loaders.push(sassExtract);


    //images base64
    imageLoader = {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include:[path.resolve(__dirname,'./src/pages/'+entryPath+'images')],
        loaders: [
            'url-loader?hash=sha512&digest=hex&limit=10000&name='+'static/'+entryPath+'images/[name][hash].[ext]'
        ]
    };
    exports.module.loaders.push(imageLoader);

});




module.exports = exports;