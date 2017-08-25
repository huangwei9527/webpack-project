require('../css/normalize.css');
require('../css/style.css');
require('../sass/index.scss');

var userInfo = require('./userInfo.js');

init();

function init() {
	userInfo.init();
}