/* 获取VSCodeAPI */
let vscode = acquireVsCodeApi();

/* 全局变量 */
let is_show_detail = false;

let editing_type;
let editing_index;
let types = [];

/* 窗口加载 */
window.onload = function () {
	editor.style.display = "none";
	// 初始状态设置
	setElements();
	initialize();

	// 事项类型
	select_type.addEventListener("change", (event) => chooseType(event));

	// 周期
	cycle.addEventListener("change", (event) => chooseCycle(event));

	// 确认编辑事项
	complete_button.addEventListener("click", () => edit());

	// 关闭事项编辑器
	close_editor.addEventListener("click", () => { editor.style.display = "none" });

	show_detail.addEventListener("click", () => show_detail_panel())

	// 自适应高度
	textarea.addEventListener("input", () => adaptiveHeight());

	// 扩展命令
	window.addEventListener("message", (event) => {
		let message = event.data;

		switch (message.command) {
			case "add":
				readyAdd();
				break;

			case "edit":
				readyEdit();
				cover(message.data);
				break;

			case "initialize":
				loadOption(message.data);
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
	editor = get("editor");
	editor_title = get("editor_title");
	select_type = get("select_type");
	label = get("label");
	cycle = get("cycle");
	complete_button = get("complete_button");
	textarea = get("detail");
	other = get("other");
	priority = get("priority");
	maximum = get("maximum");
	input_type = get("other_type");
	place = get("place");
	mail = get("mail");
	once = get("once");
	daily = get("daily");
	weekly = get("weekly");
	select_time = get("select_time");
	datetime = get("datetime");
	weekly = get("weekly");
	close_editor = get("close_editor");
	show_detail = get("show_detail");
	detail_panel = get("detail_panel");
	action_text = get("action_text");
	arrow_down = get("arrow_down");
	arrow_up = get("arrow_up");
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

	label.value = "";
	place.value = "";
	mail.value = "";
	detail.value = "";

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

		detail_panel.style.display="flex";
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
 * 设置新建编辑器
 */
function readyAdd() {
	editor.style.display = "flex";

	label.focus();
	initialize();
	editor_title.innerHTML = "新建事项";

	let current_time = new Date();
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
 * 将Date对象转换为时间字符串"YYYY/MM/DD-hh:mm"
 * @param time Date对象
 * @returns 时间文本
 */
function toString(time) {
	return time.getFullYear() + "/" + (time.getMonth() + 1).toString().padStart(2, "0") + "/" + time.getDate().toString().padStart(2, "0") + "-" + time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0");
}