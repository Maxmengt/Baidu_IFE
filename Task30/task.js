/**
 * 添加事件通用方法
 * @method addEventHandler
 * @param {DOM Element} element 要添加监听事件的DOM节点
 * @param {DOM Event} type 事件句柄
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

(function() {
	var inputs = $$(".input"),
		btn = $("#btn");
	inputs.forEach(function(item) {
		addEventHandler(item, "focus", focusHandler);
		addEventHandler(item, "blur", blurHandler);
	});
	addEventHandler(btn, "click", verifyAll);
})();

/**
 * 表单获得焦点时，下方显示表单填写规则
 * @method focusHandler
 * @param {DOM Event} event Event对象
 */
function focusHandler(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	var ruleShow = target.nextElementSibling;
	switch( target.name ) {
		case "name": ruleShow.innerHTML = "必填，长度为4~16个字符"; break;
		case "password": ruleShow.innerHTML = "必填，长度为4~14个字符"; break;
		case "confirm": ruleShow.innerHTML = "再次输入相同密码"; break;
		case "email": ruleShow.innerHTML = "必填，输入合法的电子邮件地址"; break;
		case "tel": ruleShow.innerHTML = "选填，输入11位数字"; break;
	}
}

/**
 * 表单失去焦点时校验表单内容
 * @method blurHandler
 * @param {DOM Event} event Event对象
 */
function blurHandler(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	switch( target.name ) {
		case "name": verifyName(); break;
		case "password": verifyPassword(); break;
		case "confirm": verifyConfirm(); break;
		case "email": verifyEmail(); break;
		case "tel": verifyTel(); break;
	}
}

/**
 * 点击提交按钮时，对页面中所有输入进行校验，若所有表单校验通过，弹窗显示“提交成功”，否则显示“提交失败”
 * @method verifyAll
 * @param {DOM Event} event Event对象
 */
function verifyAll(event) {
	var cnt = 0;
	if( verifyName() ) cnt++;
	if( verifyPassword() ) cnt++;
	if( verifyConfirm() ) cnt++;
	if( verifyEmail() ) cnt++;
	if( verifyTel() ) cnt++;
	if( cnt == 5 ) {
		alert("提交成功！");
	}
	else {
		alert("提交失败...");
	}
}

/**
 * 验证名称输入合法性
 * @method verifyName
 * @return {Boolean} 若验证结果正确则返回true，否则返回false
 */
function verifyName() {
	var nameInput = $("#name");
	clearStyle(nameInput);
	nameInput.value = nameInput.value.trim();
	if( !nameInput.value ) {
		redStyle(nameInput, "名称不能为空");
	}
	else if( nameInput.value.match(/^[\da-zA-Z\u4e00-\u9fa5]+$/) ) {
		var length = 0;
		for( var i = 0, len = nameInput.value.length; i < len; ++ i ) {
			++ length;
			if( nameInput.value.charCodeAt(i) >= 256 ) ++ length;
		}
		if( length < 4 || length > 16 ) {
			redStyle(nameInput, "请输入4-16位字符");
		}
		else {
			greenStyle(nameInput, "名称格式正确");
			return true;
		}
	}
	else {
		redStyle(nameInput, "只允许输入英文字母、数字、中文");
	}
	return false;
}

/**
 * 验证密码输入合法性
 * @method verifyPassword
 * @return {Boolean} 若验证结果正确则返回true，否则返回false
 */
function verifyPassword() {
	var passwordInput = $("#password");
	clearStyle(passwordInput);
	if( !passwordInput.value ) {
		redStyle(passwordInput, "密码不能为空");
		return false;
	}
	if( passwordInput.value.length < 4  ) {
		redStyle(passwordInput, "密码长度太短，请重新输入");
		return false;
	}
	if( passwordInput.value.length > 16 ) {
		redStyle(passwordInput, "密码长度太长，请重新输入");
		return false;
	}
	greenStyle(passwordInput, "密码可用");
	return true;
}

/**
 * 验证密码确认输入合法性
 * @method verifyConfirm
 * @return {Boolean} 若验证结果正确则返回true，否则返回false
 */
function verifyConfirm() {
	var confirmInput = $("#confirm"),
		passwordInput = $("#password");
	clearStyle(confirmInput);
	if( !passwordInput.value ) {
		redStyle(confirmInput, "密码不能为空");
		return false;
	}
	if( confirmInput.value != passwordInput.value ) {
		redStyle(confirmInput, "两次密码输入不一致");
		return false;
	}
	greenStyle(confirmInput, "密码输入一致");
	return true;
}

/**
 * 验证邮箱输入合法性
 * @method verifyEmail
 * @return {Boolean} 若验证结果正确则返回true，否则返回false
 */
function verifyEmail() {
	var emailInput = $("#email"),
		email = emailInput.value.trim();
	clearStyle(emailInput);
	if( email.match(/^[0-9a-zA-Z]+@[0-9a-zA-Z]+.[a-zA-Z]+$/) ) {
		greenStyle(emailInput, "邮箱格式正确");
		return true;
	}
	if( !email ) {
		redStyle(emailInput, "邮箱为必填项");
	}
	else {
		redStyle(emailInput, "邮箱格式错误");
	}
	return false;
}

/**
 * 验证手机号码输入合法性
 * @method verifyTel
 * @return {Boolean} 若验证结果正确则返回true，否则返回false
 */
function verifyTel() {
	var telInput = $("#tel"),
		tel = telInput.value.trim();
	clearStyle(telInput);
	if( tel && !tel.match(/^[0-9]{11}$/) ) {
		redStyle(telInput, "手机格式错误");
		return false;
	}
	if( tel ) greenStyle(telInput, "手机格式正确");
	return true;
}

/**
 * 将输入框及提示设置为默认样式
 * @method clearStyle
 * @param {DOM Element} element input标签
 */
function clearStyle(element) {
	element.className = "input";
	element.nextElementSibling.className = "alert";
}

/**
 * 将输入框及提示设置为错误样式
 * @method redStyle
 * @param {DOM element} element input标签
 * @param {String} string 将提示设置为string
 */
function redStyle(element, string) {
	element.className += " red-border";
	element.nextElementSibling.innerHTML = string;
	element.nextElementSibling.className += " red-font";			
}

/**
 * 将输入框及提示设置为正确样式
 * @method greenStyle
 * @param {DOM element} element input标签
 * @param {String} string 将提示设置为string
 */
function greenStyle(element, string) {
	element.className += " green-border";
	element.nextElementSibling.innerHTML = string;
	element.nextElementSibling.className += " green-font";				
}
