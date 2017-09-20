/**
 * 1、公用事件js,提供事件监听，事件触发，取消监听
 * 2、提供注册事件的方法，为某个对象注册事件
 * 		例如：registerEvent(obj)
 */
module.exports = (function(){
	if (Ipmph.common.Events)
		return Ipmph.common.Events;

	var EventMixin ={
		//to-do list:实现事件监听，触发，取消
		_clientList: {},
		_triggerList: {},
		// 事件监听
		on: function (type, fn) {
			if (!this._clientList[ type ]) {
				this._clientList[ type ] = [];
			}

			this._clientList[ type ].push(fn);

			//如果在事件监听前已经发布了type型事件，则重新触发一下，解决异步问题
			if (type in this._triggerList) {
				this.trigger(type);
			}
		},
		// 事件触发
		trigger: function () {
			var arrArguments = [].slice.apply(arguments),
				key = [].shift.apply(arrArguments),
				fns = this._clientList[ key ],
				triggerList = this._triggerList;

			if (triggerList[ key ]) {
				for (var i = 0, len = triggerList[ key ].length; i < len; i++) {
					arrArguments.push(triggerList[ key ][ i ]);
				};
				// 将发布事件缓存列表的事件遍历发布一次后进行清空
				triggerList[ key ].length = 0;
			}

			// 如果没有订阅者订阅事件 则将事件进行缓存 再返回退出
			if (!fns || fns.length === 0) {
				triggerList[ key ] = [];
				triggerList[ key ].push(arrArguments[ 0 ]);
				return false;
			}


			for (var i = 0, len = fns.length; i < len; i++) {

				fns[i].apply(null, arrArguments);
			}
		},
		// 移除事件
		off: function(key, fn) {
			var fns = this._clientList[ key ];

			if (!fns) {
				return false;
			}
			if (!fn) {
				fns && (fns.length = 0); // 没有传入具体的fn就直接取消key对应的所有事件
				return;
			}

			for(var i = fns.length - 1; i >= 0; i--) {
				var _fn = fns[ i ];
				if (_fn === fn) {
					fns.splice(i, 1); // 删除事件监听的回调函数
				}
			}
		}

	};




	//提供事件注册方法，将Events注入给context对象
	var registerEvent = function (context) {
		if(context['on']!=undefined||context['trigger']!=undefined||context['off']!=undefined){
			throw new Error("该对象无法注入Events");
		}
		for (let property in EventMixin) {
			context[property] = EventMixin[property];
		}
	};

	//全局对象赋值
	Ipmph.common.Events = registerEvent;
	Ipmph.common.EventMixin=EventMixin;

	return Ipmph.common.Events;
})();


// -------------------------------我是有底线的-----------------------------------