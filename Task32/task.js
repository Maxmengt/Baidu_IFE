/**
 * 添加事件通用方法
 * @method addEventHandler
 * @param {EventTarget} element 要添加监听事件的DOM节点
 * @param {EventString} type 事件句柄
 * @param {function} handler 事件处理函数
 */
function addEventHandler(element, type, handler) {
	if( element.addEventListener ) {
		element.addEventListener(type, handler);
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
var typeMatch = {
	"文本": "text",
	"邮箱": "email",
	"密码": "password",
	"手机": "tel",
	"按钮": "buttons"
};
var select = $("#label-type");

var clsForm = function(label, type, rules, success, fail, isRequired, validator) {
	this.label = label;
	this.type = type;
	this.rules = rules;
	this.success = success;
	this.fail = fail;
	this.isRequired = isRequired;
	this.validator = validator;
};

(function() {
	var	button = $(".button");
	addEventHandler(select, "change", optionChange);
	addEventHandler(button, "click", buttonClick);
})();

function optionChange(event) {
	event = event || window.event;
	var target = event.target || event.srcElement,
		radioBox = $(".radio");
	if( target.options[target.selectedIndex].value == "按钮" ) {
		radioBox.className += " hide";
	}
	else {
		radioBox.className = radioBox.className.replace(/ hide/, "");
	}
}

function buttonClick(event) {
	var name = $("#label-name").value,
	if( !name ) {
		alert("标签名称不能为空！");
		return ;
	}
	
	var	type = typeMatch[select.options[select.selectedIndex].value],
}
