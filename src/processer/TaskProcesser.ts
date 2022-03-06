/* 模块调用 */
import { Time, Message, Transceiver, Code } from "../Tool";
import { Data } from "../DataCenter";

export namespace TaskProcesser {
	let default_all_state: boolean = false;

	/**
	 * 准备调整任务
	 * @param task 任务对象
	 */
	export function Load(task?: any): void {
		let maximum_priority: number = 0;

		for (let id in Data.Task.task) {
			let task_data = Data.Task.task[id];
			if (task_data.priority > maximum_priority) maximum_priority = task_data.priority;
		}

		if (task) {
			Transceiver.Send("input.task", maximum_priority, task.id, Data.Task.task[task.id]);
		} else {
			Transceiver.Send("input.task", maximum_priority);
		}
	}

	/**
	 * 调整任务
	 * @param task 任务对象
	 */
	export function Adjust(id: string, task: any): void {
		if (Data.Task.task[id]) {
			let task_data = Data.Task.task[id];
			task_data.label = task.label;
			task_data.priority = task.priority;
		} else {
			Data.Task.task[id] = {
				label: task.label,
				priority: task.priority,
				today: false,
				start: Time.Textualize(new Date(), "date"),
				duration: -1,
				history: []
			};
		}

		Transceiver.Send("view.task");
	}

	/**
	 * 终止任务
	 * @param task 任务对象
	 */
	export async function Terminate(task: any): Promise<void> {
		if (await Message.Show("information", "确认终止任务 \"" + task.label + "\" 吗？", "确认", "取消") == "确认") {
			delete Data.Task.task[task.id];
			Transceiver.Send("view.task");
		}
	}

	/**
	 * 归档任务
	 * @param task 任务对象
	 */
	export async function Archive(task: any) {
		if (await Message.Show("information", "确认归档任务 \"" + task.label + "\" 吗？", "确认", "取消") == "确认") {
			let data = Data.Task.task[task.id];

			let archive: any = {
				label: data.label,
				type: "__untitled",
				priority: 0,
				entry: {},
				time: Time.Parse(new Date())
			}

			archive.entry[Code.Generate(8)] = {
				label: "开始时间",
				content: data.start,
				done: true
			};

			archive.entry[Code.Generate(8)] = {
				label: "连续打卡",
				content: data.duration + 1,
				done: true
			};

			Data.List.done[Code.Generate(8)] = archive;

			delete Data.Task.task[task.id];
			Transceiver.Send("view.task");
			Transceiver.Send("view.done");
		}
	}

	/**
	 * 检查任务数据
	 * @param task 任务数据
	 * @returns 今日是否打卡
	 */
	function Check(task: any): boolean {
		let start: Date = new Date(task.start);
		start.setDate(start.getDate() + task.duration);			// 最后一个打卡日的00:00

		let gap_day: number = (Time.Parse(new Date()) - Time.Parse(start)) / (24 * 60 * 60 * 1000);

		if (gap_day > 2 && task.duration != -1) {	// 昨日未打卡
			task.history.push(task.start + "+" + task.duration);
			task.start = Time.Textualize(new Date(), "date");
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
	export function CheckAll(): void {
		let if_change: boolean = false;

		let task_data = Data.Task.task;
		for (let id in task_data) {
			let task = task_data[id];
			let today: boolean = Data.Copy(task.today);

			task.today = Check(task);
			if (today != task.today) if_change = true;
		}

		if (if_change) Transceiver.Send("view.task");
	}

	/**
	 * 变更任务状态
	 * @param task 任务对象
	 */
	export function Change(task: any): void {
		let task_data = Data.Task.task[task.id];

		if (Check(task_data)) {
			task_data.duration--;
			task_data.today = false;
		} else {
			task_data.duration++;
			task_data.today = true;
		}

		Transceiver.Send("view.task");
	}

	/**
	 * 变更全部任务状态
	 */
	export function ChangeAll(): void {
		default_all_state = !default_all_state;

		let if_changed: boolean = false;
		for (let id in Data.Task.task) {
			let task_data = Data.Task.task[id];
			if (!Check(task_data) && default_all_state) {
				task_data.duration++;
				task_data.today = true;

				if_changed = true;
			} else if (Check(task_data) && !default_all_state) {
				task_data.duration--;
				task_data.today = false;

				if_changed = true;
			}
		}

		if (if_changed) Transceiver.Send("view.task");
	}
}
