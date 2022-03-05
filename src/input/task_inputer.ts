/* 模块调用 */
import { code, inputer, transceiver } from "../tool";

export namespace task_inputer {
	let title: string;
	let total_option: number = 2;

	let maximum_priority: number;

	let task_id: string;
	let task_label: string;
	let task_priority: number | string;

	/**
	 * 显示任务编辑器
	 * @param priority 任务最大优先层级
	 * @param id 任务ID
	 * @param task 任务对象
	 */
	export function start(priority: number, id?: string, task?: any): void {
		maximum_priority = priority;

		if (id) {
			title = "调整任务";
			task_id = id;
			task_label = task.label;
			task_priority = task.priority;
		} else {
			title = "建立任务";
			task_id = code.generate(8);
			task_label = "";
			task_priority = "";
		}

		editLabel();
	}

	/**
	 * 编辑任务名称
	 */
	function editLabel(): void {
		let box = inputer.text(title, task_label, "任务名称", "请输入任务名称", total_option, 1);

		box.onDidAccept(() => {
			task_label = box.value;

			if (task_label.replace(/\s/g, "") != "") {
				editPriority();
			} else {
				box.validationMessage = "任务名称不能为空！";
			}
		});

		box.show();
	}

	/**
	 * 编辑优先层级
	 */
	function editPriority(): void {
		let box = inputer.pick(title, String(task_priority), "优先层级", total_option, 3);

		let priorities: inputer.PickItem[] = [];
		for (let index = 0; index <= maximum_priority + 1; index++) {
			priorities.push(new inputer.PickItem(String(index)));
		}
		box.items = priorities;

		box.onDidChangeSelection(item => {
			task_priority = Number(item[0].label);
			box.hide();
			consolidate();
		});

		box.show();
	}

	/**
	 * 整合输入数据
	 */
	function consolidate(): void {
		let data = {
			label: task_label,
			priority: task_priority
		}

		transceiver.send("task.adjust", task_id, data);
	}
}
