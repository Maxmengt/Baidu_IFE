var $ = function(id) {
	return document.getElementById(id);
};

var div = $('field');
var input = $('queue');
var ul = $('list');

function addEvent(element, type, handler) {
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
	addEvent(div, "click", function(event) {
		if( event && event.target.nodeName.toLowerCase() == 'button' ) {
			if( event.target.name[event.target.name.length - 1] == 'n' ) {
				if( !input.value.match(/^[0-9]{1,4}$/) ) {
					input.value = '';
					alert("请输入0~9999以内的整数！");
					return ;
				}
				var num = Number(input.value);
				var li = document.createElement("li");
				li.innerHTML = num;
				if( event.target.name[0] == 'l' ) {
					ul.insertBefore(li, ul.firstChild);
				}
				else {
					ul.appendChild(li);
				}
			}
			else {
				if( !ul.childElementCount ) {
					alert("队列已空，操作判定无效！");
					return ;
				}
				if( event.target.name[0] == 'l' ) {
					alert(ul.firstElementChild.innerHTML);
					ul.removeChild(ul.firstElementChild);
				}
				else {
					alert(ul.lastElementChild.innerHTML);
					ul.removeChild(ul.lastElementChild);
				}
			}
		}
	});
	addEvent(ul, "click", function(event) {
		if( event && event.target.nodeName.toLowerCase() == 'li' ) {
			ul.removeChild(event.target);
		}
	});
})();
