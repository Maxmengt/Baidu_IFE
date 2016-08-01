var $ = function(id) {
	return document.getElementById(id);
};
var selectBox = $('city-select');
var fieldBox = $('form-gra-time');
var divBox = document.getElementsByClassName('aqi-chart-wrap')[0];
/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
	var y = dat.getFullYear();
	var m = dat.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = dat.getDate();
	d = d < 10 ? '0' + d : d;
	return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
	var returnData = {};
	var dat = new Date("2016-01-01");
	var datStr = ''
	for(var i = 1; i < 92; i++) {
		datStr = getDateStr(dat);
		returnData[datStr] = Math.ceil(Math.random() * seed);
		dat.setDate(dat.getDate() + 1);
	}
	return returnData;
}

var aqiSourceData = {
	"北京": randomBuildData(500),
	"上海": randomBuildData(300),
	"广州": randomBuildData(200),
	"深圳": randomBuildData(100),
	"成都": randomBuildData(300),
	"西安": randomBuildData(500),
	"福州": randomBuildData(100),
	"厦门": randomBuildData(100),
	"沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
	nowSelectCity: -1,
	nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
	var marginLeft = Math.floor(100 / chartData.length);
	var width = Math.floor(1000 / chartData.length);
	delete chartData.length;
	var items = "";
	for( var date in chartData ) {
		var color = Math.floor(Math.random() * 0xFFFFFF).toString(16);
		var marginTop = 700 - chartData[date];
		items += "<div style='width:" + width + "px; height:" + chartData[date] + "px; background-color: #" + color +
						"; border: 1px solid #000; float: left; margin-top: " + marginTop + "px; margin-left: " + marginLeft +  "px;' title='" + date + " : " + chartData[date] + "'></div>";
	}
	divBox.innerHTML = items;
}

/**
 * 渲染数据
 */
function renderData() {
	chartData = {};
	chartData.length = 0;
	var city = aqiSourceData[selectBox.options[pageState.nowSelectCity].value],
			cnt = 0,
			sum = 0;
	if( pageState.nowGraTime == 'day' ) {
		for( var date in city ) {
			chartData.length++;
			chartData[date] = city[date];
		}
	}
	else if( pageState.nowGraTime == 'week' ) {
		var weekTh = 1;
		for( var date in city ) {
			cnt++;
			sum += city[date];
			if( cnt == 7 ) {
				chartData["第" + weekTh + "周"] = Math.ceil(sum / cnt);
				sum = cnt = 0;
				chartData.length++;
				weekTh++;
			}
		}
		if( sum ) {
			alert(cnt);
			chartData["第" + weekTh + "周"] = Math.ceil(sum / cnt);
			chartData.length++;
		}
	}
	else {
		var pre = 1;
		for( var date in city ) {
			if( Number(date.substr(5, 2)) != pre ) {
				chartData[pre + "月"] = Math.ceil(sum / cnt);
				sum = cnt = 0;
				pre = Number(date.substr(5, 2));
				chartData.length++;
			}
			sum += city[date];
			cnt++;
		}
		chartData[pre + "月"] = Math.ceil(sum / cnt);
		chartData.length++;
	}
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
	// 确定是否选项发生了变化 
	var inputs = document.getElementsByName('gra-time');
	for( var i = 0; i < inputs.length; ++ i ) {
		if( inputs[i].checked == true ) {
			if( pageState.nowGraTime == inputs[i].value ) return ; 
			break;
		}
	}
	// 设置对应数据
	pageState.nowGraTime = inputs[i].value
	renderData();

	// 调用图表渲染函数
	renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
	// 确定是否选项发生了变化 
	if( pageState.nowSelectCity == selectBox.selectedIndex ) return ;
	// 设置对应数据
	pageState.nowSelectCity = selectBox.selectedIndex;
	renderData();

	// 调用图表渲染函数
	renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	fieldBox.addEventListener("click", function(event) {
		if( event && event.target.nodeName.toLowerCase() == 'input' ) {
			graTimeChange();
		}
	});
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
	// 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	for( var city in aqiSourceData ) {
		var newOption = new Option(city, city);
		selectBox.add(newOption, undefined);
	}
	pageState.nowSelectCity = 0;
	selectBox.options[0].selected = true;
	// 给select设置事件，当选项发生变化时调用函数citySelectChange
	selectBox.addEventListener("change", function(event) {
		if( event && event.target.nodeName.toLowerCase() == 'select' ) {
			citySelectChange();
		}
	});
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
	// 将原始的源数据处理成图表需要的数据格式
	// 处理好的数据存到 chartData 中
	var firstCity = aqiSourceData[selectBox.options[0].value],
			cnt = 0;
	for( var date in firstCity ) {
		cnt++;
		chartData[date] = firstCity[date];
	}
	chartData.length = cnt;
	renderChart();
}

/**
 * 初始化函数
 */
function init() {
	initGraTimeForm()
	initCitySelector();
	initAqiChartData();
}

init();