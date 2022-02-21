/* 全局变量 */
let action_after_add = "";						// 新建后动作
let lists = [];									// 清单数据
let task_id = undefined;						
let remain_task = {								// 保留任务数据
	id: undefined,
	priority: undefined
};
let remain_item = {								// 保留事项数据
	id: undefined,
	label: undefined,
	type: undefined,
	priority: undefined,
	entry: {}
};

/* 窗口加载 */
window.onload = function () {
	registerEvent();
}

/* 时间工具 */
/**
 * 将"YYYY/MM/DD-hh:mm"转换为时间整型 | 将Date对象转换为时间整型
 * @param {string|Date} time 时间文本 | Date对象
 * @returns 时间整型
 */
function parseTime(time) {
	return new Date(time).getTime();
}

/**
 * 将Date对象转换为时间字符串"YYYY/MM/DD-hh:mm"
 * @param {Date} time Date对象
 * @returns 时间文本
 */
function textualizeTime(time) {
	return time.getFullYear() + "/" + (time.getMonth() + 1).toString().padStart(2, "0") + "/" + time.getDate().toString().padStart(2, "0") + "-" + time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0");
}

/**
 * 生成指定长度的随机码
 * @param {number} length 字符长度
 * @returns 随机码
 */
function code(length) {
	let character_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefgijklmnopqrstuvwxyz";

	let code_text = "";
	for (let index = 0; index < length; index++) {
		code_text += character_table.charAt(Math.floor((Math.random() * character_table.length)));
	}

	return code_text;
}

/**
 * 复制数据对象
 * @param {any} object 被复制的数据对象
 * @returns 数据对象的值
 */
function copy(object) {
	return JSON.parse(JSON.stringify(object));
}
