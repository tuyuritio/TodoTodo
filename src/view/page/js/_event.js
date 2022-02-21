/**
 * 加载事件
 */
function mouseEvents() {
	// 关闭清单编辑器
	E.close_list_editor.addEventListener("click", () => close("list_editor"));


	// 清空日志
	E.clear_log.addEventListener("click", () => {
		clearLog();
		send("clearLog");
	});

	// 新建条目
	E.add_entry.addEventListener("click", () => addEntry());

	// 事项类型选择
	E.select_type.addEventListener("change", (event) => chooseType(event));



	// 周次选择
	E.weekly.addEventListener("change", () => E.select_time.focus());

	// 优先级选择
	E.priority.addEventListener("change", () => E.entry_other_type.focus());

	// 条目选择
	E.entry_type.addEventListener("change", (event) => chooseEntry(event));
}

/**
 * 聚焦事件
 */
function keyEvents() {
	// 关闭事项编辑器
	E.item_editor.addEventListener("keydown", (key) => {
		if (key.key == "Escape") {
			close("item_editor");
		}
	});

	// 关闭清单编辑器
	E.list_editor.addEventListener("keydown", (key) => {
		if (key.key == "Escape") {
			close("list_editor");
		}
	});

	// 其它类别确认
	E.input_type.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			E.label.focus();
		}

		if (key.key == "Delete" && key.shiftKey) {
			E.input_type.value = "";
		}
	});

	// 事项名称确认
	E.label.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				E.entry_input_type.focus();
			}
		}

		if (key.key == "Delete" && key.shiftKey) {
			E.label.value = "";
		}
	});

	// 完整时间确认
	E.datetime.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				E.entry_input_type.focus();
			}
		}
	});

	// 时间确认
	select_time.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				E.entry_input_type.focus();
			}
		}
	});

	// 条目类别确认
	E.entry_input_type.addEventListener("keydown", (key) => {
		if (key.key == "Enter") {
			if (key.ctrlKey) {
				editItem();
			} else {
				addEntry();
			};
		}
	});
}

