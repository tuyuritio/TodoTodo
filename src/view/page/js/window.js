/**
 * 显示清单列表
 */
function loadListEditor() {
	$("list_editor").style.display = "flex";
}

/**
 * 加载事项编辑器
 * @param {{item_data:any,state:string}} data 解析数据
 */
function loadItemEditor(data) {
	$("item_editor").style.display = "flex";

	// 清空所有控件
	$("input_type").value = "";
	$("label").value = "";
	$("input_type_label").style.display = "none";
	$("cycle").style.display = "none";
	$("weekly").style.display = "none";
	$("once").style.display = "none";
	$("daily").style.display = "none";
	$("add_entry_line").style.display = "none";
	$("complete_button").style.display = "none";
	clearEntry();

	if (data.item_data) {
		loadEdit(data.item_data, data.state);
	} else {
		loadAdd();
	}
}

/**
 * 以新建形式加载事项编辑器
 */
function loadAdd() {
	remain_item = { id: undefined, type: undefined, label: undefined, priority: undefined, entry: {} };

	$("item_editor_title").innerHTML = "新建事项";

	$("select_type").selectedIndex = 0;
	if (select_type.options[select_type.selectedIndex].id == "other_type") {
		$("input_type_label").style.display = "flex";
	}

	$("priority").selectedIndex = 0;

	$("cycle").style.display = "flex";
	$("cycle_type").selectedIndex = 0;

	let current_time = new Date();
	$("weekly").selectedIndex = current_time.getDay();
	$("datetime").value = current_time.getFullYear() + "-" + (current_time.getMonth() + 1).toString().padStart(2, "0") + "-" + current_time.getDate().toString().padStart(2, "0") + "T" + current_time.getHours().toString().padStart(2, "0") + ":" + (current_time.getMinutes() + 1).toString().padStart(2, "0");	// 往后加1分钟
	$("time").value = current_time.getHours().toString().padStart(2, "0") + ":" + current_time.getMinutes().toString().padStart(2, "0");

	$("add_entry_line").style.display = "flex";
	$("complete_button").style.display = "block";

	$("label").focus();
}

/**
 * 以编辑形式加载事项编辑器
 * @param {any} data 事项数据
 * @param {"todo"|"done"|"fail"} state 事项状态
 */
function loadEdit(data, state) {
	remain_item.id = data.id;
	remain_item.label = data.label;
	remain_item.entry = data.entry;

	// 加载不同状态下的控件
	switch (state) {
		case "todo":
			$("item_editor_title").innerHTML = "编辑事项";
			$("time_title").innerHTML = "截止时间";
			$("cycle").style.display = "flex";
			$("add_entry_line").style.display = "flex";
			$("complete_button").style.display = "block";
			break;

		case "done":
			$("item_editor_title").innerHTML = "已办事项";
			$("time_title").innerHTML = "完成时间";
			break;

		case "fail":
			$("item_editor_title").innerHTML = "失效失效";
			$("time_title").innerHTML = "失效时间";
			break;
	}

	// 事项类别
	let exist_type = false;
	for (let index = 0; index < lists.length; index++) {
		if (lists[index].label == data.type) {
			$("select_type").selectedIndex = index;
			exist_type = true;
			break;
		}
	}
	if (!exist_type) {
		$("select_type").selectedIndex = lists.length;
		$("input_type_label").style.display = "flex";
		$("input_type").value = data.type;
	}

	// 事项名称
	$("label").value = data.label;

	// 优先层级
	$("priority").selectedIndex = data.priority;

	// 事项周期与截止时间
	data.time = textualizeTime(new Date(data.time));
	switch (data.cycle) {
		case "secular":
			break;

		case "once":
			$("cycle_type").selectedIndex = 1;
			$("once").style.display = "flex";
			$("datetime").value = data.time.replace("-", "T").replaceAll("/", "-");
			break;

		case "daily":
			$("cycle_type").selectedIndex = 2;
			$("daily").style.display = "flex";
			$("time").value = data.time.substr(11, 5);
			break;

		case "weekly":
			$("cycle_type").selectedIndex = 3;
			$("daily").style.display = "flex";
			$("weekly").style.display = "flex";
			$("weekly").selectedIndex = toDate(data.time).getDay();
			$("time").value = data.time.substr(11, 5);
			break;
	}

	for (let id in data.entry) {
		addEntry(data.entry[id].label, data.entry[id].content, id);
	}
}

/**
 * 添加条目
 * @param {string} label 条目名称
 * @param {string} content 条目内容
 * @param {string} id 条目ID
 */
function addEntry(label, content, id) {
	let new_entry = $$("label");
	{
		{	// 条目标题
			let entry_label = $$("span");
			entry_label.innerHTML = label ? label : $("entry_input_type").value;
			if (entry_label.innerHTML.replaceAll(" ", "") == "") {		// 条目名称为空
				entry_label.innerHTML = "";
			}
			// 空名称条目背景填充
			if (entry_label.innerHTML == "") {
				entry_label.className = "empty_entry_label";
			}
			$E.doubleClick(entry_label, (event) => $R(event.target.parentElement));
			$I(new_entry, entry_label);
		}

		{	// 条目输入框
			let entry_input = $$("input");
			entry_input.type = "text";
			entry_input.className = "entry";
			entry_input.placeholder = "条目内容";
			entry_input.id = id ? id : code(8);
			if (content) entry_input.value = content;

			$E.key(entry_input, (key) => {
				if (key.key == "Enter") {
					if (key.ctrlKey) {
						editItem();
					} else {
						$("entry_input_type").focus();
					}
				}
			});
			$I(new_entry, entry_input);
		}
	}
	$B($("add_entry_line"), new_entry);

	new_entry.focus();
	$("entry_input_type").value = "";
}

/**
 * 清除条目
 */
function clearEntry() {
	$("entry_input_type").value = "";
	let entries = $class("entry");
	while (entries.length) $R(entries[entries.length - 1].parentElement);
}

/**
 * 加载任务编辑器
 * @param {any} data 任务数据
 */
function loadTaskEditor(data) {
	$("task_editor").style.display = "flex";
	if (data) {
		remain_task.id = data.id;
		$("task_editor_title").innerHTML = "每日打卡";
		$("task_label").value = data.label;
		$("task_priority").selectedIndex = data.priority;
	} else {
		remain_task.id = undefined;
		remain_task.priority = undefined;
		$("task_editor_title").innerHTML = "新建任务";
		$("task_label").value = "";
		$("task_priority").selectedIndex = 0;
	}

	$("task_label").focus();
	createCalendar(new Date().getFullYear(), new Date().getMonth() + 1, data ? data.history : undefined);
}

/**
 * 生成日历
 * @param {number} year 年份
 * @param {number} month 月份
 * @param {string[]} days 打卡数据
 */
function createCalendar(year, month, days) {
	// 清除原有数据
	let calendar = $("calendar");
	while (calendar.children[0]) {
		calendar.removeChild(calendar.children[0]);
	}

	let pointer_day = new Date(year, month - 1);
	pointer_day.setDate(pointer_day.getDate() - pointer_day.getDay());

	for (let i = 0; i < 6; i++) {
		let week = $$("tr");
		{
			for (let j = 0; j < 7; j++) {
				let day = $$("td");
				{
					pointer_day.setDate(pointer_day.getDate() + 1);
					day.innerHTML = pointer_day.getDate();

					if (pointer_day.getMonth() + 1 != month) {
						day.classList.add("other_month");
					}

					for (let k = 0; days && k < days.length; k++) {
						let start = new Date(days[k].substring(0, 10));
						let duration = Number(days[k].substring(11));
						let end = new Date(start);
						end.setDate(start.getDate() + duration);

						if (parseTime(pointer_day) >= parseTime(start) && parseTime(pointer_day) <= parseTime(end)) {
							day.classList.add("check");
						}
					}
				}
				$I(week, day);
			}
		}
		$I(calendar, week);
	}
}

/**
 * 关闭窗口
 * @param {"item_editor"|"list_editor"|"task_editor"} window 
 */
function close(window) {
	$(window).style.display = "none";
}
