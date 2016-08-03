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
		clsTree.prototype.buildTree = function() {
			(function build(root) {
				for( var i = 1, len = root.data.children.length; i < len; ++ i ) {
					var newNode = new clsNode(root.data.children[i]);
					build(newNode);
					root.children.push(newNode);
				}
			})(this._root);
		};
		clsTree.prototype.__clear__ = function() {
			this._data.length = 0;
		}
		clsTree.prototype.preOrderTraversal = function() {
			this.__clear__();
			(function preRecurse(currentNode, data) {
				data.push(currentNode);
				for( var i = 0, len = currentNode.children.length; i < len; ++ i ) {
					preRecurse(currentNode.children[i], data);
				}
			})(this._root, this._data);
		};
		clsTree.prototype.postOrderTraversal = function() {
			this.__clear__();
			(function postRecurse(currentNode, data) {
				for( var i = 0, len = currentNode.children.length; i < len; ++ i ) {
					postRecurse(currentNode.children[i], data);
				}
				data.push(currentNode);
			})(this._root, this._data);
		};
		clsTree.prototype.bfsTraversal = function() {
			this.__clear__();
			var queue = [];
			queue.push(this._root);
			while( queue.length ) {
				var currentNode = queue.shift();
				this._data.push(currentNode);
				for( var i = 0, len = currentNode.children.length; i < len; ++ i ) {
					queue.push(currentNode.children[i]);
				}
			}
		}
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
					return ;
				}
				if( ~i ) stack[i].data.className = stack[i].data.className.slice(0, -5);
				i++;
				stack[i].data.className += " show";
			}, 500);
		}
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
				}
			}, 500);			
		}
	}
	this.buildTree();
};

window.onload = function() {
	var header = $(".header");
	var tree = new clsTree($(".box-wrap-1"));
	addEventHandler(header, "click", function(event) {
		traversal(event, tree);
	});
}

/**
 * 点击事件触发遍历
 * @method traversal
 * @param {DOM Event, clsTree} event, data
 */
function traversal(event, data) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if( target.nodeName.toLowerCase() != "button" ) return ;
	var input = $("#search-input");
	input.disabled = true;
	$$(".head-btn").forEach(function(item) {
		item.disabled = true;
		item.className += " disabled";
	});
	$$(".box").forEach(function(item) {
		if( item.className.slice(-5) == " find" ) {
			item.className = item.className.slice(0, -5);
		}
	});
	if( target.name == "preorder" ) data.preOrderTraversal();
	else if( target.name == "bfsorder" ) data.bfsTraversal();
	else data.postOrderTraversal();
	var value = input.value;
	if( !value ) data.animation();
	else data.search(value);
}