/* 获取VSCodeAPI */
let vscode = acquireVsCodeApi();

/* 全局变量 */
let is_show_detail = false;		// 是否展开细节
let action_after_add = "remain";

let editing_type;
let editing_index;
let types = [];

/* 窗口加载 */
window.onload = function () {
	editor.style.display = "none";
	// 初始状态设置
	setElements();
	initialize();

	// 事项类型选择
	select_type.addEventListener("change", (event) => chooseType(event));

	// 周期选择
	cycle.addEventListener("change", (event) => chooseCycle(event));

	// 清空日志
	clear_log.addEventListener("click", () => {
		clearLog();
		postToExtension("clearLog");
	});

	// 确认编辑事项
	complete_button.addEventListener("click", () => edit());

	// 关闭事项编辑器
	close_editor.addEventListener("click", () => close("editor"));

	// 关闭事项详情
	close_item.addEventListener("click", () => close("item"));

	// 展开/收起详情编辑面板
	show_detail.addEventListener("click", () => show_detail_panel());

	// 自适应高度
	textarea.addEventListener("input", () => adaptiveHeight());

	// 扩展命令
	window.addEventListener("message", (event) => {
		let message = event.data;

		switch (message.command) {
			case "initialize":
				loadOption(message.data);
				break;

			case "add":
				readyAdd(message.data);
				break;

			case "edit":
				readyEdit();
				cover(message.data);
				break;

			case "information":
				information(message.data);
				break;

			case "log":
				clearLog();
				showLog(message.data);
				break;
		}
	});
}

/**
 * 获取标签对象
 * @param id 标签ID
 * @returns 标签对象
 */
function get(id) {
	return document.getElementById(id);
}

/**
 * 设置文档标签
 */
function setElements() {
	action_text = get("action_text");
	arrow_down = get("arrow_down");
	arrow_up = get("arrow_up");
	clear_log = get("clear_log");
	close_editor = get("close_editor");
	complete_button = get("complete_button");
	cycle = get("cycle");
	daily = get("daily");
	datetime = get("datetime");
	detail_panel = get("detail_panel");
	particulars_value = get("particulars_value");
	editor = get("editor");
	editor_title = get("editor_title");
	input_type = get("other_type");
	item_information = get("item_information");
	item_label = get("item_label");
	item_type = get("item_type");
	item_priority = get("item_priority");
	item_place = get("item_place");
	item_mail = get("item_mail");
	item_particulars = get("item_particulars");
	item_time = get("item_time");
	label = get("label");
	label_value = get("label_value");
	log_list = get("log_list");
	mail = get("mail");
	mail_value = get("mail_value");
	maximum = get("maximum");
	once = get("once");
	other = get("other");
	place = get("place");
	place_value = get("place_value");
	priority = get("priority");
	priority_value = get("priority_value");
	select_time = get("select_time");
	select_type = get("select_type");
	show_detail = get("show_detail");
	time_type = get("time_type");
	time_value = get("time_value");
	textarea = get("particulars");
	type_value = get("type_value");
	weekly = get("weekly");
}

/**
 * 初始化编辑器
 */
function initialize() {
	editing_type = "";
	editing_index = 0;

	select_type.selectedIndex = 0;
	cycle.selectedIndex = 0;
	priority.selectedIndex = 0;

	input_type.value = "";
	label.value = "";
	place.value = "";
	mail.value = "";
	particulars.value = "";

	other_label.style.display = "none";
	once.style.display = "none";
	daily.style.display = "none";
	weekly.style.display = "none";

	textarea.style.height = "18px";
}

/**
 * 类别选择
 * @param event 事件
 */
function chooseType(event) {
	let type = event.target.options[event.target.selectedIndex].text;

	if (type == "其它") {
		other_label.style.display = "flex";
	} else {
		other_label.style.display = "none";
	}
}

/**
 * 周期选择
 * @param event 事件
 */
function chooseCycle(event) {
	let cycle = event.target.options[event.target.selectedIndex].text;

	if (cycle == "单次") {
		once.style.display = "flex";
		daily.style.display = "none";
		weekly.style.display = "none";
	} else if (cycle == "每日") {
		once.style.display = "none";
		daily.style.display = "flex";
		weekly.style.display = "none";
	} else if (cycle == "每周") {
		once.style.display = "none";
		daily.style.display = "flex";
		weekly.style.display = "flex";
	} else {
		once.style.display = "none";
		daily.style.display = "none";
		weekly.style.display = "none";
	}
}

/**
 * 显示细节面板
 */
function show_detail_panel() {
	is_show_detail = !is_show_detail;
	if (is_show_detail) {
		action_text.innerHTML = "收起";
		arrow_down.style.display = "none";
		arrow_up.style.display = "inline";

		detail_panel.style.display = "flex";
		adaptiveHeight();
	} else {
		action_text.innerHTML = "展开";
		arrow_down.style.display = "inline";
		arrow_up.style.display = "none";

		detail_panel.style.display = "none";
	}
}

/**
 * 文本框自适应高度
 */
function adaptiveHeight() {
	textarea.style.height = "18px";
	textarea.style.height = textarea.scrollHeight - 6 + "px";
}

/**
 * 关闭编辑器
 */
function close(panel) {
	switch (panel) {
		case "editor":
			editor.style.display = "none";
			break;

		case "item":
			item_information.style.display = "none";
			break;
	}

}

/**
 * 设置新建编辑器
 */
function readyAdd(action) {
	editor.style.display = "flex";
	action_after_add = action;

	label.focus();
	initialize();
	editor_title.innerHTML = "新建事项";

	let current_time = new Date();
	weekly.selectedIndex = (current_time.getDay() + 6) % 7;
	datetime.value = current_time.getFullYear() + "-" + (current_time.getMonth() + 1).toString().padStart(2, "0") + "-" + current_time.getDate().toString().padStart(2, "0") + "T" + current_time.getHours().toString().padStart(2, "0") + ":" + current_time.getMinutes().toString().padStart(2, "0");
	select_time.value = current_time.getHours().toString().padStart(2, "0") + ":" + current_time.getMinutes().toString().padStart(2, "0");
}

/**
 * 设置修改编辑器
 */
function readyEdit() {
	editor.style.display = "flex";

	label.focus();
	editor_title.innerHTML = "编辑事项";
}

/**
 * 显示日志
 * @param log_data 日志数据
 */
function showLog(log_data) {
	for (let index = 0; index < log_data.length; index++) {
		let new_list_item = document.createElement("li");

		let time_information = document.createElement("span");
		time_information.setAttribute("class", "time_information");
		time_information.innerHTML = log_data[index].time + " :   ";

		let log_information = document.createElement("span");
		log_information.setAttribute("class", "log_information");
		log_information.innerHTML = log_data[index].information;

		new_list_item.appendChild(time_information);
		new_list_item.appendChild(log_information);

		log_list.appendChild(new_list_item);
	}
}

/**
 * 清空日志
 */
function clearLog() {
	while (log_list.firstElementChild) {
		log_list.removeChild(log_list.firstElementChild);
	}
}

/**
 * 与扩展通信
 * @param command 命令文本
 * @param data 通信数据
 */
function postToExtension(command, data) {
	let message = {
		command: command,
		data: data
	}

	vscode.postMessage(message);
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