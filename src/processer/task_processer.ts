/* 模块调用 */
import { date, message, transceiver } from "../tool";
import { data } from "../data_center";

export namespace task_processer {
	let default_all_state: boolean = false;

	/**
	 * 创建任务
	 */
	export function establish(): void {
		transceiver.send("page.post", "task");
	}

	/**
	 * 显示打卡日历
	 * @param task 任务对象
	 */
	export function calendar(task: any) {
		let task_data = data.copy(data.task.task[task.id]);
		task_data.id = task.id;
		if (task_data.duration != -1) {
			task_data.history.push(date.textualize(new Date(task_data.start), "date") + "+" + task_data.duration);
		}
		delete task_data.start;
		delete task_data.duration;

		transceiver.send("page.post", "task", task_data);
	}

	/**
	 * 检查任务数据
	 * @param task 任务数据
	 * @returns 今日是否打卡
	 */
	function check(task: any): boolean {
		let start: Date = new Date(task.start);
		start.setDate(start.getDate() + task.duration);			// 最后一个打卡日的00:00

		let gap_day: number = (new Date().getTime() - start.getTime()) / (24 * 60 * 60 * 1000);

		if (gap_day > 2 && task.duration != -1) {	// 昨日未打卡
			task.history.push(task.start + "+" + task.duration);
			task.start = date.textualize(new Date(), "date");
			task.duration = -1;
		}

		if (gap_day <= 1) {	// 今日已打卡
			return true;
		} else {			// 昨日已打卡、今日未打卡
			return false;
		}
	}

	/**
	 * 检查所有任务数据
	 */
	export function checkAll(): void {
		let if_change: boolean = false;

		let task_data = data.task.task;
		for (let id in task_data) {
			let task = task_data[id];
			let today: boolean = data.copy(task.today);

			task.today = check(task);
			if (today != task.today) if_change = true;
		}

		if (if_change) {
			transceiver.send("refresh", "task");
		}
	}

	/**
	 * 变更任务状态
	 * @param task 任务对象
	 */
	export function change(task: any): void {
		let task_data = data.task.task[task.id];

		if (check(task_data)) {
			task_data.duration--;
			task_data.today = false;
		} else {
			task_data.duration++;
			task_data.today = true;
		}

		transceiver.send("refresh", "task");
	}

	/**
	 * 变更全部任务状态
	 */
	export function changeAll() {
		default_all_state = !default_all_state;

		let if_change: boolean = false;
		for (let id in data.task.task) {
			let task_data = data.task.task[id];
			if (!check(task_data) && default_all_state) {
				if_change = true;
				
				task_data.duration++;
				task_data.today = true;
			} else if (check(task_data) && !default_all_state) {
				if_change = true;

				task_data.duration--;
				task_data.today = false;
			}
		}

		if (if_change) transceiver.send("refresh", "task");
	}

	/**
	 * 调整任务
	 * @param task 任务对象
	 */
	export function adjust(task: any): void {
		let task_data: any;
		{
			if (data.copy(data.task.task[task.id])) {
				task_data = data.task.task[task.id];
				if (task.label == task_data.label && task.priority == task_data.priority) return;

				task_data.label = task.label;
				task_data.priority = task.priority;
			} else {
				task_data = {
					label: task.label,
					priority: task.priority,
					today: false,
					start: date.textualize(new Date(), "date"),
					duration: -1,
					history: []
				}
			}

			let id = task.id;
			delete task.id;
			data.task.task[id] = task_data;
		}

		transceiver.send("refresh", "task");
	}

	/**
	 * 终止任务
	 * @param task 任务对象
	 */
	export async function terminate(task: any): Promise<void> {
		let if_delete: boolean = true;
		if (await message.show("information", "确认终止任务 \"" + task.label + "\" 吗？", "确认", "取消") == "取消") {
			if_delete = false;
		}

		if (if_delete) {
			delete data.task.task[task.id];
			transceiver.send("refresh", "task");
			transceiver.send("page.post", "synchronize_item", task.id);
		}
	}
}
