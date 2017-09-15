/**
 * 利用html-webpack-plugin插件的钩子函数html-webpack-plugin-before-html-processing实现打包时替换模板中字符串的功能
 *
 * 这个插件是功能是html内字符串替换
 * @param options options对象key是要替换的目标字符串，value是替换字符
 * @constructor
 */


function MyReplaceLoaderPlugin(options) {
	// Configure your plugin with options...
	this.options = options||{};
}

MyReplaceLoaderPlugin.prototype.apply = function(compiler) {
	var _this = this;
	// ...
	compiler.plugin('compilation', function(compilation) {
		compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
			let html = htmlPluginData.html;
			for(let key in _this.options){
				let reg = new RegExp(key,'g');
				html = html.replace(reg,_this.options[key]);
			}
			htmlPluginData.html = html;

			callback(null, htmlPluginData);
		});
	});
};

module.exports = MyReplaceLoaderPlugin;