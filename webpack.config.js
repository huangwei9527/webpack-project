const webpack = require("webpack");
const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MyReplaceLoaderPlugin = require('./my-replace-loader');

global.outputConfig={
    RESOURCES:"/static",
    PUBLIC_PATH: "/",
    IS_DEBUG:false
};

//可以设置html中要替换的字符串
let replaceOtions = {
	// "this is footer" : "repalce by webpack",
	// "index page" : "webpack"
}


var exports = {
    //devtool: "source-map",
	entry:{
		'common':['es5-shim','es5-shim/es5-sham','./src/common/js/index.js']
	},
	output:{
		path:path.resolve(__dirname,'product'),
        publicPath:outputConfig.PUBLIC_PATH,
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
                include:[path.resolve(__dirname,'src/common'),path.resolve(__dirname,'src/components')],
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
				include:[path.resolve(__dirname,'src/common'),path.resolve(__dirname,'src/components')],
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
		jQuery: "jquery",
		"window.jQuery": "jquery"
    },
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
        	name:'common',
        	filename:'static/common/js/base.js'
        }),
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
            ['product'],　 //匹配删除的文件
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
		new MyReplaceLoaderPlugin(replaceOtions)
	]
};

//是测试环境的话设置source map
if(outputConfig.IS_DEBUG){
    exports['devtool'] = "source-map";//source map
}else{//正式环境开启压缩js
    // exports.plugins.push(
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             properties: false,
    //             warnings: false
    //         },
    //         output: {
    //             beautify: true,
    //             quote_keys: true//解决IE8报错
    //         },
    //         sourceMap: false
    //     })
    // )
}



var glob = require("glob");
var files = glob.sync("src/pages/**/index.js", {});


files.forEach(function(item){
    let folder = /src\/pages\/?(.+)?\/js\/(.+)/ig.exec(item);
    let entryPath;

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
        // minify:!outputConfig.IS_DEBUG,
        chunks:['common',entryPath + 'index']
    });
    exports.plugins.push(htmlPlugin);


    //css
    let cssExtract = {
        test: /\.(css)$/,
        include:[path.resolve(__dirname,'./src/pages/'+entryPath+'css')],
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
    };
	//sass
	let sassExtract = {
		test: /\.(scss)$/,
		include:[path.resolve(__dirname,'./src/pages/'+entryPath+'sass')],
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