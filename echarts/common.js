const {
	request
} = require("http")

//日期格式化
function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str

}


//判断是否跨天
function crossDays(start, end) {
	// 最近一个小时跨天问题 以结束时间 如果最近一个小时存在跨天 比如当天时间为2021-09-22 00:08:00
	// 那么startTime =“2021-09-22 00:00:00”  endTime="2021-09-22 00:08:00"
	let startFormat = parseTime(start, "{y}-{m}-{d}");
	let startHmsFormat = parseTime(start, "{h}-{i}-{s}");
	let endFormat = parseTime(end, "{y}-{m}-{d}");
	let endHmsFormat = parseTime(end, "{h}-{i}-{s}");
	var endTime = new Date(end);
	var sumTime = endTime.getHours() + endTime.getMinutes() + endTime.getSeconds();
	var old_time = new Date(endFormat.replace(/-/g, "/"));
	var new_time = new Date(old_time.getTime() - 24 * 3600 * 1000);
	var new_format = parseTime(new_time, "{y}-{m}-{d}");
	if (startFormat != endFormat && (startFormat != new_format || sumTime != 0)) {
		return true;

	} else {
		return false;
	}

}







//  归并趋势图数据，自动补零
//  默认归并数据的就算方式为相加，若有其他计算方式，如健康度等，请实现自定义计算函数calculate
//   要求：1.data中的数据必须按照cycleTime(或者自定义的cycleTimeKey)升序
// 		2.刻度值必须是大于0的整数，如果不设置或者小于等于0，自动启用刻度自适应
// 		3.开始结束时间格式为 yyyy-MM-dd HH:mm:ss
// 调用示例
// const mergeData = mergeTrendData({
// 	data: res.result,
// 	startTime: '2021-08-06 00:00:00',
// 	endTime: '2021-08-06 00:00:00',
// 	fields: [
// 		//受理量
// 		{
// 			name: "completeCount"
// 		},
// 		//告警量
// 		{
// 			name: "alarmCount"
// 		},
// 		//健康度=（受理量-告警量） * 100
// 		{
// 			name: "healthRate",
// 			calcuate: (map, i) => {
// 				const completeCount = map.completeCountArr[i];
// 				const alarmCount = map.alarmCountArr[i];
// 				let healthRate = ((completeCount - alarmCount) * 100).toFixed(2);
// 				if (isNaN(healthRate)) {
// 					healthRate = 0;
// 				}
// 				return healthRate;
// 			}
// 		}
// 	],
// 	scale: 20,
// 	labelTimeFormatter: (labelTime, index) => {
// 		return parseTime(labelTime, '{h}:{i}');
// 	},
// 	cycleTimeKey: 'cycleTime'
// })




//config 归并配置
// data 要归并的数据集
// startTime 趋势图开始时间
// endTime 结束时间
// fields  要归并的字段
// scale  刻度（可选，如果不传会自动生成刻度）
// labelTimeFormatter 时间标签格式化：{y}-{m}-{d} {h}：{i}：{s} 默认是{h}：{i}，可自定义
//  cycleTimeKey 时间周期字段名 默认是cycleTime (可选)

function mergeTrendData(config) {
	//1接受参数 校验
	const data = config.data,
		startTime = config.startTime,
		endTime = config.endTime,
		fields = config.fields,
		labelTimeFormatter = config.labelTimeFormatter;

	let scale = config.scale;
	let trendSelfAdaptive = false;
	let labelTimePattern = '{h}:{i}';
	let cycleTimeKey = 'cycleTime';
	if (data === undefined || data === null || data.length <= 0) {
		alert("要归并的数据集为空")
	}
	if (startTime === undefined || startTime === null || startTime === '') {
		alert("开始时间为空")
	}


	if (endTime === undefined || endTime === null || endTime === '') {
		alert("结束时间为空")
	}
	if (fields === undefined || fields === null || fields === '') {
		alert("不存在要归并字段")
	}


	if (scale === undefined || scale === null || scale === '' || scale <= 0) {
		trendSelfAdaptive = true;
	}

	//设置时间标签格式化
	if (typeof (labelTimeFormatter) === 'string') {
		labelTimePattern = labelTimeFormatter;
	} else if (typeof (labelTimeFormatter) === 'function') {
		labelTimePattern = undefined;
	}

	//设置时间周期字段名
	if (config.cycleTimeKey !== undefined && config.cycleTimeKey !== null) {
		cycleTimeKey = config.cycleTimeKey;
	}


	//2 如果启动刻度自适应 则根据开始结束时间生成合适的刻度值
	const startTimeUsec = new Date(startTime).getTime(),
		endTimeUsec = new Date(endTime).getTime();

	if (trendSelfAdaptive) {
		const timeSpan = endTimeUsec - startTimeUsec;
		const m30Usec = 30 * 50 * 1000,
			h1Usec = 2 * m30Usec;
		h3Usec = 3 * h1Usec;
		h6Usec = 6 * h1Usec;
		h12Usec = 12 * h1Usec;
		h18Usec = 18 * h1Usec;
		h24Usec = 24 * h1Usec;

		if (timeSpan <= m30Usec) {
			//小于30分钟 刻度设置为1 刻度数量为[0,30]
			scale = 1;
		} else if (timeSpan <= h3Usec) {
			//大于30分钟小于3小时 刻度设置为5 ，刻度数量为【6,36】
			scale = 5;
		} else if (timeSpan <= h6Usec) {
			//大于3小时小于6小时 刻度设置为10 ，刻度数量为【18,36】
			scale = 10;
		} else if (timeSpan <= h12Usec) {
			//大于6小时小于12小时 刻度设置为15 ，刻度数量为【24,48】
			scale = 15;
		} else if (timeSpan <= h18Usec) {
			//大于12小时小于18小时 刻度设置为20 ，刻度数量为【36,54】
			scale = 20;
		} else if (timeSpan <= h24Usec) {
			//大于18小时小于24小时 刻度设置为25 ，刻度数量为【43,57】
			scale = 25;
		} else {
			//大于24小时，刻度统一为30
			scale = 30;
		}
	}
	//3. 根据开始结束时间 刻度生成时间轴
	const scaleUsec = scale * 60 * 1000,
		labelTimeArr = [],
		labelTimeUsecArr = [];
	let tempTimeUsec = startTimeUsec;
	while (tempTimeUsec <= endTimeUsec) {
		labelTimeArr.push(parseTime(tempTimeUsec, '{y}-{m}-{d} {h}:{i}:{s}'));
		labelTimeUsecArr.push(tempTimeUsec);
		tempTimeUsec += scaleUsec;
	}
	// 4. 生成要合并的字段结果集

	const resFieldMap = {};
	fields.forEach(field => {
		resFieldMap[field.name + 'Arr'] = [];
	});

	//5.归并数据 默认往前归并
	const resLabelTimeArr = [];
	let inx = 0;
	data.forEach(d => {
		const cycleTimeUsec = new Date(d[cycleTimeKey].substring(0, 19)).getTime();
		while (cycleTimeUsec >= labelTimeArr[inx]) {
			if (labelTimePattern === undefined) {

				//时间标签格式化函数
				resLabelTimeArr.push(labelTimeFormatter(labelTimeArr[inx], inx));
			} else {
				resLabelTimeArr.push(labelTimeFormatter(labelTimeArr[inx], labelTimePattern));

			}
			for (let key in resFieldMap) {
				resFieldMap[key].push(0);
			}
			inx++;
		}
		fields.forEach(field => {
			//非自定义计算函数 默认归并相加
			if (field.calcuate === undefined) {
				resFieldMap[field.name + 'Arr'][resLabelTimeArr.length - 1] += d[field.name];
			}
		});
	})

	//6. 补全时间轴 防止断数据时能补刻度
	while (inx < labelTimeArr.length) {
		if (labelTimePattern === undefined) {
			//时间标签格式化函数
			resLabelTimeArr.push(labelTimeFormatter(labelTimeArr[inx], inx));
		} else {
			resLabelTimeArr.push(parseTime(labelTimeArr[inx], labelTimePattern));
		}
		for (let key in resFieldMap) {
			resFieldMap[key].push(0);
		}
		inx++;
	}

	//7处理自定义函数并归计算
	fields.forEach(field => {

		if (typeof (field.calcuate) === 'function') {
			for (let i = 0; i < inx; i++) {
				resFieldMap[field.name + 'Arr'][i] = field.calcuate(resFieldMap, i);
			}
		}
	});

	//8 如果刻度小于30. 去掉最后一个点
	if (scale <= 30 && resLabelTimeArr.length > 0) {
		resLabelTimeArr.pop();
		for (let key in resFieldMap) {
			resFieldMap[key].pop();
		}

	}
	//9 返回归并结果集
	return {
		resLabelTimeArr,
		resFieldMap
	}
}


// 根据后端返回的流下载文件

function downloadFromBlob(blob, excelName, fullName) {
	const o = {
		flag: false,
		msg: ''
	};
	return new Promise((resolve, reject) => {
		if (blob.type === 'application/json') {
			blob.text().then(txt => {
				const json = JSON.parse(txt);
				o.flag = false;
				o.msg = json.msg;
				resolve(o);
			});
		} else {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = (e) => {
				const a = document.createElement('a');
				a.download = fullName || excelName + '_' + parseTime(new Date(), '{y}{m}{d}{h}{i}{s}') + '.xlsx';
				a.href = e.target.result;
				a.style.display = 'none';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
			o.flag = true;
			o.msg = 'success';
			resolve(o);
		}
	})
}








// 使用方法
// function importTemplate(data){
// 	return request({
// 		url:"http://...",
// 		method:'get',
// 		params:data,
// 		responseType:'blob'
// 	})
// }
// downloadTemplate(){
//  importTemplate().then(res =>{
// 	downloadFromBlob(res,"列表").then(o =>{
// 		if(!o.flag){
// 			alert("失败")
// 		}
// 	})

//  });
// }