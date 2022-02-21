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
	// 优先清空
	$("item_editor").style.display = "flex";
	$("input_type").value = "";
	$("input_type_label").style.display = "none";
	$("complete_button").style.display = "none";
	$("add_entry_line").style.display = "none";
	$("cycle").style.display = "none";
	$("once").style.display = "none";
	$("daily").style.display = "none";
	$("weekly").style.display = "none";
	$("cycle_type").selectedIndex = 0;
	$("select_type").selectedIndex = 0;
	$("priority").selectedIndex = 0;
	$("label").value = "";
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
	remain_item.type = undefined;
	remain_item.priority = undefined;
	remain_item.id = undefined;
	remain_item.label = undefined;
	remain_item.entry = {};

	let current_time = new Date();
	$("weekly").selectedIndex = current_time.getDay();
	$("datetime").value = current_time.getFullYear() + "-" + (current_time.getMonth() + 1).toString().padStart(2, "0") + "-" + current_time.getDate().toString().padStart(2, "0") + "T" + current_time.getHours().toString().padStart(2, "0") + ":" + (current_time.getMinutes() + 1).toString().padStart(2, "0");	// 往后加1分钟
	$("time").value = current_time.getHours().toString().padStart(2, "0") + ":" + current_time.getMinutes().toString().padStart(2, "0");

	$("item_editor").style.display = "flex";
	$("item_editor_title").innerHTML = "新建事项";
	$("state").value = "待办";

	$("cycle").style.display = "flex";
	$("add_entry_line").style.display = "flex";
	$("complete_button").style.display = "block";

	if (select_type.options[select_type.selectedIndex].id == "other_type") {
		$("input_type_label").style.display = "flex";
	}

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
			$("state").value = "待办";
			$("cycle").style.display = "flex";
			$("add_entry_line").style.display = "flex";
			$("complete_button").style.display = "block";
			break;

		case "done":
			$("item_editor_title").innerHTML = "事项信息";
			$("time_title").innerHTML = "完成时间";
			$("state").value = "已办";
			break;

		case "fail":
			$("item_editor_title").innerHTML = "事项信息";
			$("time_title").innerHTML = "失效时间";
			$("state").value = "未办";
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
			if (entry_label.innerHTML.replaceAll(" ", "") == "") {		// 条目名称为空则生成默认名称
				entry_label.innerHTML = "__entry";
			}
			// 默认条目背景填充
			if (entry_label.innerHTML == "__entry") {
				entry_label.style.color = "var(--vscode-activityBar-background)";
				entry_label.style.backgroundColor = "var(--vscode-activityBar-background)";
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
	$("item_editor").insertBefore(new_entry, $("add_entry_line"));

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

						if (pointer_day.getTime() >= start.getTime() && pointer_day.getTime() <= end.getTime()) {
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

/**
 * 同步任务编辑器
 * @param {string} task 任务ID
 */
function synchronizeTaskEditor(task) {
	if (task == remain_task.id) {
		close("task_editor");
	}
}

/**
 * 同步事项编辑器
 * @param {string} item 事项ID
 */
function synchronizeItemEditor(item) {
	if (item == remain_item.id) {
		close("item_editor");
	}
}
