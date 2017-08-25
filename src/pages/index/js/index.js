require('../../../components/nav-header/index');
require('../../../components/footer/index');

require('../sass/layout.scss');


init();

function init() {
	const a = 1;
	console.log(a);

	var b = ['1','2d','4f']

	var c = b.map(function (iterm) {
		return parseInt(iterm);
    });
	console.log(c);

    let d  = function (t) {
        var n = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n
    }.bind(this)

    // let promise = new Promise(function(resolve,reject){
		// setTimeout(function () {
    //         resolve('success')
    //     },3000)
    // })
    //
    // promise.then(function (val) {
		// console.log(val);
    // })
}

var promise = new Promise(function(resolve){
	resolve(42);
})

promise.then(function(value){
	console.log(value);
	return 444
}).then(function (value) {
	console.log(value,' this is two')
}).catch(function (e) {
	console.log(e);
});

// class MyError extends Error{
// 	// 继承了Error类的对象
// }