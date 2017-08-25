require('./index.scss');

var footer = (function () {
    window.onload=function () {
        var el = document.getElementById('footerId');
        el.innerHTML = 'footer/index.js';
    }
    console.log('this is footer')
})();

module.exports = footer;