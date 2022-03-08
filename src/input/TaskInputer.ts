/* 模块调用 */
import { Code, Inputer, Transceiver } from "../Tool";

export namespace TaskInputer {
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
	export function Start(priority: number, id?: string, task?: any): void {
		maximum_priority = priority;

		if (id) {
			title = "调整任务";
			task_id = id;
			task_label = task.label;
			task_priority = task.priority;
		} else {
			title = "建立任务";
			task_id = Code.Generate(8);
			task_label = "";
			task_priority = "";
		}

		EditLabel();
	}

	/**
	 * 编辑任务名称
	 */
	function EditLabel(): void {
		const box = Inputer.Text(title, task_label, "任务名称", "请输入任务名称", total_option, 1);

		box.onDidAccept(() => {
			task_label = box.value;

			if (task_label.replace(/\s/g, "") != "") {
				EditPriority();
			} else {
				box.validationMessage = "任务名称不能为空！";
			}
		});

		box.show();
	}

	/**
	 * 编辑优先层级
	 */
	function EditPriority(): void {
		const box = Inputer.Pick(title, String(task_priority), "优先层级", total_option, 3);

		let priorities: Inputer.PickItem[] = [];
		for (let index = 0; index <= maximum_priority + 1; index++) {
			priorities.push(new Inputer.PickItem(String(index)));
		}
		box.items = priorities;

		box.onDidChangeSelection(item => {
			task_priority = Number(item[0].label);
			box.hide();
			Consolidate();
		});

		box.show();
	}

	/**
	 * 整合输入数据
	 */
	function Consolidate(): void {
		let data = {
			label: task_label,
			priority: task_priority
		}

		Transceiver.Send("task.adjust", task_id, data);
	}
}
