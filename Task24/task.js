// 突然发现好像是可以不用建树的= =b

/**
 * 添加事件通用方法
 * @method addEventHandler
 * @param {DOM Element, Event Handlers, function} element, type, handler
 */
function addEventHandler(element, type, handler) {
	if( element.addEventListener ) {
		element.addEventListener(type, handler, false);
	}
	else if( element.attachEvent ) {
		element.attachEvent("on" + type, handler);
	}
	else {
		element["on" + type] = handler;
	}
}

var $ = function(name) {
	return document.querySelector(name);
};
var $$ = function(name) {
	return document.querySelectorAll(name);
};
var lock = false;
var nowSelected = null;

/**
 * 树节点类
 * @class clsNode
 * @constructor
 * @param {DOM Element} data 初始化节点
 */
var clsNode = function(data) {
	this.data = data;
	this.children = [];
}

/**
 * 多叉树类
 * @class clsTree
 * @constructor
 * @param {DOM Element} data 初始化一棵树
 */
var clsTree = function(data) {
	this._root = new clsNode(data);
	this._data = [];
	if( typeof this.buildTree != "function" ) {
		/**
		 * 初始化建树
		 * @method buildTree
		 * @for clsTree
		 * @param {}
		 */
		clsTree.prototype.buildTree = function() {
			(function build(root) {
				for( var i = 1, len = root.data.children.length; i < len; ++ i ) {
					var newNode = new clsNode(root.data.children[i]);
					build(newNode);
					root.children.push(newNode);
				}
			})(this._root);
		};
		/**
		 * 清空this._data
		 * @method __clear__
		 * @for clsTree
		 * @param {}
		 */
		clsTree.prototype.__clear__ = function() {
			this._data.length = 0;
		}
		/**
		 * 树的先序遍历
		 * @method preOrderTraversal
		 * @for clsTree
		 * @param {}
		 */
		clsTree.prototype.preOrderTraversal = function() {
			this.__clear__();
			(function preRecurse(currentNode, data) {
				data.push(currentNode);
				for( var i = 0, len = currentNode.children.length; i < len; ++ i ) {
					preRecurse(currentNode.children[i], data);
				}
			})(this._root, this._data);
		};
		/**
		 * 树的后序遍历
		 * @method postOrderTraversal
		 * @for clsTree
		 * @param {}
		 */
		clsTree.prototype.postOrderTraversal = function() {
			this.__clear__();
			(function postRecurse(currentNode, data) {
				for( var i = 0, len = currentNode.children.length; i < len; ++ i ) {
					postRecurse(currentNode.children[i], data);
				}
				data.push(currentNode);
			})(this._root, this._data);
		};
		/**
		 * 树的层次遍历（广度优先搜索）
		 * @method bfsTraversal
		 * @for clsTree
		 * @param {function} callback 回调函数
		 */
		clsTree.prototype.bfsTraversal = function(callback) {
			this.__clear__();
			var queue = [];
			queue.push(this._root);
			while( queue.length ) {
				var currentNode = queue.shift();
				this._data.push(currentNode);
				if( callback ) {
					callback(currentNode);
				}
				for( var i = 0, len = currentNode.children.length; i < len; ++ i ) {
					queue.push(currentNode.children[i]);
				}
			}
		}
		/**
		 * 调用遍历方法搜索节点
		 * @method contains
		 * @for clsTree
		 * @param {function, function} callback, traversal
		 */
		clsTree.prototype.contains = function(callback, traversal) {
			traversal.call(this, callback);
		}
		/**
		 * 添加树节点
		 * @method add
		 * @for clsTree
		 * @param {DOM Element, Dom Element, function} data, toData, traversal
		 */
		clsTree.prototype.add = function(data, toData, traversal) {
			var parent = null,
				child = new clsNode(data),
				callback = function(node) {
					if( node.data == toData ) {
						parent = node;
					}
				};
			this.contains(callback, traversal);
			parent.children.push(child);
		}
		/**
		 * 删除树节点
		 * @method remove
		 * @for clsTree
		 * @param {DOM Element, Dom Element, function} data, fromData, traversal
		 */
		clsTree.prototype.remove = function(data, fromData, traversal) {
			var parent = null,
				callback = function(node) {
					if( node.data == fromData ) {
						parent = node;
					}
				};
			this.contains(callback, traversal);
			for( var i = 0, len = parent.children.length; i < len; ++ i ) {
				if( parent.children[i].data == data ) {
					break;
				}
			}
			parent.children.splice(i, 1);
		}
		/**
		 * 根据栈中节点顺序产生遍历动画
		 * @method animation
		 * @for clsTree
		 * @param {}
		 */
		clsTree.prototype.animation = function() {
			var i = -1;
			var stack = this._data;
			var timer = setInterval(function() {
				if( i == stack.length - 1 ) {
					clearInterval(timer);
					stack[i].data.className = stack[i].data.className.slice(0, -5);
					$$(".head-btn").forEach(function(item) {
						item.disabled = false;
						item.className = item.className.slice(0, -9);
					});
					$("#search-input").disabled = false;
					lock = false;
					return ;
				}
				if( ~i ) stack[i].data.className = stack[i].data.className.slice(0, -5);
				i++;
				stack[i].data.className += " show";
			}, 500);
		}
		/**
		 * 根据栈中节点顺序产生搜索动画
		 * @method search
		 * @for clsTree
		 * @param {String} value
		 */
		clsTree.prototype.search = function(value) {
			var i = -1;
			var stack = this._data;
			var timer = setInterval(function() {
				if( i == stack.length - 1 ) {
					clearInterval(timer);
					stack[i].data.className = stack[i].data.className.slice(0, -5);
					$$(".head-btn").forEach(function(item) {
						item.disabled = false;
						item.className = item.className.slice(0, -9);
					});
					$("#search-input").disabled = false;
					alert("Sorry, we found nothing.")
					lock = false;
					return ;
				}
				if( ~i ) stack[i].data.className = stack[i].data.className.slice(0, -5);
				i++;
				stack[i].data.className += " show";
				if( stack[i].data.firstElementChild.innerHTML == value ) {
					clearInterval(timer);
					stack[i].data.className = stack[i].data.className.slice(0, -5) + " find";
					$("#search-input").disabled = false;
					$$(".head-btn").forEach(function(item) {
						item.disabled = false;
						item.className = item.className.slice(0, -9);
					});
					lock = false;
				}
			}, 500);			
		}
	}
	this.buildTree();
};

window.onload = function() {
	var header = $(".header");
	var div = $(".box-wrap-1");
	var tree = new clsTree(div);
	addEventHandler(header, "click", function(event) {
		event = event || window.event;
		var target = event.target || event.srcElement;
		if( target.nodeName.toLowerCase() == "button" ) {
			if( target.name.slice(-5) == "order" ) {
				traversal(target, tree);
			}
			else {
				operation(target, tree);
			}
		}
	});
	addEventHandler(div, "click", function(event) {
		if( lock ) return ;
		event = event || window.event;
		var target = event.target || event.srcElement;
		$$(".box").forEach(function(item) {
			item.className = item.className.replace(/ show/g, "");
		});
		if( target.nodeName.toLowerCase() == "div" ) {
			target.className += " show";
			nowSelected = target;
		}
	});
}

/**
 * 点击事件触发遍历
 * @function traversal
 * @param {DOM Element, clsTree} target, data
 */
function traversal(target, data) {
	var input = $("#search-input");
	input.disabled = true;
	$$(".head-btn").forEach(function(item) {
		item.disabled = true;
		item.className += " disabled";
	});
	$$(".box").forEach(function(item) {
		item.className = item.className.replace(/ find/g, "");
	});
	lock = true;
	if( target.name == "pre-order" ) data.preOrderTraversal();
	else if( target.name == "bfs-order" ) data.bfsTraversal();
	else data.postOrderTraversal();
	var value = input.value;
	if( !value ) data.animation();
	else data.search(value);
}

/**
 * 节点的增加与删除功能
 * @function operation
 * @param {DOM Element, clsTree} target, data
 */
function operation(target, data) {
	if( !nowSelected ) {
		alert("请选中某个节点！");
		return ;
	}
	if( target.name == "add-node" ) {
		var value = $("#add-input").value;
		if( !value ) {
			alert("请设置节点的值！");
			return ;
		}
		$("#add-input").value = "";
		var num = parseInt(nowSelected.className.match(/ box-wrap-\d/)[0].slice(-1));
		if( num == 5 ) {
			alert("无法设置更深的子节点！");
			return ;
		}
		var div = document.createElement("div");
		div.className = "box box-wrap-" + (num + 1);
		div.innerHTML = "<span>" + value + "</span>";
		nowSelected.appendChild(div);
		data.add(div, nowSelected, data.bfsTraversal);
	}
	else {
		data.remove(nowSelected, nowSelected.parentNode, data.bfsTraversal);
		nowSelected.parentNode.removeChild(nowSelected);
		nowSelected = null;
	}
}
