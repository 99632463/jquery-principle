(function(w){
	var jQuery = function(selector){
		return new jQuery.prototype.init(selector);
	}

	jQuery.prototype = {
		constructor:jQuery,
		init:function(selector){
			//0 false null NaN undefined ""
			if(!selector){}
			//char
			else if(jQuery.isString(selector)){
				selector = jQuery.isTrim(selector);

				//代码片段
				if(jQuery.isHTML(selector)){
					var div = document.createElement('div');
					div.innerHTML = selector;
					// for(var i = 0,len = div.children.length; i < len; i++){
					// 	this[i] = div.children[i];
					// }
					// this.length = div.children.length;
					[].push.apply(this,div.children);
				} 
				//选择器
				else {
					var ele = document.querySelectorAll(selector);
					[].push.apply(this,ele);  //系统的伪数组是兼容底板 ie 的
				}
			}
			//数组
			else if(jQuery.isArray(selector)){
				var parse = [].slice.call(selector);
				[].push.apply(this,parse);
			}
			//函数
			else if(jQuery.isFunction(selector)){
				if(document.readyState === 'complete'){
					selector();
				} else {
					if(document.addEventListener){
						document.addEventListener('DOMContentLoaded',function(){
							selector();
						})
					} else{
						document.attachEvent('onreadystatechange',function(){
							if(document.readyState === 'complete'){
								selector();
							}
						})
					}
				}
			}
			//其他类型
			else{
				this[0] = selector;
				this.length = 1;
 			}

			return this;
		}
	}

	jQuery.extends = jQuery.prototype.extends = function(obj){
		for(var i in obj){
			this[i] = obj[i];
		}
	}

	//工具方法
	jQuery.extends({
		isString:function(selector){
			return typeof selector === 'string';
		},
		isHTML:function(selector){
			return selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>'
			&& selector.length >= 3;
		},
		isObject:function(selector){
			return typeof selector === 'object';
		},
		isArray:function(selector){
			return jQuery.isObject(selector) && 'length' in selector &&
			!jQuery.isWindow(selector); 
		},
		isWindow:function(selector){
			return selector === window;
		},
		isFunction:function(selector){
			return typeof selector === 'function';
		},
		isTrim:function(selector){
			if(jQuery.isString(selector)){
				if(selector.trim){
					selector = selector.trim();
				} else {
					selector = selector.replace(/^\s+|\s+$/,'');
				}

				return selector;
			}
		}
	});

	jQuery.extends({
		each:function(obj,fn){
			if(jQuery.isArray(obj)){
				for(var i = 0,len = obj.length; i < len; i++){
					var res = fn.call(obj[i],i,obj[i]);
					if(res){
						continue;
					}else if(res === false){
						break;
					}
				}
			}
			//object
			else if(jQuery.isObject(obj)){
				for(var i in obj){
					var res = fn.call(obj[i],i,obj[i]);
					if(res === true){
						continue;
					}else if(res === false){
						break;
					}
				}
			}

			return this;
		},
		map:function(obj,fn){
			var arr = [];

			if(jQuery.isArray(obj)){
				for(var i = 0,len = obj.length; i < len; i++){
					var res = fn(i,obj[i]);
					if(res){
						arr.push(res);
					}
				}
			}
			//object
			else if(jQuery.isObject(obj)){
				for(var i in obj){
					var res = fn(i,obj[i]);
					if(res){
						arr.push(res);
					}
				}
			}

			return this;
		},
		getStyle:function(ele,name){
			if(window.getComputedStyle){
				return window.getComputedStyle(ele)[name];
			}
			else{
				return ele.currentStyle[name];
			}
		},
		addEvent:function(dom,event,callback){
			if(dom.addEventListener){
				dom.addEventListener(event,callback);
			}
			else{
				dom.attachEvent('on'+event,callback);
			}
		}
	})

	//原型上的方法
	jQuery.prototype.extends({
		toArray:function(){
			return [].slice.call(this);
		},
		get:function(num){
			if(!arguments.length){
				return this.toArray();
			}
			else if(num >= 0){
				return this[num];
			}
			else{
				return this[this.length + num];
			}
		},
		eq:function(num){
			if(!arguments.length){
				return new jQuery();
			}
			var dom = this.get(num);

			return $(dom);
		},
		first:function(){
			return this.eq(0);
		},
		last:function(){
			return this.eq(-1);
		},
		each:function(fn){
			return jQuery.each(this,fn);
		},
		map:function(fn){
			return jQuery.map(this,fn);
		}
	})

	//DOM操作方法
	jQuery.prototype.extends({
		empty:function(){
			jQuery.each(this,function(index,value){
				value.innerHTML = '';
			})

			return this;
		},
		remove:function(selector){
			if(!arguments.length){
				jQuery.each(this,function(index,value){
					value.remove();
				})
			}
			else{
				jQuery.each(this,function(index,value){
					var t1 = value.tagName;
					jQuery.each($(selector),function(index,value2){
						var t2 = value2.tagName;
						if(t1 === t2){
							value2.remove();
						}
					})
				})
			}

			return this;
		},
		html:function(content){
			if(!arguments.length){
				return this[0].innerHTML;
			}
			else{
				jQuery.each(this,function(index,value){
					value.innerHTML = content;
				})
			}

			return this;
		},
		text:function(content){
			var str = '';
			if(!arguments.length){
				jQuery.each(this,function(index,value){
					str += value.innerText;
				})
			}
			else{
				jQuery.each(this,function(index,value){
					value.innerText = content;
				})
			}

			return this;
		},
		appendTo:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each($target,function(index,value){
				jQuery.each(_this,function(index2,value2){
					if(index === 0){
						value.appendChild(value2);
					}
					else{
						var clone = value2.cloneNode(true);
						value.appendChild(clone);
					}
				})
			})

			return this;
		},
		prependTo:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each($target,function(index,value){
				jQuery.each(_this,function(index2,value2){
					if(index === 0){
						value.insertBefore(value2,value.children[0])
					}
					else{
						var clone = value2.cloneNode(true);
						value.insertBefore(clone,value.children[0]);
					}
				})
			})

			return this;
		},
		append:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each(_this,function(index,value){
				jQuery.each($target,function(index2,value2){
					if(index === 0){
						value.appendChild(value2);
					}
					else{
						var clone = value2.cloneNode(true);
						value.appendChild(clone);
					}
				})
			})

			return this;
		},
		prepend:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each(_this,function(index,value){
				jQuery.each($target,function(index2,value2){
					if(index === 0){
						value.insertBefore(value2,value.children[0])
					}
					else{
						var clone = value2.cloneNode(true);
						value.insertBefore(clone,value.children[0])
					}
				})
			})

			return this;
		},
		insertBefore:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each($target,function(index,value){
				jQuery.each(_this,function(index2,value2){
					if(index === 0){
						var parentNode = value.parentNode;
						parentNode.insertBefore(value2,value)
					}
					else{
						var clone = value2.cloneNode(true);
						var parentNode = value.parentNode;
						parentNode.insertBefore(clone,value)
					}
				})
			})

			return this;
		},
		insertAfter:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each($target,function(index,value){
				jQuery.each(_this,function(index2,value2){
					if(index === 0){
						var parentNode = value.parentNode;
						var nextEle = value.nextElementSibling || value.nextSibling;
						parentNode.insertBefore(value2,nextEle);
					}
					else{
						var clone = value2.cloneNode(true);
						var parentNode = value.parentNode;
						var nextEle = value.nextElementSibling || value.nextSibling;
						parentNode.insertBefore(clone,nextEle);
					}
				})
			})

			return this;
		},
		before:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each(_this,function(index,value){
				jQuery.each($target,function(index2,value2){
					if(index === 0){
						var parentNode = value.parentNode;
						parentNode.insertBefore(value2,value)
					}
					else{
						var clone = value2.cloneNode(true);
						var parentNode = value.parentNode;
						parentNode.insertBefore(clone,value)
					}
				})
			})

			return this;
		},
		after:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each(_this,function(index,value){
				jQuery.each($target,function(index2,value2){
					if(index === 0){
						var parentNode = value.parentNode;
						var nextEle = value.nextElementSibling || value.nextSibling;
						parentNode.insertBefore(value2,nextEle);
					}
					else{
						var clone = value2.cloneNode(true);
						var parentNode = value.parentNode;
						var nextEle = value.nextElementSibling || value.nextSibling;
						parentNode.insertBefore(clone,nextEle);
					}
				})
			})

			return this;
		},
		prev:function(){
			return this[0].prevElementSibling || this[0].prevSibling;
		},
		next:function(){
			return this[0].nextElementSibling || this[0].nextSibling;
		},
		replaceAll:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each($target,function(index,value){
				jQuery.each(_this,function(index2,value2){
					if(index === 0){
						$(value2).insertBefore(value);
						value.remove();
					}
					else{
						var clone = value2.cloneNode(true);
						$(clone).insertBefore(value);
						value.remove();
					}
				})
			})

			return this;
		},
		replaceWith:function(target){
			var $target = $(target);
			var _this = this;

			jQuery.each(_this,function(index,value){
				jQuery.each($target,function(index2,value2){
					if(index === 0){
						$(value2).insertBefore(value);
						value.remove();
					}
					else{
						var clone = value2.cloneNode(true);
						$(clone).insertBefore(value);
						value.remove();
					}
				})
			})

			return this;
		}
	});

	//属性操作相关方法
	jQuery.prototype.extends({
		attr:function(attr,name){
			if(jQuery.isString(attr)){
				if(arguments.length === 1){
					return this[0].getAttribute(attr);
				}
				else{
					this.each(function(index,value){
						value.setAttribute(attr,name);
					})
				}
			}
			else if(jQuery.isObject(attr)){
				var _this = this;
				jQuery.each(attr,function(index,value){
					_this.each(function(index2,value2){
						value2.setAttribute(index,value);
					})
				})
			}

			return this;
		},
		prop:function(attr,name){
			if(jQuery.isString(attr)){
				if(arguments.length === 1){
					return this[0][attr];
				}
				else{
					this.each(function(index,value){
						value[attr] = name;
					})
				}
			}
			else if(jQuery.isObject(attr)){
				var _this = this;
				jQuery.each(attr,function(index,value){
					_this.each(function(index2,value2){
						value2[index] = value;
					})
				})
			}

			return this;
		},
		css:function(attr,name){
			if(jQuery.isString(attr)){
				if(arguments.length === 1){
					return jQuery.getStyle(this[0],attr);
				}
				else{
					this.each(function(index,value){
						value.style[attr] = name;
					})
				}
			}
			else if(jQuery.isObject(attr)){
				var _this = this;
				jQuery.each(attr,function(index,value){
					_this.each(function(index2,value2){
						value2.style[index] = value;
					})
				})
			}

			return this;
		},
		val:function(content){
			if(!arguments.length){
				return this[0].value;
			}
			else{
				this.each(function(index,value){
					value.value = content;
				})
			}

			return this;
		},
		hasClass:function(name){
			var flag = false;
			if(!arguments.length){
				return flag;
			}
			else{
				this.each(function(index,value){
					var className = " " + value.className + " ";
					name = " " + name + " ";
					if(className.indexOf(name) > -1){
						flag = true;
					}
				})

				return flag;
			}
		},
		addClass:function(name){
			if(!arguments.length) return this;
			var splitName = name.split(/\s/);

			this.each(function(index,value){
				jQuery.each(splitName,function(index2,value2){
					if(!$(value).hasClass(value2)){
						value.className = value.className + " " + value2;
					}
				})
			})

			return this;
		},
		removeClass:function(name){
			if(!arguments.length){
				this.each(function(index,value){
					value.className = '';
				})
			}
			else{
				var splitName = name.split(/\s/);

				this.each(function(index,value){
					jQuery.each(splitName,function(index2,value2){
						if($(value).hasClass(value2)){
							value.className = value.className.replace(value2,"").replace(" ","")
						}
					})
				})

				return this;
			}
		},
		toggleClass:function(name){
			var splitName = name.split(/\s/);

			this.each(function(index,value){
				jQuery.each(splitName,function(index2,value2){
					if($(value).hasClass(value2)){
						$(value).removeClass(value2);
					}
					else{
						$(value).addClass(value2);
					}
				})
			})

			return this;
		}
	});

	//事件操作方法
	jQuery.prototype.extends({
		on:function(event,callback){
			if(!this.eventCache){
				this.eventCache = {};
			}
			if(!this.eventCache[event]){
				this.eventCache[event] = [];
				this.eventCache[event].push(callback);
				var _this = this;

				this.each(function(index,value){
					jQuery.addEvent(value,event,function(){
						jQuery.each(_this.eventCache[event],function(index,value){
							value();
						})
					});
				})
			}
			else{
				this.eventCache[event].push(callback);
			}
		}
	});

	jQuery.prototype.init.prototype = jQuery.prototype;
	window.$ = window.jQuery = jQuery;
})(window);