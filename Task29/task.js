// \x00-\xff 匹配所有非单字节字符。

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

var nameInput = $(".name-input");
var nameBtn = $("#name-btn");
var nameAlert = $(".name-alert");

(function() {
	addEventHandler(nameBtn, "click", verifyName);
})();

function verifyName(event) {
	clearStyle();
	nameInput.value = nameInput.value.trim();
	if( !nameInput.value ) {
		redStyle("姓名不能为空");
	}
	else if( nameInput.value.match(/^[\da-zA-Z\x00-\xff]+$/) ) {
		var length = 0;
		for( var i = 0, len = nameInput.value.length; i < len; ++ i ) {
			++ length;
			if( nameInput.value.charCodeAt(i) > 256 ) {
				++ length;
			}
		}
		if( length < 4 || length > 16 ) {
			redStyle("请输入4-16位字符");
		}
		else {
			greenStyle("名称格式正确");
		}
	}
	else {
		redStyle("只允许输入英文字母、数字、中文、中英文符号");
	}
}

function clearStyle() {
	nameInput.className = "name-input";
	nameAlert.className = "name-alert";
}

function redStyle(string) {
	nameInput.className += " red-border";
	nameAlert.innerHTML = string;
	nameAlert.className += " red-font";			
}

function greenStyle(string) {
	nameInput.className += " green-border";
	nameAlert.innerHTML = string;
	nameAlert.className += " green-font";				
}
