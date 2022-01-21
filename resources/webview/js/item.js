/**
 * 加载选项
 * @param data 选项数据
 */
function loadOption(data) {
	// 选项清空
	while (select_type.firstElementChild.id != "other") {
		select_type.removeChild(select_type.firstElementChild);
	}

	while (priority.firstElementChild.id != "maximum") {
		priority.removeChild(priority.firstElementChild);
	}

	while (list_table.firstElementChild) {
		list_table.removeChild(list_table.firstElementChild);
	}

	while (entry_type.children[1]) {
		entry_type.removeChild(entry_type.children[1]);
	}

	// 事项类别
	lists = data.lists;
	let select_editing_type = 0;
	for (let index = 0; index < data.lists.length; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = lists[index].type;
		if (option_data.type == lists[index].type) {				// 新建类别后保留原有类别选项
			select_editing_type = index;
		}
		select_type.insertBefore(new_option, other);
	}
	select_type.selectedIndex = select_editing_type;
	other_label.style.display = "none";

	// 优先层级
	for (let index = 0; index <= data.item_maximum_priority; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = index;
		priority.insertBefore(new_option, maximum);
	}
	maximum.innerHTML = data.item_maximum_priority + 1;
	priority.selectedIndex = option_data.priority;					// 新建事项后保留原有优先级选项

	// 清单列表
	for (let index = 0; index < data.lists.length; index++) {
		let new_list = document.createElement("tr");

		// 清单名称输入框
		let tabel_data_label = document.createElement("td");

		let label_input = document.createElement("input");
		label_input.type = "text";
		label_input.id = "new_type_" + index;
		label_input.value = data.lists[index].type;
		label_input.addEventListener("keydown", (key) => {
			if (key.key == "Enter") {
				editList(index);
			}

			if (key.key == "Delete" && key.shiftKey) {
				label_input.value = "";
			}
		});
		if (!index) {
			label_input.disabled = "disabled";
		}

		tabel_data_label.appendChild(label_input);

		// 获取清单优先层级序列
		let tabel_data_select = document.createElement("td");

		let new_selector = document.createElement("select");
		for (let i = 0; i <= data.list_maximum_priority + 1; i++) {
			let new_option = document.createElement("option");
			new_option.innerHTML = i;
			new_selector.appendChild(new_option);
		}
		new_selector.selectedIndex = data.lists[index].priority;
		new_selector.id = "new_priority_" + index;
		new_selector.addEventListener("keydown", (key) => {
			if (key.key == "Enter") {
				editList(index);
			}
		});

		tabel_data_select.appendChild(new_selector);

		// 剩余代办
		let table_data_quantity = document.createElement("td");
		table_data_quantity.innerHTML = data.lists[index].quantity;
		table_data_quantity.style.textAlign = "center";

		// 按钮
		let tabel_data_button = document.createElement("td");

		let edit_button = document.createElement("button");
		edit_button.innerHTML = "编辑";
		edit_button.addEventListener("click", () => editList(index));
		tabel_data_button.appendChild(edit_button);

		if (index) {
			let delete_button = document.createElement("button");
			delete_button.innerHTML = "删除";

			let list_data = {
				label: data.lists[index].type
			};

			delete_button.addEventListener("click", () => postToExtension("deleteList", list_data));
			tabel_data_button.appendChild(delete_button);
		}

		new_list.appendChild(tabel_data_label);
		new_list.appendChild(tabel_data_select);
		new_list.appendChild(table_data_quantity);
		new_list.appendChild(tabel_data_button);

		list_table.appendChild(new_list);
	}

	// 条目类型列表
	for (let index = 0; index < data.entry_types.length; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = data.entry_types[index];
		entry_type.appendChild(new_option, other);
	}
}

/**
 * 覆盖文本数据
 */
function cover(item) {
	let exist_type = -1;
	for (let index = 0; index < lists.length; index++) {
		if (lists[index].type == item.type) {
			select_type.selectedIndex = index;
			exist_type = 0;

			break;
		}
	}
	if (exist_type == -1) {
		select_type.selectedIndex = lists.length;
		other_label.style.display = "flex";
		other_type.value = item.type;
	} else {
		other_label.style.display = "none";
		other_type.value = "";
	}

	label.value = item.label;
	priority.selectedIndex = item.priority;

	if (item.cycle) {
		if (item.cycle == "daily") {
			cycle.selectedIndex = 2;
			once.style.display = "none";
			daily.style.display = "flex";
			weekly.style.display = "none";

			select_time.value = item.time.substr(11, 5);
		}

		if (item.cycle == "weekly") {
			cycle.selectedIndex = 3;
			once.style.display = "none";
			daily.style.display = "flex";
			weekly.style.display = "flex";

			weekly.selectedIndex = (toDate(item.time).getDay() + 6) % 7;
			select_time.value = item.time.substr(11, 5);
		}
	} else {
		if (item.time) {
			cycle.selectedIndex = 1;
			once.style.display = "flex";
			daily.style.display = "none";
			weekly.style.display = "none";

			datetime.value = item.time.replace("-", "T").replaceAll("/", "-");
		} else {
			cycle.selectedIndex = 0;
			once.style.display = "none";
			daily.style.display = "none";
			weekly.style.display = "none";
		}
	}

	clearEntry();
	for (let entry_type in item.entry) {
		addEntry(entry_type, item.entry[entry_type].content);
	}

	label.focus();
}

/**
 * 提交编辑事项
 */
function editItem() {
	// 编辑时间
	let current_time = new Date();
	let new_time;
	let time_string;
	let new_cycle;

	switch (cycle.options[cycle.selectedIndex].text) {
		case "长期":
			break;

		case "单次":
			time_string = datetime.value.replaceAll("-", "/").replace("T", "-");

			// 检测输入时间是否逾期
			if (toNumber(time_string) < toNumber(current_time)) {
				postToExtension("warning", "请选择一个未来的时间！");
				return;
			}

			break;

		case "每日":
			new_cycle = "daily";

			new_time = new Date(current_time.getFullYear(), current_time.getMonth(), current_time.getDate(), parseInt(select_time.value.substr(0, 2)), parseInt(select_time.value.substr(3, 2)));
			while (new_time < current_time) {
				new_time.setDate(new_time.getDate() + 1);
			}

			time_string = toString(new_time);
			break;

		case "每周":
			new_cycle = "weekly";
			let week_day = weekly.selectedIndex;

			new_time = new Date(current_time.getFullYear(), current_time.getMonth(), current_time.getDate() - (current_time.getDay() + 6) % 7 + week_day, parseInt(select_time.value.substr(0, 2)), parseInt(select_time.value.substr(3, 2)));
			while (new_time < current_time) {
				new_time.setDate(new_time.getDate() + 7);
			}

			time_string = toString(new_time);
			break;
	}

	// 编辑类别
	let new_type = select_type.options[select_type.selectedIndex].text;
	if (new_type == "其它") {
		new_type = input_type.value;
	}

	// 检测必填项
	let space_label = label.value.replaceAll(" ", "");
	let space_type = input_type.value.replaceAll(" ", "");

	if (space_label == "" || new_type == "其它" && space_type == "") {
		postToExtension("warning", "请输入必填项！");
		return;
	}

	// 编辑条目
	let entries = {};
	let entry_values = document.getElementsByClassName("entry");
	for (let index = 0; index < entry_values.length; index++) {
		if (entry_values[index].value.replaceAll(" ", "") != "") {							// 检测空条目内容
			let type = entry_values[index].parentNode.childNodes[0].innerHTML;

			if (editing_item && editing_item.entry && editing_item.entry[type]) {			// 原条目存在
				entries[type] = copy(editing_item.entry[type]);
				if (entries[type].content != entry_values[index].value) {					// 条目更改
					entries[type].content = entry_values[index].value;
					entries[type].on = true;
				}
			} else {
				entries[type] = {
					id: code(8),
					content: entry_values[index].value,
					on: true
				};
			}
		}
	}
	if (Object.keys(entries).length == 0) {
		entries = undefined;
	}

	let new_item = {
		id: editing_item ? editing_item.id : code(8),
		type: new_type,
		label: label.value,
		priority: priority.selectedIndex,
		cycle: new_cycle,
		time: time_string,
		entry: entries
	};

	let data = {
		old_item: editing_item,			// 将要删除的原有事项
		new_item: new_item
	};

	postToExtension("add", data);

	if (editing_item) {
		close("item_editor");
	} else {
		switch (action_after_add) {
			case "remain":
				option_data = {
					type: new_item.type,
					priority: new_item.priority
				};
				cover(new_item);
				break;

			case "clear":
				initializeItemEditor();
				break;

			case "close":
				close("item_editor");
				break;

			default:
				break;
		}
	}
}

/**
 * 提交编辑清单
 */
function editList(index) {
	let new_type = get("new_type_" + index).value;
	let new_priority = get("new_priority_" + index).selectedIndex;

	let data = {
		old: {
			type: lists[index].type,
			priority: lists[index].priority
		},
		new: {
			type: new_type,
			priority: new_priority
		},
		index: index
	}

	postToExtension("list", data);
}
