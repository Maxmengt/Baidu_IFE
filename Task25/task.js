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
var $$ = function(className) {
	return document.querySelectorAll(className);
};
var div = $("#box-wrap"),
	searchInput = $("#search-input"),
	searchBtn = $("#search-btn");

function foldSpread(target) {
	var	icon = null,
		element = null;
	if( target.nodeName.toLowerCase() == "span" ) {
		icon = target.parentNode.previousElementSibling;
		element = target.parentNode.nextElementSibling;
	}
	else if( target.nodeName.toLowerCase() == "div" && target.className.match(/icon/) ) {
		icon = target;
		element = target.parentNode.children[2];
	}
	if( element ) {
		if( element.style.display == "none" ) {
			element.style.display = "block";
			icon.className = icon.className.replace(/in/, "out");
		}
		else {
			element.style.display = "none";
			icon.className = icon.className.replace(/out/, "in");				
		}
	}
}

function addList(target) {
	var list = target.parentNode.nextElementSibling,
		parent = target.parentNode.parentNode,
		name = prompt("请输入要添加的目录名：", "JavaScript"),
		item = null;
	if( !name ) return ;
	if( !list ) {
		list = document.createElement("ul");
		list.className = "ul-list";
		parent.appendChild(list);
		parent.firstElementChild.className = "absolute-pos out-icon";
	}
	item = document.createElement("li");
	item.className = "list";
	item.innerHTML = '<div class="absolute-pos in-icon"></div><div class="div-list"><span class="li-text">' + name + '</span><img class="add-list" src="add.png" /><img class="delete-list" src="delete.png" /></div>';
	list.appendChild(item);
}

function deleteList(target) {
	var list = target.parentNode.parentNode;
	var parent = list.parentNode;
	parent.removeChild(list);
	if( !parent.childElementCount ) {
		var grandParent = parent.parentNode;
		grandParent.removeChild(parent);
		if( grandParent.firstElementChild ) {
			grandParent.firstElementChild.className = grandParent.firstElementChild.className.replace(/out/, "in");
		}
	}
}

function handler(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if( target.nodeName.toLowerCase() == "img" ) {
		if( target.className.match(/add-list/) ) {
			addList(target)
		}
		else {
			deleteList(target);
		}
	}
	else {
		foldSpread(target);
	}
}

function recursiveSpread(item) {
	item.style.display = "block";
	if( item.parentNode.nodeName.toLowerCase() == "li" ) {
		item.parentNode.firstElementChild.className = "absolute-pos out-icon";
		recursiveSpread(item.parentNode.parentNode);
	}
}

function searchData(event) {
	var	lists = $$(".li-text");
	lists.forEach(function(item) {
		item.className = item.className.replace(/ show/g, "");
		if( item.innerHTML == searchInput.value ) {
			item.className += " show";
			recursiveSpread(item.parentNode.parentNode.parentNode);
		}
	});
}

function init() {
	addEventHandler(div, "click", handler);
	addEventHandler(searchBtn, "click", searchData);
}

init();