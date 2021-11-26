/**
 * 加载选项
 */
function loadOption(data) {
	// 事项类别
	while (other.previousElementSibling.innerHTML != "==事项类别==") {
		select_type.removeChild(other.previousElementSibling);
	}

	types = data.types;
	for (let index = 0; index < data.types.length; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = types[index].type;
		select_type.insertBefore(new_option, other);
	}

	// 优先层级
	maximum.innerHTML = data.item_maximum_priority + 1;
	while (priority.firstElementChild.id != "maximum") {
		priority.removeChild(priority.firstElementChild);
	}

	for (let index = 0; index <= data.item_maximum_priority; index++) {
		let new_option = document.createElement("option");
		new_option.innerHTML = index;
		priority.insertBefore(new_option, maximum);
	}
	priority.selectedIndex = 0;

	// 清单列表
	while (lists_list.firstElementChild) {
		lists_list.removeChild(lists_list.firstElementChild);
	}

	for (let index = 0; index < data.types.length; index++) {
		let new_list = document.createElement("p");

		let name_label = document.createElement("span");
		name_label.innerHTML = "名称：";

		let name_input = document.createElement("input");
		name_input.type = "text";
		name_input.value = data.types[index].type;
		name_input.id = "new_type_" + index;

		let priority_label = document.createElement("span");
		priority_label.innerHTML = "层级：";

		// 获取列表优先层级序列
		let new_selector = document.createElement("select");
		for (let i = 0; i <= data.list_maximum_priority + 1; i++) {
			let new_option = document.createElement("option");
			new_option.innerHTML = i;
			new_selector.appendChild(new_option);
		}
		new_selector.selectedIndex = data.types[index].priority;
		new_selector.id = "new_priority_" + index;

		let edit_button = document.createElement("button");
		edit_button.innerHTML = "编辑";
		edit_button.addEventListener("click", () => editList(index));

		let delete_button = document.createElement("button");
		delete_button.innerHTML = "删除";
		delete_button.addEventListener("click", () => postToExtension("delete", index));

		new_list.appendChild(name_label);
		new_list.appendChild(name_input);
		new_list.appendChild(priority_label);
		new_list.appendChild(new_selector);
		new_list.appendChild(edit_button);
		new_list.appendChild(delete_button);

		lists_list.appendChild(new_list);
	}
}

/**
 * 覆盖文本数据
 * @param item 事项对象
 */
function cover(item) {
	editing_type = item.type;
	editing_index = item.index;

	if (item.type == "普通") {
		select_type.selectedIndex = 0;
	} else {
		select_type.selectedIndex = types.indexOf(item.type) + 1;
	}

	label.value = item.label;
	priority.selectedIndex = item.priority;

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

	if (item.particulars) {
		textarea.value = item.particulars;
	} else {
		textarea.value = "";
	}
	adaptiveHeight();

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
	if (new_type == "==事项类别==") {
		new_type = "普通";
	} else if (new_type == "其它") {
		new_type = input_type.value;
	}

	// 检测必填项
	let space_label = label.value.replaceAll(" ", "");
	let space_type = input_type.value.replaceAll(" ", "");

	if (space_label == "" || new_type == "其它" && space_type == "") {
		postToExtension("warning", "请输入必填项！");
		return;
	}

	let new_item = {
		type: new_type,
		label: label.value,
		priority: parseInt(priority.options[priority.selectedIndex].text),
		cycle: new_cycle,
		time: time_string,
		place: place.value,
		mail: mail.value,
		particulars: textarea.value
	};

	let data = {
		old_item: {				// 将要删除的原有事项
			type: editing_type,
			index: editing_index
		},
		new_item: new_item
	};

	postToExtension("add", data);

	if (editing_type != "") {
		closeEditor();
	} else {
		switch (action_after_add) {
			case "remain":
				break;

			case "clear":
				initialize();
				break;

			case "close":
				closeEditor();
				break;

			default:
				break;
		}
	}
}

/**
 * 显示事项信息
 * @param item 事项对象
 */
function information(item) {
	item_information.style.display = "flex";

	label_value.innerHTML = item.label;
	type_value.innerHTML = item.type;
	priority_value.innerHTML = item.priority;

	item_time.style.display = "flex";
	if (item.cycle) {

		let time_text = "";

		switch (item.cycle) {
			case "daily":
				time_text += "每日" + item.time.substr(11, 5);
				break;

			case "weekly":
				let week_days = "一二三四五六日";

				time_text += "每周"
				time_text += week_days.charAt((toDate(item.time).getDay() + 6) % 7);
				time_text += item.time.substr(11, 5);

				break;
		}

		time_value.innerHTML = time_text;
	} else if (item.time) {
		time_value.innerHTML = item.time;
	} else {
		item_time.style.display = "none";
	}

	if (item.place) {
		item_place.style.display = "flex";

		place_value.innerHTML = item.place;
	} else {
		item_place.style.display = "none";
	}

	if (item.mail) {
		item_mail.style.display = "flex";

		mail_value.innerHTML = item.mail;
	} else {
		item_mail.style.display = "none";
	}

	if (item.particulars) {
		item_particulars.style.display = "flex";
		particulars_value.innerHTML = item.particulars.replaceAll("\n", "<br>");
	} else {
		item_particulars.style.display = "none";
	}

	if (item.status) {
		item_status.style.display = "flex";

		let status_text = "";
		switch (item.status) {
			case "todo":
				status_text = "待办";
				time_type.innerHTML = "截止时间";
				break;

			case "done":
				status_text = "已办";
				time_type.innerHTML = "完成时间";
				break;

			case "fail":
				status_text = "失效";
				break;
		}

		status_value.innerHTML = status_text;
	} else {
		item_status.style.display = "none";
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
			type: types[index].type,
			priority: types[index].priority
		},
		new: {
			type: new_type,
			priority: new_priority
		},
		index: index
	}

	postToExtension("list", data);
}