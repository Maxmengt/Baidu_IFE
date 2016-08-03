/*
 * 不足之处：
 * 1. 缺少必要的注释，一个函数注释至少包含函数的作用是什么，函数的参数类型及说明，返回的类型及说明。
 * 2. 面向对象理念薄弱。
 * 
 * 优点：使用了遍历的非递归写法，满足题目“每隔一段时间（500ms，1s等时间自定）再遍历下一个节点”（而不是单纯动画上做文章）的要求。
 */

var $ = function(name) {
	return document.querySelector(name);
};
var $$ = function(name) {
	return document.querySelectorAll(name);
};

window.onload = function() {
	var header = $(".header");
	var tree = [];
	// 建一棵二叉树
	buildTree($(".box-wrap-1"), 1, tree);
	
	// 使用事件委托，为按钮添加点击事件
	addEventHandler(header, "click", function(event) {
		traversal(event, tree);
	});
}

// 添加事件通用方法
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

// 递归建树
function buildTree(root, rt, data) {
	data[rt] = root;
	if( !root.childElementCount ) return ;
	buildTree(root.children[0], rt << 1, data);
	buildTree(root.children[1], rt << 1 | 1, data);
}

// 点击事件触发遍历
function traversal(event, data) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if( target.nodeName.toLowerCase() != "button" ) return ;
	$$(".head-btn").forEach(function(item) {
		item.disabled = true;
		item.className += " disabled";
	});
	
	if( target.name == "preorder" ) preorderTraversal(1, data);
	else if( target.name == "inorder" ) inorderTraversal(1, data);
	else postorderTraversal(1, data);
}

// 遍历顺序通用操作
function sameTraversal(stack, top, data, timer) {
	if( !stack.length ) {
		clearInterval(timer);
		data[top].className = data[top].className.slice(0, -5);
		$$(".head-btn").forEach(function(item) {
			item.disabled = false;
			item.className = item.className.slice(0, -9);
		});
		return ;
	}
	if( ~top ) {
		data[top].className = data[top].className.slice(0, -5);
	}
	top = stack.pop();
	data[top].className += " show";
	return top;
}

// 先序遍历
function preorderTraversal(rt, data) {
	var stack = [],
	    top = -1;
	stack.push(rt);
	var timer = setInterval(function() {
		top = sameTraversal(stack, top, data, timer);
		if( data[top << 1 | 1] ) stack.push(top << 1 | 1);
		if( data[top << 1] ) stack.push(top << 1);
	}, 500);
}

// 中序遍历
function inorderTraversal(rt, data) {
	var stack = [],
		top = -1;
	while( data[rt] ) {
		stack.push(rt);
		rt <<= 1;	
	}
	var timer = setInterval(function() {
		top = sameTraversal(stack, top, data, timer);
		rt = top << 1 | 1;
		while( data[rt] ) {
			stack.push(rt);
			rt <<= 1;
		}
	}, 500);
}

// 后序遍历
function postorderTraversal(rt, data) {
	var stack = [],
		top = -1;
	stack.push(rt);
	while( data[rt << 1] || data[rt << 1 | 1] ) {
		if( data[rt << 1] ) rt <<= 1;
		else if( data[rt << 1 | 1] ) rt = rt << 1 | 1;
		else break;
		stack.push(rt);
	}
	var timer = setInterval(function() {
		top = sameTraversal(stack, top, data, timer);
		if( top & 1 ) return ;
		rt = top | 1;
		stack.push(rt);
		while( data[rt << 1] || data[rt << 1 | 1] ) {
			if( data[rt << 1] ) rt <<= 1;
			else if( data[rt << 1 | 1] ) rt = rt << 1 | 1;
			else break;
			stack.push(rt);
		}
	}, 500);
}