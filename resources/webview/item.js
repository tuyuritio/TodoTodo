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
	} else {
		textarea.value = "";
	}
	adaptiveHeight();

	priority.selectedIndex = item.priority;

	if (item.cycle) {
		if (item.cycle == "daily") {
			once.style.display = "none";
			daily.style.display = "flex";
			weekly.style.display = "none";

			cycle.selectedIndex = 2;
			select_time.value = item.time.substr(11, 5);
		}

		if (item.cycle == "weekly") {
			once.style.display = "none";
			daily.style.display = "flex";
			weekly.style.display = "flex";

			cycle.selectedIndex = 3;
		}
	} else {
		if (item.time) {
			once.style.display = "flex";
			daily.style.display = "none";
			weekly.style.display = "none";

			cycle.selectedIndex = 1;
		} else {
			once.style.display = "none";
			daily.style.display = "none";
			weekly.style.display = "none";

			cycle.selectedIndex = 0;
		}
	}
}

/**
 * 提交编辑事项
 */
function edit() {
	// 编辑时间
	let new_cycle;
	let new_time;
	let current_time = new Date();
	let time_string;

	switch (cycle.options[cycle.selectedIndex].text) {
		case "长期":
			break;

		case "单次":
			time_string = datetime.value.replaceAll("-", "/").replace("T", "-");

			// 检测输入时间是否逾期
			if (toDate(time_string) < current_time) {
				postToExtension("warning", "请选择一个未来的时间！");
				return;
			}

			break;

		case "每日":
			new_cycle = "daily";

			new_time = new Date(current_time.getFullYear(), current_time.getMonth, current_time.getDate(), parseInt(time.value.substr(0, 2)), parseInt(time.value.substr(3, 2)));
			while (new_time < current_time) {
				new_time.setDate(new_time.getDate() + 1);
			}

			break;

		case "每周":
			new_cycle = "weekly";
			let week_day = weekly.selectedIndex;

			new_time = new Date(current_time.getFullYear(), current_time.getMonth, current_time.getDate() - (current_time.getDay() + 6) % 7 + week_day, parseInt(time.value.substr(0, 2)), parseInt(time.value.substr(3, 2)));
			while (new_time < current_time) {
				new_time.setDate(new_time.getDate() + 7);
			}

			break;
	}

	// 默认类别
	let new_type = select_type.options[select_type.selectedIndex].text;
	if (new_type == "==事项类别==") {
		new_type = "普通";
	}

	let new_item = {
		type: new_type,
		label: label.value,
		priority: parseInt(priority.options[priority.selectedIndex].text),
		cycle: new_cycle,
		time: time_string,
		place: place.value,
		mail: mail.value,
		detail: textarea.value
	};


	let data = {
		old_item: {				// 将要删除的原有事项
			type: editing_type,
			index: editing_index
		},
		new_item: new_item
	};

	postToExtension("add", data);
}