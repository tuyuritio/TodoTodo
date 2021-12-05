/**
 * 加载事件
 */
function addEvents() {
	// 清空日志
	clear_log.addEventListener("click", () => {
		clearAllLog();
		postToExtension("clearLog");
	});

	// 确认编辑事项
	complete_button.addEventListener("click", () => editItem());

	// 关闭清单编辑器
	close_list_editor.addEventListener("click", () => close("list_editor"));

	// 关闭事项编辑器
	close_item_editor.addEventListener("click", () => close("item_editor"));

	// 关闭事项详情
	close_item.addEventListener("click", () => close("item"));

	// 展开/收起详情编辑面板
	show_detail.addEventListener("click", () => showDetailPanel());

	// 自适应高度
	textarea.addEventListener("input", () => adaptiveHeight());
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

	item_editor.addEventListener("keydown", (key) => {
		if (key.key == "Escape") {
			close("item_editor");
		}
	});

	list_editor.addEventListener("keydown", (key) => {
		if (key.key == "Escape") {
			close("list_editor");
		}
	});

	other_type.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			label.focus();
		}
	});

	label.addEventListener("keydown", (key) => {
		if (key.key == "Enter" || key.key == "ArrowDown") {
			if (is_show_detail) {
				place.focus();
			} else {
				editItem();
			}
		}

		if (key.key == "Enter" && key.ctrlKey) {
			editItem();

		}

		if (key.key == "Delete" && key.shiftKey) {
			label.value = "";
		}
	});

	datetime.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				if (is_show_detail) {
					place.focus();
				} else {
					editItem();
				}
			}
		}
	});

	select_time.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				if (is_show_detail) {
					place.focus();
				} else {
					editItem();
				}
			}
		}
	});

	priority.addEventListener("change", () => place.focus());

	place.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				mail.focus();
			}
		}

		if (key.key == "Delete" && key.shiftKey) {
			place.value = "";
		}
	});

	mail.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				particulars.focus();
			}
		}

		if (key.key == "Delete" && key.shiftKey) {
			mail.value = "";
		}
	});

	particulars.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			}
		}

		if (key.key == "Delete" && key.shiftKey) {
			particulars.value = "";
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