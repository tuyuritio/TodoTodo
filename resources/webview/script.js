const path = require("path");

/* 获取VSCodeAPI */
let vscode = acquireVsCodeApi();

/* 窗口加载 */
window.onload = function () {
	// 初始状态设置
	document.getElementById("other_label").style.display = "none";
	document.getElementById("once").style.display = "none";
	document.getElementById("daily").style.display = "none";
	document.getElementById("weekly").style.display = "none";

	// 事项类型
	let type = document.getElementById("type");
	type.addEventListener("change", (e) => chooseType(e));

	// 周期
	let cycle = document.getElementById("cycle");
	cycle.addEventListener("change", (e) => chooseCycle(e));

	// 确认编辑事项
	let confirm = document.getElementById("confirm");
	confirm.addEventListener("click", () => edit());
}

/**
 * 加载选项
 */
function loadOption() {
	let read = new FileReader();
	let directory_path = __dirname + "\\..\\data\\todo_list";
	read.readAsText(directory_path);
}

/**
 * 类别选择
 * @param event 事件
 */
function chooseType(event) {
	let type = event.target.options[event.target.selectedIndex].text;

	let input_type = document.getElementById("other_label");
	if (type == "其它") {
		input_type.style.display = "flex";
	} else {
		input_type.style.display = "none";
	}
}

/**
 * 周期选择
 * @param event 事件
 */
function chooseCycle(event) {
	let cycle = event.target.options[event.target.selectedIndex].text;

	let once = document.getElementById("once");
	let daily = document.getElementById("daily");
	let weekly = document.getElementById("weekly");
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
 * 确认编辑事项
 */
function edit() {
	let type = document.getElementById("type");
	let other = document.getElementById("other");

	let new_option = document.createElement("option");
	new_option.innerHTML = "作业";
	type.insertBefore(new_option, other);

	console.log(file.getList());
}
