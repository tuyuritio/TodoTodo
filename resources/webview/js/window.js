/**
 * 初始化编辑器
 */
function initializeItemEditor() {
	editing_item = undefined;

	select_type.selectedIndex = 0;
	cycle.selectedIndex = 0;
	priority.selectedIndex = 0;
	entry_type.selectedIndex = 0;

	input_type.value = "";
	label.value = "";
	item_status.value = "待办";

	other_label.style.display = "none";
	once.style.display = "none";
	daily.style.display = "none";
	weekly.style.display = "none";
	item_cycle.style.display = "flex";
	add_entry_line.style.display = "flex";
	complete_button.style.display = "block";
	clearEntry();

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

		datetime.focus();
	} else if (cycle == "每日") {
		once.style.display = "none";
		daily.style.display = "flex";
		weekly.style.display = "none";

		select_time.focus();
	} else if (cycle == "每周") {
		once.style.display = "none";
		daily.style.display = "flex";
		weekly.style.display = "flex";

		weekly.focus();
	} else {
		once.style.display = "none";
		daily.style.display = "none";
		weekly.style.display = "none";
	}
}

/**
 * 条目选择
 * @param event 事件
 */
function chooseEntry(event) {
	let type = event.target.options[event.target.selectedIndex].text;

	if (type == "其它条目") {
		entry_input_type.style.display = "flex";
		entry_input_type.focus();
	} else {
		entry_input_type.style.display = "none";
		add_entry.focus();
	}
}

/**
 * 添加条目输入框
 */
function addEntry(type, content) {
	let new_entry = document.createElement("label");
	{
		let entry_type_text = document.createElement("span");
		entry_type_text.addEventListener("dblclick", (event) => deleteEntry(event));
		if (content) {
			if (type != "") {
				entry_type_text.innerHTML = type;
			}
		} else {
			if (entry_type.selectedIndex == 0) {
				entry_type_text.innerHTML = entry_input_type.value;
			} else {
				entry_type_text.innerHTML = entry_type.options[entry_type.selectedIndex].text;
			}
		}
		if (entry_type_text.innerHTML == "") {
			entry_type_text.style.backgroundColor = "var(--vscode-activityBar-background)";
		}
		new_entry.appendChild(entry_type_text);

		let entry_input = document.createElement("input");
		entry_input.type = "text";
		entry_input.className = "entry";
		entry_input.placeholder = "条目内容";
		if (content) {
			entry_input.value = content;
		}

		entry_input.addEventListener("keydown", (key) => {
			if (key.key == "Enter") {
				if (key.ctrlKey) {
					editItem();
				} else {
					entry_other_type.focus();
				}
			}
		});

		new_entry.appendChild(entry_input);
	}
	item_editor.insertBefore(new_entry, add_entry_line);
	new_entry.childNodes[1].focus();

	// 恢复默认选项
	entry_type.selectedIndex = 0;
	entry_other_type.style = "flex";
	entry_other_type.value = "";
}

/**
 * 删除条目
 * @param event 事件
 */
function deleteEntry(event) {
	item_editor.removeChild(event.target.parentNode);
}

/**
 * 清除条目
 */
function clearEntry() {
	entry_input_type.value = "";
	entry_input_type.style.display = "flex";

	while (document.getElementsByClassName("entry").length != 0) {
		let first_entry = document.getElementsByClassName("entry")[0];
		item_editor.removeChild(first_entry.parentNode);
	}
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

	if (data.status == "todo") {
		item_editor_title.innerHTML = "编辑事项";

		add_entry_line.style.display = "flex";
		complete_button.style.display = "block";
		item_cycle.style.display = "flex";

		item_status.value = "待办";
	} else {
		item_editor_title.innerHTML = "事项信息";

		add_entry_line.style.display = "none";
		complete_button.style.display = "none";
		item_cycle.style.display = "none";

		if (data.status == "done") {
			item_status.value = "已办";
		} else if (data.status == "fail") {
			item_status.value = "未办";
		}
	}
	cover(data);
}

/**
 * 设置清单编辑器
 */
function readyList() {
	list_editor.style.display = "flex";
}
