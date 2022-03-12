/* 模块调用 */
import { Code, Inputer, Transceiver } from "../Tool";

export namespace TaskRefiller {
	const title: string = "补签任务";

	let task_id: string;
	let task_days: string[];
	let filled: string[];

	/**
	 * 显示补签编辑器
	 * @param id 任务ID
	 * @param days 未签日期
	 */
	export function Start(id: string, days: string[]): void {
		task_id = id;
		task_days = days;

		Refill();
	}

	/**
	 * 补签
	 */
	function Refill(): void {
		const box = Inputer.Pick(title, "", "补签日期(可多选)", undefined, undefined, false, true);

		let day_item: Inputer.PickItem[] = [];
		for (let index = 0; index < task_days.length; index++) {
			day_item.unshift(new Inputer.PickItem(task_days[index]));
		}
		box.items = day_item;

		box.onDidChangeSelection((items) => {
			filled = [];
			for (let index = 0; index < items.length; index++) {
				filled.push(items[index].label);
			}
		});

		box.onDidAccept(Consolidate);

		box.show();
	}

	/**
	 * 整合输入数据
	 */
	function Consolidate(): void {
		Transceiver.Send("task.refill-recieve", task_id, filled);
	}
}
