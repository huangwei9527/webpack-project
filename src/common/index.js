//引入公共css
require('./css/common.css');

/**
 * 公共对象
 * */
window.Ipmph=window.Ipmph||{};
window.Ipmph.common=window.Ipmph.common||{};

/**
 * 公共函数部分 utils
 */
require('./js/utils/Browser');
window.Ipmph.Browser=window.Ipmph.common.Browser;//缩写

require('./js/utils/Cookie');
window.Ipmph.Cookie=window.Ipmph.common.Cookie;//缩写

require('./js/utils/Events');
window.Ipmph.Events=window.Ipmph.common.Events;//缩写



/**
 * 公共模块
 */
//用户模块
require('./js/UserModel.js');
window.Ipmph.UserModel=window.Ipmph.common.UserModel;//缩写

//分页模块-使用基于bootstrap jquery的分页插件jqPaginator.js
require("./js/jqPaginator.js");

