/* 获取VSCodeAPI */
let vscode = acquireVsCodeApi();

/* 全局变量 */
let editing_type = "";
let editing_index = 0;
let types = [];

/* 窗口加载 */
window.onload = function () {
	// 初始状态设置
	setElements();
	other_label.style.display = "none";
	once.style.display = "none";
	daily.style.display = "none";
	weekly.style.display = "none";

	// 事项类型
	select_type.addEventListener("change", (event) => chooseType(event));

	// 周期
	cycle.addEventListener("change", (event) => chooseCycle(event));

	// 确认编辑事项
	complete.addEventListener("click", () => edit());

	// 自适应高度
	textarea.addEventListener("input", () => adaptiveHeight());

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
	select_type = get("select_type");
	label = get("label");
	cycle = get("cycle");
	complete = get("complete");
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
	time = get("time");
	datetime = get("datetime");
}

/**
 * 加载选项
 */
function loadOption(data) {
	types = data.types;

	for (let index = 0; index < data.types.length; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = data.types[index];
		select_type.insertBefore(new_option, other);
	}

	maximum.innerHTML = data.maximum_priority + 1;

	for (let index = 0; index <= data.maximum_priority; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = index;
		priority.insertBefore(new_option, maximum);
	}
	priority.selectedIndex = 0;
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
 * 文本框自适应高度
 */
function adaptiveHeight() {
	textarea.style.height = "18px";
	textarea.style.height = textarea.scrollHeight - 6 + "px";
}

/**
 * 确认编辑事项
 */
function edit(is_new = false) {
	if (is_new) {
		editing_type = select_type.options[select_type.selectedIndex].text;
	}

	console.log(datetime.value);
	// datetime: 2021-11-23T09:50
	// time: 09:50

	let new_cycle;
	let new_time;
	switch (cycle.options[cycle.selectedIndex].text) {
		case "长期":
			break;

		case "单次":
			new_time = datetime.value;
			break;

		case "每日":
			new_cycle = "daily";
			new_time = time.value;

			break;

		case "每周":
			new_cycle = "weekly";
			new_time = time.value;
			break;
	}

	let new_item = {
		label: label.value,
		priority: parseInt(priority.options[priority.selectedIndex].text),
		place: place.value,
		mail: mail.value,
		detail: textarea.value,
		cycle: new_cycle
	}
}

function cover(item) {
	editing_type = item.type;
	editing_index = item.index;

	if (item.type == "普通") {
		select_type.selectedIndex = 0;
	} else {
		select_type.selectedIndex = types.indexOf(item.type) + 1;
	}

	label.value = item.label;

	if (item.place) {
		place.value = item.place;
	} else {
		place.value = "";
	}

	if (item.mail) {
		mail.value = item.mail;
	} else {
		mail.value = "";
	}

	if (item.detail) {
		textarea.value = item.detail;
		textarea.style.height = textarea.scrollHeight - 6 + "px";
	} else {
		textarea.value = "";
	}

	priority.selectedIndex = item.priority;

	if (item.cycle) {
		if (item.cycle == "daily") {
			cycle.selectedIndex = 2;

			once.style.display = "none";
			daily.style.display = "flex";
			weekly.style.display = "none";
		}

		if (item.cycle == "weekly") {
			cycle.selectedIndex = 3;

			once.style.display = "none";
			daily.style.display = "flex";
			weekly.style.display = "flex";
		}
	} else {
		if (item.time) {
			cycle.selectedIndex = 1;

			once.style.display = "flex";
			daily.style.display = "none";
			weekly.style.display = "none";
		} else {
			cycle.selectedIndex = 0;

			once.style.display = "none";
			daily.style.display = "none";
			weekly.style.display = "none";
		}
	}
}