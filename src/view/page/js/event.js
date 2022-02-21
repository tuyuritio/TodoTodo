// 事件处理
class $E {
	/**
	 * 注册按键事件
	 * @param {HTMLElement} element 元素对象
	 * @param {(event:KeyboardEvent)=>void} handle 函数句柄
	 */
	static key(element, handle) {
		element.addEventListener("keydown", handle);
	}

	/**
	 * 注册单击事件
	 * @param {HTMLElement} element 元素对象
	 * @param {(event:MouseEvent)=>void} handle 函数句柄
	 */
	static click(element, handle) {
		element.addEventListener("click", handle);
	}

	/**
	 * 注册双击事件
	 * @param {HTMLElement} element 元素对象
	 * @param {(event:MouseEvent)=>void} handle 函数句柄
	 */
	static doubleClick(element, handle) {
		element.addEventListener("dblclick", handle);
	}

	/**
	 * 注册选择事件
	 * @param {HTMLElement} element 元素对象
	 * @param {(event:Event)=>void} handle 函数句柄
	 */
	static change(element, handle) {
		element.addEventListener("change", handle);
	}

	/**
	 * 注册事件监听
	 * @param {HTMLElement} element 元素对象
	 * @param {EventListenerOrEventListenerObject} event 事件
	 * @param {(...argument:any[])=>void} handle 函数句柄
	 */
	static add(element, event, handle) {
		element.addEventListener(event, handle);
	}

	/**
	 * 移除事件监听
	 * @param {HTMLElement} element 元素对象
	 * @param {EventListenerOrEventListenerObject} event 事件
	 * @param {(...argument:any[])=>void} handle 函数句柄
	 */
	static remove(element, event, action) {
		element.removeEventListener(event, action);
	}
}

/**
 * 注册基本事件
 */
function registerEvent() {
	// 文本输入框清除
	let inputs = $tag("input");
	for (let index = 0; index < inputs.length; index++) {
		let clear = (key) => { if (key.key == "Delete" && key.shiftKey) inputs[index].value = ""; };
		$E.add(inputs[index], "keydown", clear);
		$E.remove(inputs[index], "keydown", clear);
	}

	// 周期选择
	$E.change($("cycle_type"), (event) => {
		$("once").style.display = "none";
		$("daily").style.display = "none";
		$("weekly").style.display = "none";

		switch (event.target.options[event.target.selectedIndex].innerHTML) {
			case "单次":
				$("once").style.display = "flex";
				break;

			case "每周":
				$("weekly").style.display = "flex";

			case "每日":
				$("daily").style.display = "flex";
				break;
		}
	});

	// 类别选择
	$E.change($("select_type"), (event) => {
		if (event.target.options[event.target.selectedIndex].innerHTML == "其它") {
			$("input_type_label").style.display = "flex";
			$("input_type_label").focus();
		} else {
			$("input_type_label").style.display = "none";
			$("label").focus();
		}
	});

	// 关闭事项编辑器
	$E.key($("item_editor"), (key) => {
		if (key.key == "Escape") close("item_editor");
	});
	$E.click($("close_item_editor"), () => close("item_editor"));

	// 关闭清单编辑器
	$E.key($("list_editor"), (key) => {
		if (key.key == "Escape") close("list_editor");
	});
	$E.click($("close_list_editor"), () => close("list_editor"));

	// 关闭任务编辑器
	$E.click($("close_task_editor"), () => close("task_editor"));

	// 新增条目
	$E.click($("add_entry"), () => addEntry());

	// 编辑事项
	$E.click($("complete_button"), editItem);

	// 编辑任务
	$E.click($("task_button"), adjustTask);
}
