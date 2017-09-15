/**
 * 用户模块
 * */

module.exports = (function () {

	//如果已经初始化定义了UserModel模块直接返回该对象
	if(window.Ipmph.common.UserModel)
		return window.Ipmph.common.UserModel;

	var context={};

	//给context注入事件方法
	Ipmph.common.Events(context);

	context.userData = null;       //用户信息储存
	/**
	 * 定义一些用户模块的事件类型
	 * @type {{}}
	 */
	context.eventType={
		REGISTER_SUCCESS	: "resgister-success",//注册成功
		REGISTER_FAILED		: "resgister-failed",//注册失败
		LOGIN_SUCCESS		: "login-success",//登录成功
		LOGIN_FAILED		: "login-failed",//登录失败
		LOGIN_CHECK			: "login-check",//检查登录状态
	};

	/**
	 * 注册操作
	 * @param email
	 * @param nickname
	 * @param password
	 */
	context.doRegister = function (email,nickname,password) {

	};

	/**
	 * 登录操作
	 * @param email
	 * @param password
	 * @param rememberMe
	 */
	context.doLogin = function (email,password,rememberMe) {

	};

	/**
	 * 检查登录状态
	 */
	context.checkLoginState = function() {
		let _this = this;
		setTimeout(function () {
			_this.trigger(_this.eventType.LOGIN_SUCCESS)
		},1000)
	};

	/**
	 * 重置密码
	 * @param email
	 */
	context.resetPass = function (email) {

	};


	/**
	 * 存储token
	 * @param token
	 */
	context.saveTokenToStorage=function(token){
		localStorage.setItem("ipmphToken", token);
	};
	/**
	 * 获取token
	 */
	context.getToken=function(){
		var ipmphToken = localStorage.getItem('ipmphToken');
		return ipmphToken;
	};
	/**
	 * 移除token
	 */
	context.removeToken=function () {
		localStorage.setItem("ipmphToken", '');
	};

	context.init=function () {
		this.checkLoginState();
	}

	window.Ipmph.common.UserModel=context;

	return Ipmph.common.UserModel;
})();



// -------------------------------我是有底线的-----------------------------------