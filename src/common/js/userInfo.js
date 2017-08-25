
function LoginModel() {
	this.userData = null;
	this.init = function () {
		this.userData={
			name:'wei',
			id:123456
		}
		console.log('has login');
		console.log(this.userData);
	}
}

module.exports = new LoginModel();