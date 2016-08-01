var $ = function(id) {
	return document.getElementById(id);
};

var div = $('div-input');
var input = $('input-queue');
var ul = $('ul-list');
var buttons = div.getElementsByTagName('button');

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

function swap(a, b) {
	var tmp = parseInt(a.style.height);
	a.innerHTML = b.innerHTML;
	a.style.height = b.style.height;
	a.style.marginTop = b.style.marginTop;
	a.title = b.title;
	b.innerHTML = "<p>" + tmp / 2 + "</p>";
	b.style.height = tmp + "px";
	b.style.marginTop = 300 - tmp + "px";
	b.title = tmp / 2;
}

function disabledButton() {
	for( var i = 0; i < buttons.length; ++ i ) {
		buttons[i].disabled = true;
	}
}

function abledButton() {
	for( var i = 0; i < buttons.length; ++ i ) {
		buttons[i].disabled = false;
	}
}

function bubbleSort() {
	var i = 0,
		j = 0,
		delay = 100,
		timer;
	disabledButton();
	timer = setInterval(function() {
		ul.children[j].style.background = "red";
		ul.children[j + 1].style.background = "blue";
		if( parseInt(ul.children[j].title) > parseInt(ul.children[j + 1].title) ) {
			swap(ul.children[j], ul.children[j + 1]);
		}
		++ j;
		if( j == ul.childElementCount - i - 1 ) {
			ul.children[j].style.background = "gray";
			j = 0;
			++ i;
		}
		if( i == ul.childElementCount - 1 ) {
			clearInterval(timer);
			ul.children[j].style.background = "gray";
			abledButton();
		}	
	}, delay);
}

function selectSort() {
	var i = 0,
		j = 0,
		max = 0,
		delay = 100,
		timer;
	disabledButton();
	timer = setInterval(function() {
		if( j && j - 1 != max ) ul.children[j - 1].style.background = "red";
		ul.children[j].style.background = "blue";
		if( parseInt(ul.children[j].title) >= parseInt(ul.children[max].title) ) {
			ul.children[max].style.background = "red";
			max = j;
			ul.children[max].style.background = "yellow";
		}
		if( j == ul.childElementCount - i - 1 ) {
			swap(ul.children[j], ul.children[max]);
			ul.children[max].style.background = "red";
			ul.children[j].style.background = "gray";
			j = 0;
			max = 0;
			++ i;
		}
		++ j;
		if( i == ul.childElementCount - 1 ) {
			clearInterval(timer);
			ul.children[j - 1].style.background = "gray";
			abledButton();
		}
	}, delay);
}

function init() {
	addEvent(div, "click", function(event) {
		if( event && event.target.nodeName.toLowerCase() == 'button' ) {
			var name = event.target.name;
			if( name.slice(-1) == 'n' ) {
				var num = Number(input.value);
				if( !input.value.match(/^[0-9]+$/) || num < 10 || num > 100 ) {
					input.value = '';
					alert("请输入10~100以内的整数！");
					return ;
				}
				if( ul.childElementCount == 60 ) {
					alert("队列要炸了，请慎重！");
					return ;
				}
				var li = document.createElement("li");
				li.innerHTML = "<p>" + num + "</p>";
				li.style.height = num * 2 + "px";
				li.style.marginTop = 300 - num * 2 + "px";
				li.title = num;
				if( name[0] == 'l' ) {
					ul.insertBefore(li, ul.firstChild);
				}
				else {
					ul.appendChild(li);
				}
			}
			else if( name.slice(-3) == "out" ){
				if( !ul.childElementCount ) {
					alert("队列已空，操作判定无效！");
					return ;
				}
				if( name[0] == 'l' ) {
					alert(parseInt(ul.firstElementChild.style.height) / 2);
					ul.removeChild(ul.firstElementChild);
				}
				else {
					alert(parseInt(ul.lastElementChild.style.height) / 2);
					ul.removeChild(ul.lastElementChild);
				}
			}
			else if( name.slice(-1) == 'a' ) {
				ul.innerHTML = '';
				(function() {
					for( var i = 0; i < 50; ++ i ) {
						var li = document.createElement("li");
						var num = Math.ceil(10 + Math.random() * 90);
										li.innerHTML = "<p>" + num + "</p>";
						li.style.height = num * 2 + "px";
						li.style.marginTop = 300 - num * 2 + "px";
						li.title = num;
						ul.appendChild(li);
					}
				})();
			}
			else if( name[0] == 'b' ){
				if( !ul.childElementCount ) {
					alert("队列为空！请先添加元素。");
					return ;
				}
				bubbleSort();
			}
			else if( name[0] == 's' ) {
				if( !ul.childElementCount ) {
					alert("队列为空！请先添加元素。");
					return ;
				}
				selectSort();
			}
		}
	});
	addEvent(ul, "click", function(event) {
		if( event && event.target.nodeName.toLowerCase() == 'li' ) {
			ul.removeChild(event.target);
		}
	});
}

init();