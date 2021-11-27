/* 获取VSCodeAPI */
let vscode = acquireVsCodeApi();

/* 全局变量 */
let is_show_detail = false;			// 是否展开细节
let action_after_add = "remain";

let is_new;							// 记录当前编辑器状态为新建或编辑
let editing_type;					// 记录编辑前的事项类别
let editing_index;					// 记录编辑前事项所处清单的位置，以便后期删除原事项
let editing_priority;

let types = [];						// 清单数据

/* 窗口加载 */
window.onload = function () {
	// 初始状态设置
	setElements();
	initializeItemEditor();
	addEvents();
	nextEvents();
}

/* 时间辅助 */
/**
 * 将时间字符串"YYYY/MM/DD-hh:mm"转换为Date对象
 * @param time 时间文本
 * @returns Date对象
 */
function toDate(time) {
	let year = Number(time.substr(0, 4));
	let month = Number(time.substr(5, 2));
	let day = Number(time.substr(8, 2));
	let hour = Number(time.substr(11, 2));
	let minute = Number(time.substr(14, 2));

	return new Date(year, month - 1, day, hour, minute);
}

/**
 * 将"YYYY/MM/DD-hh:mm"转换为数字 | 将Date对象转换为数字
 * @param time Date文本 | Date对象
 * @returns Milliseconds
 */
function toNumber(time) {
	let time_object = new Date();

	if (typeof time == "string") {
		let year = Number(time.substr(0, 4));
		let month = Number(time.substr(5, 2));
		let day = Number(time.substr(8, 2));
		let hour = Number(time.substr(11, 2));
		let minute = Number(time.substr(14, 2));

		time_object = new Date(year, month - 1, day, hour, minute);
	}

	if (time instanceof Date) {
		time_object = time;
	}

	return time_object.valueOf();
}

/**
 * 将Date对象转换为时间字符串"YYYY/MM/DD-hh:mm"
 * @param time Date对象
 * @returns 时间文本
 */
function toString(time) {
	return time.getFullYear() + "/" + (time.getMonth() + 1).toString().padStart(2, "0") + "/" + time.getDate().toString().padStart(2, "0") + "-" + time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0");
}