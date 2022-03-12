/* 模块调用 */
import { Time, Message, Transceiver, Code } from "../Tool";
import { Data } from "../DataCenter";

export namespace TaskProcesser {
	/**
	 * 准备调整任务
	 * @param task 任务对象
	 */
	export function Load(task?: any): void {
		let maximum_priority: number = 0;

		for (const id in Data.Task.task) {
			const task_data = Data.Task.task[id];
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
				period: [Time.Textualize(new Date(), "date") + "-1"]
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
	 * 准备补签任务
	 * @param task 任务对象
	 */
	export function LoadRefill(task: any): void {
		const data = Data.Task.task[task.id];

		if (data.history.length) {
			let days: string[] = [];

			let start: number = Time.Parse(data.start);
			for (let index = 0; index < data.history.length; index++) {
				let period: string = data.history[index];
				let past: Date = new Date(period.substring(0, 10));
				past.setDate(past.getDate() + Number(period.substring(11)));

				let gap: number = Time.GapDay(start, past);
				for (let day = 1; day < gap; day++) {
					past.setDate(past.getDate() + 1);
					days.push(Time.Textualize(past, "date"));
				}
			}

			Transceiver.Send("input.task.refill", task.id, days);
		}
	}

	/**
	 * 补签任务
	 * @param id 任务ID
	 * @param days 补签日期
	 */
	export function Refill(id: string, days: string[]): void {
		const data = Data.Task.task[id];

		let filled: string[] = [];
		for (let index = data.history.length - 1; index >= 0; index--) {
			const text: string = data.history.length[index];

			let start: Date = new Date(text.substring(0, 10));
			let duration = Number(text.substring(11));
			for (let index = 0; index < duration; index++) {
				filled.unshift(Time.Textualize(start, "date"));

				start.setDate(start.getDate() + 1);
			}
		}

		for (let index = 0; index < days.length; index++) {
			filled.splice(filled.indexOf(days[index], 1));
		}

		let history: string[] = [];
		for (let i = filled.length - 1; i >= 0; i--) {
			let append: boolean = false;

			for (let j = 0; j < history.length; j++) {
				let start: Date = new Date(history[j].substring(0, 10));
				let end: Date = new Date(start);
				let duration: number = Number(history[j].substring(11));
				end.setDate(end.getDate() + duration + 1);

				if (Time.Parse(end) == Time.Parse(filled[i])) {
					append = true;
					history[i] = Time.Textualize(start, "date") + "+" + (++duration);
				}
			}

			if (!append) {
				history.unshift();
			}
		}
	}

	/**
	 * 归档任务
	 * @param task 任务对象
	 */
	export async function Archive(task: any) {
		if (await Message.Show("information", "确认归档任务 \"" + task.label + "\" 吗？", "确认", "取消") == "确认") {
			const data = Data.Task.task[task.id];

			let archive_done: any = {
				label: data.label,
				type: "__untitled",
				priority: 0,
				entry: {},
				time: Time.Parse(new Date())
			}

			let history: string[] = [];
			for (let index = data.period.length - 1; index >= 0; index--) {
				const days: string = data.period[index];

				if (!index && days.substring(10) == "-1") continue;
				history.push(Time.Period(days.substring(0, 10), Number(days.substring(11))));
			}

			if (history.length) {
				let days = { content: "打卡记录 : ", done: true };
				for (let index = 0; index < history.length; index++) {
					days.content += "\n" + history[index];
				}
				archive_done.entry[Code.Generate(8)] = days;
			}

			Data.List.done[Code.Generate(8)] = archive_done;

			delete Data.Task.task[task.id];
			Transceiver.Send("view.task");
			Transceiver.Send("view.done");
		}
	}

	/**
	 * 检查任务数据
	 * @param task 任务对象
	 * @returns 今日是否打卡
	 */
	function Check(task: any): boolean {
		let period: string = task.period[0];

		let start: Date = new Date(period.substring(0, 10));
		let duration: number = Number(period.substring(11));



		if (period.charAt(10) == "-") {
			period
		}






		start.setDate(start.getDate() + Number(period.substring(11)));			// 最后一个打卡日的00:00

		let gap: number = Time.GapDay(start, new Date());
		if (task.duration == -1) {								// 未开始打卡
			task.start = Time.Textualize(new Date(), "date");
		} else if (gap > 2) {								// 昨日未打卡
			task.history.push(task.start + "+" + task.duration);
			task.start = Time.Textualize(new Date(), "date");
			task.duration = -1;
		}

		if (gap <= 1) {		// 今日已打卡
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

		const task_data = Data.Task.task;
		for (const id in task_data) {
			const task = task_data[id];
			const today: boolean = Data.Copy(task.today);

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
		const task_data = Data.Task.task[task.id];

		if (Check(task_data)) {
			task_data.duration--;
			task_data.today = false;
		} else {
			task_data.duration++;
			task_data.today = true;
		}

		Transceiver.Send("view.task");
	}
}
