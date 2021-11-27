/**
 * 初始化编辑器
 */
function initializeItemEditor() {
	editing_type = "";
	editing_index = 0;
	editing_priority = 0;

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

	let current_time = new Date();
	weekly.selectedIndex = (current_time.getDay() + 6) % 7;
	datetime.value = current_time.getFullYear() + "-" + (current_time.getMonth() + 1).toString().padStart(2, "0") + "-" + current_time.getDate().toString().padStart(2, "0") + "T" + current_time.getHours().toString().padStart(2, "0") + ":" + current_time.getMinutes().toString().padStart(2, "0");
	select_time.value = current_time.getHours().toString().padStart(2, "0") + ":" + current_time.getMinutes().toString().padStart(2, "0");
}

/**
 * 类别选择
 * @param event 事件
 */
function chooseType(event) {
	let type = event.target.options[event.target.selectedIndex].text;

	if (type == "其它") {
		other_label.style.display = "flex";
		other_label.focus();
	} else {
		other_label.style.display = "none";
		label.focus();
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
function showDetailPanel() {
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
		case "list_editor":
			list_editor.style.display = "none";
			break;

		case "item_editor":
			item_editor.style.display = "none";
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
	is_new = true;

	item_editor.style.display = "flex";
	action_after_add = action;

	label.focus();
	item_editor_title.innerHTML = "新建事项";
	initializeItemEditor();
}

/**
 * 设置修改编辑器
 */
function readyEdit(data) {
	is_new = false;

	item_editor.style.display = "flex";

	label.focus();
	item_editor_title.innerHTML = "编辑事项";
	cover(data);
}

/**
 * 设置清单编辑器
 */
function readyList() {
	list_editor.style.display = "flex";
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
function clearAllLog() {
	while (log_list.firstElementChild) {
		log_list.removeChild(log_list.firstElementChild);
	}
}
