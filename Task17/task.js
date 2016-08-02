var $ = function(id) {
	return document.getElementById(id);
};
var selectBox = $('city-select');
var fieldBox = $('form-gra-time');
var divBox = document.getElementsByClassName('aqi-chart-wrap')[0];
/* ���ݸ�ʽ��ʾ
var aqiSourceData = {
  "����": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// �������������������ģ�����ɲ�������
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
	"����": randomBuildData(500),
	"�Ϻ�": randomBuildData(300),
	"����": randomBuildData(200),
	"����": randomBuildData(100),
	"�ɶ�": randomBuildData(300),
	"����": randomBuildData(500),
	"����": randomBuildData(100),
	"����": randomBuildData(100),
	"����": randomBuildData(500)
};

// ������Ⱦͼ�������
var chartData = {};

// ��¼��ǰҳ��ı�ѡ��
var pageState = {
	nowSelectCity: -1,
	nowGraTime: "day"
}

/**
 * ��Ⱦͼ��
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
 * ��Ⱦ����
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
				chartData["��" + weekTh + "��"] = Math.ceil(sum / cnt);
				sum = cnt = 0;
				chartData.length++;
				weekTh++;
			}
		}
		if( sum ) {
			alert(cnt);
			chartData["��" + weekTh + "��"] = Math.ceil(sum / cnt);
			chartData.length++;
		}
	}
	else {
		var pre = 1;
		for( var date in city ) {
			if( Number(date.substr(5, 2)) != pre ) {
				chartData[pre + "��"] = Math.ceil(sum / cnt);
				sum = cnt = 0;
				pre = Number(date.substr(5, 2));
				chartData.length++;
			}
			sum += city[date];
			cnt++;
		}
		chartData[pre + "��"] = Math.ceil(sum / cnt);
		chartData.length++;
	}
}

/**
 * �ա��ܡ��µ�radio�¼����ʱ�Ĵ�����
 */
function graTimeChange() {
	// ȷ���Ƿ�ѡ����˱仯 
	var inputs = document.getElementsByName('gra-time');
	for( var i = 0; i < inputs.length; ++ i ) {
		if( inputs[i].checked == true ) {
			if( pageState.nowGraTime == inputs[i].value ) return ; 
			break;
		}
	}
	// ���ö�Ӧ����
	pageState.nowGraTime = inputs[i].value
	renderData();

	// ����ͼ����Ⱦ����
	renderChart();
}

/**
 * select�����仯ʱ�Ĵ�����
 */
function citySelectChange() {
	// ȷ���Ƿ�ѡ����˱仯 
	if( pageState.nowSelectCity == selectBox.selectedIndex ) return ;
	// ���ö�Ӧ����
	pageState.nowSelectCity = selectBox.selectedIndex;
	renderData();

	// ����ͼ����Ⱦ����
	renderChart();
}

/**
 * ��ʼ���ա��ܡ��µ�radio�¼��������ʱ�����ú���graTimeChange
 */
function initGraTimeForm() {
	fieldBox.addEventListener("click", function(event) {
		if( event && event.target.nodeName.toLowerCase() == 'input' ) {
			graTimeChange();
		}
	});
}

/**
 * ��ʼ������Select����ѡ����е�ѡ��
 */
function initCitySelector() {
	// ��ȡaqiSourceData�еĳ��У�Ȼ������idΪcity-select�������б��е�ѡ��
	for( var city in aqiSourceData ) {
		var newOption = new Option(city, city);
		selectBox.add(newOption, undefined);
	}
	pageState.nowSelectCity = 0;
	selectBox.options[0].selected = true;
	// ��select�����¼�����ѡ����仯ʱ���ú���citySelectChange
	selectBox.addEventListener("change", function(event) {
		if( event && event.target.nodeName.toLowerCase() == 'select' ) {
			citySelectChange();
		}
	});
}

/**
 * ��ʼ��ͼ����Ҫ�����ݸ�ʽ
 */
function initAqiChartData() {
	// ��ԭʼ��Դ���ݴ����ͼ����Ҫ�����ݸ�ʽ
	// ����õ����ݴ浽 chartData ��
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
 * ��ʼ������
 */
function init() {
	initGraTimeForm()
	initCitySelector();
	initAqiChartData();
}

init();