/**
 * 添加事件通用方法
 * @method addEventHandler
 * @param {DOM_Element} element 要添加监听事件的DOM节点
 * @param {DOM_Event} type 事件句柄
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

var nowChecked = "student",
    nowSelected = 0,
    data = [];

(function() {
    data.push($(".option-label"), $(".option-city"), $("#Beijing"), $("#Shanghai"), $("#Guangzhou"), $(".text-label"), $("#company"));
    var student = $("#student");
    var noStudent = $("#no-student");
    var city = $('.option-city');
    addEventHandler(student, "click", studentHandler);
    addEventHandler(noStudent, "click", noStudentHandler);
    addEventHandler(city, "click", cityHandler);
})();


function studentHandler(event) {
    if( nowChecked == "student" ) return ;
    nowChecked = "student";
    clearShow();
    data[0].className += " show";
    data[1].className += " show";
    data[1].options[0].selected = true;
    nowSelected = 0;
    data[2].className += " show";
    data[2].options[0].selected = true;
}

function noStudentHandler(event) {
    if( nowChecked == "no-student" ) return ;
    nowChecked = "no-student";
    clearShow();
    data[5].className += " show";
    data[6].className += " show";
}

function clearShow() {
    data.forEach(function(item) {
        item.className = item.className.replace(/ show/g, ""); 
    });
}

function cityHandler(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if( target.selectedIndex == nowSelected ) return ;
    data[2 + nowSelected].className = data[2 + nowSelected].className.replace(/ show/g, "");
    nowSelected = target.selectedIndex;
    data[2 + nowSelected].className += " show";
}

