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
var indexOf = [].indexOf ? 
	function(arr, item) {
		return arr.indexOf(item);
	} :
	function(arr, item) {
		for( var i = 0, len = arr.length; i < len; ++ i ) {
			if( arr[i] == item ) return i;
		}
		return -1;
	};

var tagInput = $("#tag-input");
var tagList = $("#tag-list");
var interestInput = $("#interest-input");
var interestButton = $("#interest-button");
var interestList = $("#interest-list");
var inputPattern = /[\s,，、　]+/g
var searchPattern = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/
var tagData = ["HTML5", "CSS", "JavaScript"];
var interestData = ["游泳", "瑜伽", "摄影"];

function tagInputKeyUp() {
	var str = tagInput.value.trim().replace(/,/g, "");
	tagInput.value = "";
	if( !str || indexOf(tagData, str) != -1 ) return ;
	tagData.push(str);
	var li = document.createElement("li");
	li.innerHTML = str;
	tagList.appendChild(li);
	if( tagData.length > 10 ) {
		tagData.shift();
		tagList.removeChild(tagList.firstElementChild);
	}
}

function interestInputHandler() {
	var str = interestInput.value.trim();
	interestInput.value = "";
	var results = str.split(inputPattern);
	results.forEach(function(item) {
		if( !item || indexOf(interestData, item) != -1 ) return ;
		var li = document.createElement("li");
		li.innerHTML = item;
		interestData.push(item);
		interestList.appendChild(li);
		if( interestData.length > 10 ) {
			interestData.shift();
			interestList.removeChild(interestList.firstElementChild);
		}
	});
}

function listMouseOver(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if( target.nodeName.toLowerCase() == "li" ) {
		target.innerHTML = "点击删除" + target.innerHTML;
		target.style.backgroundColor = "#f00";
	}	
}

function listMouseOut(event, color) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if( target.nodeName.toLowerCase() == "li" ) {
		target.innerHTML = target.innerHTML.slice(4);
		target.style.backgroundColor = color;
	}	
}

function listClick(event, list, flag) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if( target.nodeName.toLowerCase() == "li" ) {
		if( flag ) {
			tagData = tagData.filter(function(item) {
				return item != target.innerHTML.slice(4);
			});
		}
		else {
			interestData = interestData.filter(function(item) {
				return item != target.innerHTML.slice(4);
			});			
		}
		list.removeChild(target);
	}	
}

function listEventInit(list, color, flag) {
	addEventHandler(list, "mouseover", function(event) {
		listMouseOver(event);
	});
	addEventHandler(list, "mouseout", function(event) {
		listMouseOut(event, color);
	});
	addEventHandler(list, "click", function(event) {
		listClick(event, list, flag);
	});
}

function init() {
	addEventHandler(tagInput, "keyup", function(event) {
		// keyCode: Enter=13 Spacebar=32
		event = event || window.event;
		if( /,/.test(tagInput.value) || event.keyCode == 13 || event.keyCode == 32 ) {
			tagInputKeyUp();
		}
	});
	addEventHandler(interestButton, "click", function(event) {
		interestInputHandler();
	});

	listEventInit(tagList, "#86caff", true);
	listEventInit(interestList, "#ffc987", false);
}

init();
