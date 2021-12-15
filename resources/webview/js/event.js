/**
 * 加载事件
 */
function addEvents() {
	// 确认编辑事项
	complete_button.addEventListener("click", () => editItem());

	// 关闭清单编辑器
	close_list_editor.addEventListener("click", () => close("list_editor"));

	// 关闭事项编辑器
	close_item_editor.addEventListener("click", () => close("item_editor"));

	// 清空日志
	clear_log.addEventListener("click", () => {
		clearAllLog();
		postToExtension("clearLog");
	});

	// 新建条目
	add_entry.addEventListener("click", () => addEntry());
}

/**
 * 聚焦事件
 */
function focusEvents() {
	// 事项类型选择
	select_type.addEventListener("change", (event) => chooseType(event));

	// 周期选择
	cycle.addEventListener("change", (event) => chooseCycle(event));

	// 周次选择
	weekly.addEventListener("change", () => select_time.focus());

	// 条目选择
	entry_type.addEventListener("change", (event) => chooseEntry(event));

	// 关闭事项编辑器
	item_editor.addEventListener("keydown", (key) => {
		if (key.key == "Escape") {
			close("item_editor");
		}
	});

	// 关闭清单编辑器
	list_editor.addEventListener("keydown", (key) => {
		if (key.key == "Escape") {
			close("list_editor");
		}
	});

	// 输入类别
	other_type.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			label.focus();
		}
	});

	// 事项名称确认
	label.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				entry_other_type.focus();
			}
		}

		if (key.key == "Delete" && key.shiftKey) {
			label.value = "";
		}
	});

	// 添加条目输入框
	entry_other_type.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			addEntry(entry_other_type.value);
		}
	});
}

// 接收扩展命令
window.addEventListener("message", (event) => {
	let message = event.data;

	switch (message.command) {
		case "initialize":
			loadOption(message.data);
			break;

		case "add":
			readyAdd(message.data);
			break;

		case "edit":
			readyEdit(message.data);
			break;

		case "information":
			information(message.data);
			break;

		case "list":
			readyList();
			break;

		case "log":
			clearAllLog();
			showLog(message.data);
			break;
	}
});

/**
 * 发送扩展命令
 * @param command 命令文本
 * @param data 通信数据
 */
function postToExtension(command, data) {
	let message = {
		command: command,
		data: data
	}

	vscode.postMessage(message);
}
