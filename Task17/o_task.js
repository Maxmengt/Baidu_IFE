/**
 * Created by hansneil on 21/3/16.
 */
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
    var datStr = '';
    for (var i = 1; i < 92; i++) {
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

var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
              '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];

// ������Ⱦͼ�������
var chartData = {};

// ��¼��ǰҳ��ı�ѡ��
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

function getWidth(width, len) {
    var posObj = {};
    posObj.width = Math.floor(width / (len*2));
    posObj.left = Math.floor(width / len);
    posObj.offsetLeft = (width - posObj.left * (len - 1) - posObj.width) / 2;
    return posObj;
}

function getHintLfeft(posObj, i){
    if (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 60 <= 0) {
        return 5;
    } else if (posObj.left * i + posObj.offsetLeft + posObj.width / 2 + 60 >= 1200) {
        return (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 110);
    } else  {
        return (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 60);
    }
}

function getTitle() {
    switch (pageState.nowGraTime) {
        case "day":
            return "ÿ��";
        case "week":
            return "��ƽ��";
        case "month":
            return "��ƽ��";
    }
}

/**
 * addEventHandler����
 * �������ʵ���¼���
 */
function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+event, hanlder);
    } else  {
        ele["on" + event] = hanlder;
    }
}

/**
 * ��Ⱦͼ��
 */
function renderChart() {
    var innerHTML = "", i = 0;
    var wrapper = document.getElementById("aqi-chart-wrap");
    var width = wrapper.clientWidth;
    var selectedData = chartData[pageState.nowGraTime][pageState.nowSelectCity];
    var len = Object.keys(selectedData).length;
    var posObj = getWidth(width, len);
    innerHTML += "<div class='title'>" + pageState.nowSelectCity + "��01-03��"+ getTitle() +"������������</div>"
    for (var key in selectedData) {
        innerHTML += "<div class='aqi-bar " + pageState.nowGraTime + "' style='height:" + selectedData[key] + "px; width: " + posObj.width +"px; left:" + (posObj.left * i + posObj.offsetLeft) + "px; background-color:" + colors[Math.floor(Math.random() * 11)] + "'></div>"
        innerHTML += "<div class='aqi-hint' style='bottom: " + (selectedData[key] + 10) + "px; left:" + getHintLfeft(posObj, i++) + "px'>" + key + "<br/> [AQI]: " + selectedData[key] + "</div>"
    }
    wrapper.innerHTML = innerHTML;
}

/**
 * �ա��ܡ��µ�radio�¼����ʱ�Ĵ�����
 */
function graTimeChange(radio) {
    // ȷ���Ƿ�ѡ����˱仯
    var value = radio.value;
    var item = radio.previousElementSibling;
    var items = document.getElementsByTagName('span');
    for (var i = 0; i < items.length; i++) {
        items[i].className = "";
    }
    item.className = "selected";
    if (value !== pageState.nowGraTime) {
        // ���ö�Ӧ����
        pageState.nowGraTime = value;
        // ����ͼ����Ⱦ����
        renderChart();
    }
}

/**
 * select�����仯ʱ�Ĵ�����
 */
function citySelectChange() {
    // ȷ���Ƿ�ѡ����˱仯
    var city = this.value;
    if (city !== pageState.nowSelectCity) {
        // ���ö�Ӧ����
        pageState.nowSelectCity = city;
        // ����ͼ����Ⱦ����
        renderChart();
    }
}

/**
 * ��ʼ���ա��ܡ��µ�radio�¼��������ʱ�����ú���graTimeChange
 */
function initGraTimeForm() {
    var radio = document.getElementsByName('gra-time');
    for (var i = 0; i < radio.length; i++) {
            addEventHandler(radio[i], 'click', function () {
                graTimeChange(radio[i])
            });
    }
    addEventHandler(document, 'mouseover', function(event){
        var ele = event.target;
        ele.className += " show";
    });
    addEventHandler(document, 'mouseout', function(event){
        var ele = event.target;
        ele.className = ele.className.replace(/show/, "");
    });
}

/**
 * ��ʼ������Select����ѡ����е�ѡ��
 */
function initCitySelector() {
    // ��ȡaqiSourceData�еĳ��У�Ȼ������idΪcity-select�������б��е�ѡ��
    var select = document.getElementById("city-select");
    var cityArr = Object.getOwnPropertyNames(aqiSourceData);
    var htmlArr = cityArr.map(function(item) {
        return "<option>" + item + "</option>";
    });
    pageState.nowSelectCity = cityArr[0];
    select.innerHTML = htmlArr.join("");
    // ��select�����¼�����ѡ����仯ʱ���ú���citySelectChange
    addEventHandler(select, 'change', citySelectChange);

}

/**
 * ��ʼ��ͼ����Ҫ�����ݸ�ʽ
 */
function initAqiChartData() {
    // ��ԭʼ��Դ���ݴ����ͼ����Ҫ�����ݸ�ʽ
    var week = {}, count = 0, singleWeek = {},
        month = {}, mcount = 0, singleMonth = {};

    for (var key in aqiSourceData) {
        var tempCity = aqiSourceData[key]
        var keyArr = Object.getOwnPropertyNames(tempCity);
        var tempMonth = keyArr[0].slice(5, 7);
        var weekInit = 4, weekCount = 0;
        for (var i = 0; i < keyArr.length; i++, weekInit++) {
            count += tempCity[keyArr[i]];
            mcount += tempCity[keyArr[i]];
            weekCount++;
            if ((weekInit+1) % 7 == 0 || i == keyArr.length - 1 || keyArr[i+1].slice(5, 7) !== tempMonth) {
                var tempKey = keyArr[i].slice(0, 7) + "�µ�" + (Math.floor(weekInit / 7) + 1) + "��";
                singleWeek[tempKey] = Math.floor(count / weekCount);

                if (i != keyArr.length - 1 && keyArr[i+1].slice(5, 7) !== tempMonth) {
                    weekInit = weekCount % 7;
                }
                count = 0;
                weekCount = 0;

                if (i == keyArr.length - 1 || keyArr[i+1].slice(5, 7) !== tempMonth) {
                    tempMonth = (i == keyArr.length - 1) ? keyArr[i].slice(5, 7) : keyArr[i+1].slice(5, 7);
                    var tempMKey = keyArr[i].slice(0, 7);
                    var tempDays = keyArr[i].slice(-2);
                    singleMonth[tempMKey] = Math.floor(mcount / tempDays);
                    mcount = 0;
                }
            }
        }
        week[key] = singleWeek;
        month[key] = singleMonth;
        singleWeek = {};
        singleMonth = {};
    }
    // ����õ����ݴ浽 chartData ��
    chartData.day = aqiSourceData;
    chartData.week = week;
    chartData.month = month;
    renderChart();
}

/**
 * ��ʼ������
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();
