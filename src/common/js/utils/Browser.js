/**
 * 判断浏览器类型和系统平台
 * to-do 需要时继续扩展其他浏览器平台检测
 * @type {string}
 */


module.exports=(function () {

	if (Ipmph.common.Browser)
		return Ipmph.common.Browser;

	var ua = navigator.userAgent.toLowerCase(),s;
	var Browser = {
		ie 			: (s = ua.match(/(msie\s|trident.*rv:)([\d.]+)/))? parseInt(s[2]):false,
		firefox 	: (s =ua.match(/firefox\/([\d.]+)/))? parseInt(s[1]):false,
		chrome 		: (s = ua.match(/chrome\/([\d.]+)/))?parseInt(s[1]):false,
		opera 		: (s = ua.match(/opera.([\d.]+)/))?parseInt(s[1]):false,
		safari 		: (s = ua.match(/version\/([\d.]+).*safari/))?parseInt(s[1]):false,
		android		: (s=ua.match(/android/))?s:false,
		iphone 		: (s=ua.match(/iphone os/))?s:false,
		ipad 		: (s=ua.match(/ipad/))?s:false,
		isWin32 	: /win32/i.test(window.navigator.platform),
		isWeixin 	: (s=ua.match(/MicroMessenger/i))?!!s:false, //判断是否是在微信浏览器里面
		isUcweb 	: (s=ua.match(/ucbrowser/))?!!s:false,
		isMqq 		: (s=ua.match(/mqqbrowser/))?!!s:false, //是否是手机qq浏览器
		isWeiBo 	: (s=ua.match(/__weibo__/))?!!s:false, //是否微博浏览器
	};
	Browser.ios = Browser.ipad || Browser.iphone;//判断是否是ios


	window.Ipmph.common.Browser=Browser;

	return Ipmph.common.Browser;
})();

// -------------------------------我是有底线的-----------------------------------