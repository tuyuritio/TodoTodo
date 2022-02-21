/**
 * 加载窗口基础数据
 * @param {{lists:any,item_priority:number,list_priority:number,add_action:string}} data 选项数据
 */
function refresh(data) {
	action_after_add = data.add_action;
	lists = data.lists;

	loadTaskPriority(data.task_priority);
	loadItemType();
	loadItemPriority(data.item_priority);
	loadList(data.list_priority);
}

function loadTaskCalendar(data) {

}

/**
 * 加载任务优先级选项
 * @param {number} maximum_priority 任务最大优先级
 */
function loadTaskPriority(maximum_priority) {
	let priority = $("task_priority");
	while (priority.firstElementChild.id != "task_maximum_priority") {
		$R(priority.firstElementChild);
	}

	for (let index = 0; index <= maximum_priority; index++) {
		let new_priority = $$("option");
		new_priority.innerHTML = index;
		priority.insertBefore(new_priority, $("task_maximum_priority"));
	}
	$("task_maximum_priority").innerHTML = maximum_priority + 1;
	priority.selectedIndex = remain_task.priority;					// 保留优先级选项
}

/**
 * 加载事项类别选项
 */
function loadItemType() {
	let select_type = $("select_type");
	while (select_type.firstElementChild.id != "other_type") {
		$R(select_type.firstElementChild);
	}

	for (let index = 0; index < lists.length; index++) {
		let new_type = $$("option");
		new_type.innerHTML = lists[index].label;
		select_type.insertBefore(new_type, $("other_type"));

		let type_option = -1;										// 保留类别选项
		if (remain_item.type == lists[index].label) {
			type_option = index;
		}
		select_type.selectedIndex = type_option != -1 ? type_option : 0;
	}
	$("input_type").value = "";
	if (select_type.options[select_type.selectedIndex].innerHTML == "其它") {
		$("input_type_label").style.display = "flex";
	} else {
		$("input_type_label").style.display = "none";
	}
}

/**
 * 加载事项优先级选项
 * @param {number} maximum_priority 事项最大优先级
 */
function loadItemPriority(maximum_priority) {
	let priority = $("priority");
	while (priority.firstElementChild.id != "maximum_priority") {
		$R(priority.firstElementChild);
	}

	for (let index = 0; index <= maximum_priority; index++) {
		let new_priority = $$("option");
		new_priority.innerHTML = index;
		priority.insertBefore(new_priority, $("maximum_priority"));
	}

	$("maximum_priority").innerHTML = maximum_priority + 1;
	priority.selectedIndex = remain_item.priority;					// 保留优先级选项
}

/**
 * 加载清单优先级选项
 * @param {number} maximum_priority 清单最大优先级
 */
function loadList(maximum_priority) {
	let list_table = $("list_table");
	while (list_table.firstElementChild) {
		$R(list_table.firstElementChild);
	}

	for (let index = 0; index < lists.length; index++) {
		let new_list = $$("tr");
		{
			// 清单名称
			let data_label = $$("td");
			{
				let label_input = $$("input");
				{
					label_input.type = "text";
					label_input.maxLength = "32";
					label_input.value = lists[index].label;
					$E.key(label_input, (key) => {
						if (key.key == "Enter") alterList(index);
					});
				}
				$I(data_label, label_input);
			}
			$I(new_list, data_label);

			// 清单优先层级
			let data_priority = $$("td");
			{
				let new_selector = $$("select");
				for (let i = 0; i <= maximum_priority + 1; i++) {
					let new_priority = $$("option");
					new_priority.innerHTML = i;
					$I(new_selector, new_priority);
				}
				new_selector.selectedIndex = lists[index].priority;
				$I(data_priority, new_selector);
			}
			$I(new_list, data_priority);

			// 剩余待办
			let data_quantity = $$("td");
			data_quantity.innerHTML = lists[index].quantity;
			data_quantity.style.textAlign = "center";
			$I(new_list, data_quantity);

			// 编辑按钮
			let data_edit = $$("td");
			{
				let edit_button = $$("button");
				edit_button.innerHTML = "编辑";
				$E.click(edit_button, () => alterList(index));
				$I(data_edit, edit_button);
			}
			$I(new_list, data_edit);

			// 移除按钮
			let data_remove = $$("td");
			{
				let remove_button = $$("button");
				remove_button.innerHTML = "移除";
				$E.click(remove_button, () => send("list.remove", { label: lists[index].label }));
				$I(data_remove, remove_button);
			}
			$I(new_list, data_remove);
		}
		$I(list_table, new_list);
	}
}
