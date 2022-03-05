/* 模块调用 */
import { code, inputer, transceiver } from "../tool";

export namespace entry_inputer {
	let title: string;
	let total_option: number = 2;

	let entry_root: string;
	let entry_id: string;
	let entry_label: string;
	let entry_content: string;

	/**
	 * 显示条目编辑器
	 * @param root 事项ID
	 * @param id 条目ID
	 * @param entry 条目对象
	 */
	export function start(root: string, id?: string, entry?: any): void {
		entry_root = root;

		if (id) {
			title = "编辑条目";
			entry_id = id;
			entry_label = entry.label;
			entry_content = entry.content;
		} else {
			title = "新建条目";
			entry_id = code.generate(8);
			entry_label = "";
			entry_content = "";
		}

		editLabel();
	}

	/**
	 * 编辑条目名称
	 */
	function editLabel(): void {
		let box = inputer.text(title, entry_label, "条目名称", "请输入条目名称", total_option, 1);

		box.onDidAccept(() => {
			entry_label = box.value;
			editContent();
		});

		box.show();
	}

	/**
	 * 编辑条目内容
	 */
	function editContent(): void {
		let box = inputer.text(title, entry_content, "条目内容(必填)", "请输入条目内容", total_option, 2);

		box.onDidAccept(() => {
			entry_content = box.value;
			if (entry_content.replace(/\s/g, "") != "") {
				box.hide();
				consolidate();
			} else {
				box.validationMessage = "条目内容不能为空！";
			}
		});

		box.show();
	}

	/**
	 * 整合输入数据
	 */
	function consolidate(): void {
		let data = {
			label: entry_label,
			content: entry_content
		}

		transceiver.send("entry.edit", entry_root, entry_id, data);
	}
}
