/* 获取VSCodeAPI */
let vscode = acquireVsCodeApi();

/* 全局变量 */
let editing_type = "";
let editing_index = 0;
let types = [];

/* 窗口加载 */
window.onload = function () {
	// 初始状态设置
	document.getElementById("other_label").style.display = "none";
	document.getElementById("once").style.display = "none";
	document.getElementById("daily").style.display = "none";
	document.getElementById("weekly").style.display = "none";

	// 事项类型
	let type = document.getElementById("type");
	type.addEventListener("change", (event) => chooseType(event));

	// 周期
	let cycle = document.getElementById("cycle");
	cycle.addEventListener("change", (event) => chooseCycle(event));

	// 确认编辑事项
	let confirm = document.getElementById("confirm");
	confirm.addEventListener("click", () => edit());

	// 扩展命令
	window.addEventListener("message", (event) => {
		let message = event.data;

		switch (message.command) {
			case "edit":
				cover(message.data);
				break;

			case "initialize":
				loadOption(message.data);
				break;
		}
	});
}

/**
 * 加载选项
 */
function loadOption(data) {
	types = data.types;

	let type = document.getElementById("type");
	let other = document.getElementById("other");

	for (let index = 0; index < data.types.length; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = data.types[index];
		type.insertBefore(new_option, other);
	}


	let priority = document.getElementById("priority");
	let maximum = document.getElementById("maximum");
	maximum.innerHTML = data.maximum_priority + 1;

	for (let index = 0; index <= data.maximum_priority; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = index;
		priority.insertBefore(new_option, maximum);
	}
	document.getElementById("priority").selectedIndex = 0;
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

}

function cover(item) {
	editing_type = item.type;
	editing_index = item.index;

	if (item.type == "普通") {
		document.getElementById("type").selectedIndex = 0;
	} else {
		document.getElementById("type").selectedIndex = types.indexOf(item.type) + 1;
	}

	document.getElementById("label").value = item.label;

	if (item.place) {
		document.getElementById("place").value = item.place;
	} else {
		document.getElementById("place").value = "";
	}

	if (item.mail) {
		document.getElementById("mail").value = item.mail;
	} else {
		document.getElementById("mail").value = "";
	}

	if (item.detail) {
		document.getElementById("detail").value = item.detail;
	} else {
		document.getElementById("detail").value = "";
	}

	document.getElementById("priority").selectedIndex = item.priority;

	let once = document.getElementById("once");
	let daily = document.getElementById("daily");
	let weekly = document.getElementById("weekly");

	if (item.cycle) {
		if (item.cycle == "daily") {
			document.getElementById("cycle").selectedIndex = 2;

			once.style.display = "none";
			daily.style.display = "flex";
			weekly.style.display = "none";
		}

		if (item.cycle == "weekly") {
			document.getElementById("cycle").selectedIndex = 3;

			once.style.display = "none";
			daily.style.display = "flex";
			weekly.style.display = "flex";
		}
	} else {
		if (item.time) {
			document.getElementById("cycle").selectedIndex = 1;

			once.style.display = "flex";
			daily.style.display = "none";
			weekly.style.display = "none";
		} else {
			document.getElementById("cycle").selectedIndex = 0;

			once.style.display = "none";
			daily.style.display = "none";
			weekly.style.display = "none";
		}
	}
}