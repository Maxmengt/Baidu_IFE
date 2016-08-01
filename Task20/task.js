var $ = function(id) {
	return document.getElementById(id);
};

var div = $('div-input');
var text = $('data-input');
var input = $('data-search');
var ul = $('ul-list');
var inputPattern = /[\s,，、　]+/g
var searchPattern = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/
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

(function() {
	addEventHandler(div, "click", function(event) {
		if( event && event.target.nodeName.toLowerCase() == "button" ) {
			if( event.target.name == "input-button" ) {
				var str = text.value.trim();
				text.value = "";
				if( str == "" ) return ;
				var results = str.split(inputPattern);
				for( var i = 0; i < ul.childElementCount; ++ i ) {
					ul.children[i].innerHTML = ul.children[i].innerHTML.replace(/<span>|<\/span>/g, "");
				}
				for( var i = 0; i < results.length; ++ i ) {
					var li = document.createElement("li");
					li.innerHTML = results[i];
					ul.appendChild(li);
				}
			}
			else {
				var str = input.value.trim();
				input.value = "";
				if( str == "" ) return ;
				if( !str.match(searchPattern) ) {
					alert("查询只支持数字和中英文！")
					return ;
				}
				for( var i = 0; i < ul.childElementCount; ++ i ) {
					ul.children[i].innerHTML = ul.children[i].innerHTML.replace(/<span>|<\/span>/g, "");
				}
				for( var i = 0; i < ul.childElementCount; ++ i ) {
					ul.children[i].innerHTML = ul.children[i].innerHTML.replace(str, "<span>" + str + "</span>");
				}
			}
		}
	});
})();
