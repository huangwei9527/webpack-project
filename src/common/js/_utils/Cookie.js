/**
 * 提供操作cookie的公共方法
 */

module.exports=(function(){

	if (Ipmph.common.Cookie)
		return Ipmph.common.Cookie;

	var Cookie = {};

	/**
	 * getCookie
	 * @param name
	 * @returns {*}
	 */
	Cookie.get=function(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split("; ");
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if (arr[0] == name)return arr[1];
		}
		return "";
	};

	/**
	 * 添加cookie
	 * @param name
	 * @param value
	 * @param expiresHours
	 * @param domain
	 */
	Cookie.set = function(name, value, expiresDays,domain) {
		var cookieString = name + "=" + (!!value?value:'');
		var date = new Date();

		if(domain!=undefined)
			domain=";domain="+domain;
		else
			domain='';

		date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
		cookieString = cookieString + domain+"; path=/; expires=" + date.toGMTString();

		document.cookie = cookieString;
	};

	/**
	 * 删除cookie
	 * @param name
	 */
	Cookie.remove=function(name){
		this.set(name,'',-1);
	}

	Ipmph.common.cookie = Cookie;
	return Ipmph.common.cookie;
})();