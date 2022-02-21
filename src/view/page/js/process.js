/**
 * 编辑事项
 */
function editItem() {
	let new_item = {};

	{	// 事项类别
		let new_type;
		if (lists[$("select_type").selectedIndex]) {
			new_type = lists[$("select_type").selectedIndex].label;
		} else {
			new_type = $("input_type").value;
			if (new_type.replaceAll(" ", "") == "") {
				send("page.message", { type: "warning", text: "请输入必填项！" });
				return;
			}
		}
		new_item.type = new_type;
	}

	{	// 事项名称
		let new_label = $("label").value;
		if (new_label.replaceAll(" ", "") == "") {
			send("page.message", { type: "warning", text: "请输入必填项！" });
			return;
		}
		new_item.label = new_label;
	}

	{	// 事项周期与截止时间
		let current_time = new Date();
		let time;
		let new_cycle;
		let new_time;
		switch ($("cycle_type").selectedIndex) {
			case 0:
				new_cycle = "secular";
				break;

			case 1:
				new_cycle = "once";
				new_time = $("datetime").value.replaceAll("-", "/").replace("T", "-");
				if (parseTime(new_time) < parseTime(current_time)) {			// 检测输入时间是否逾期
					send("page.message", { type: "warning", text: "请选择一个未来的时间！" });
					return;
				}
				break;

			case 2:
				new_cycle = "daily";
				time = new Date(current_time.getFullYear(), current_time.getMonth(), current_time.getDate(), parseInt($("time").value.substr(0, 2)), parseInt($("time").value.substr(3, 2)));
				while (parseTime(time) < parseTime(current_time)) time.setDate(time.getDate() + 1);
				new_time = textualizeTime(time);
				break;

			case 3:
				new_cycle = "weekly";
				let week_day = weekly.selectedIndex;
				time = new Date(current_time.getFullYear(), current_time.getMonth(), current_time.getDate() - current_time.getDay() + week_day, parseInt($("time").value.substr(0, 2)), parseInt($("time").value.substr(3, 2)));
				while (parseTime(time) < parseTime(current_time)) time.setDate(time.getDate() + 7);
				new_time = toString(time);
				break;
		}
		new_item.cycle = new_cycle;
		new_item.time = new_time;
	}

	{	// 优先层级
		new_item.priority = $("priority").selectedIndex;
	}

	{	// 事项条目
		new_item.entry = {};
		let entries = $class("entry");
		for (let index = 0; index < entries.length; index++) {
			let entry = {
				id: entries[index].id,
				label: entries[index].parentElement.children[0].innerHTML,
				content: entries[index].value,
				done: false
			}

			if (entry.content.replaceAll(" ", "") != "") {				// 检测无效条目
				let remain = remain_item.entry[entry.id];
				if (remain && remain.content == entry.content) entry.done = remain.done;		// 检测原有条目

				new_item.entry[entry.id] = { label: entry.label, content: entry.content, done: entry.done };
			}
		}
	}

	new_item.id = remain_item.id ? remain_item.id : code(8);
	send("todo.edit", new_item);

	if ($("item_editor_title").innerHTML == "新建事项") {
		switch (action_after_add) {
			case "remain":
				remain_item.type = new_item.type;
				remain_item.priority = new_item.priority;
				break;

			case "clear":
				loadItemEditor({ item_data: undefined, state: undefined, add_action: action_after_add });
				remain_item.type = undefined;
				remain_item.priority = undefined;
				break;

			case "close":
				close("item_editor");
				break;
		}
	} else {
		close("item_editor");
	}
}

/**
 * 修改清单
 * @param {number} list_index 清单元素
 */
function alterList(list_index) {
	let old_list = {};
	old_list.label = lists[list_index].label;
	old_list.priority = lists[list_index].priority;

	let new_list = {};
	new_list.label = $("list_table").children[list_index].children[0].children[0].value;
	new_list.priority = $("list_table").children[list_index].children[1].children[0].selectedIndex;
	send("list.alter", { old: old_list, new: new_list });
}

/**
 * 调整任务
 */
function adjustTask() {
	let new_task = {};

	new_task.label = $("task_label").value;
	if (new_task.label.replaceAll(" ", "") == "") {
		send("page.message", { type: "warning", text: "请输入必填项！" });
		return;
	}

	new_task.priority = $("task_priority").selectedIndex;
	new_task.id = remain_task.id ? remain_task.id : code(8);

	send("task.adjust", new_task);
}
