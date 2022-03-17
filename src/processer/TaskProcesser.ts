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
				period: [Time.Textualize(new Date(), "date")]
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

		let days: string[] = [];

		for (let index = data.period.length - 1; index > 0; index--) {
			let start: number = Time.Parse(data.period[index - 1].substring(0, 10));
			let past: Date = Time.EndDate(data.period[index].substring(0, 10), Number(data.period[index].substring(11)));
			let gap: number = Time.GapDay(start, past);

			for (let day = 1; day < gap; day++) {
				past.setDate(past.getDate() + 1);
				days.unshift(Time.Textualize(past, "date"));
			}
		}

		Transceiver.Send("input.task.refill", task.id, days);
	}

	/**
	 * 补签任务
	 * @param id 任务ID
	 * @param days 补签日期
	 */
	export function Refill(id: string, days: string[]): void {
		const data = Data.Task.task[id];

		let filled: string[] = [];
		for (let index = data.period.length - 1; index >= 0; index--) {
			if (data.period[index].charAt(10)) {
				let start: Date = new Date(data.period[index].substring(0, 10));
				let duration = Number(data.period[index].substring(11));

				for (let index = 0; index <= duration; index++) {
					filled.unshift(Time.Textualize(start, "date"));
					start.setDate(start.getDate() + 1);
				}
			}
		}

		for (let index = days.length - 1; index >= 0; index--) {
			let pointer: number = filled.length;
			while (pointer > 0 && Time.Parse(days[index]) > Time.Parse(filled[pointer - 1])) {
				filled[pointer] = filled[pointer - 1];
				pointer--;
			}

			filled[pointer] = days[index];
		}

		let periods: { start: Date, duration: number }[] = [];
		for (let index = filled.length - 1; index >= 0; index--) {
			if (periods[0] && Time.Parse(Time.EndDate(periods[0].start, periods[0].duration + 1)) == Time.Parse(filled[index])) {
				periods[0].duration++;
			} else {
				periods.unshift({ start: new Date(filled[index]), duration: 0 });
			}
		}

		data.period = [];
		for (let index = 0; index < periods.length; index++) {
			data.period.push(Time.Textualize(periods[index].start, "date") + "+" + periods[index].duration);
		}

		Check(data);		// 填补最近打卡信息

		Transceiver.Send("view.task");
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

				if (!index && !days.charAt(10)) continue;
				history.unshift(Time.Period(days.substring(0, 10), Number(days.substring(11))));
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
	 * 变更任务状态
	 * @param task 任务对象
	 */
	export function Change(task: any): void {
		const task_data = Data.Task.task[task.id];

		if (Check(task_data)) {
			task_data.period[0] = ChangePeriod(task_data.period[0], -1);
			task_data.today = false;
		} else {
			task_data.period[0] = ChangePeriod(task_data.period[0], +1);
			task_data.today = true;
		}

		Transceiver.Send("view.task");
	}

	/**
	 * 更改时段
	 * @param period 时段文本
	 * @param change 更改日数
	 */
	function ChangePeriod(period: string, change: number = 0): string {
		let start: Date = new Date(period.substring(0, 10));
		let duration: number = period.charAt(10) ? Number(period.substring(11)) : -1;
		duration += change;

		if (duration < 0) {
			return Time.Textualize(start, "date");
		} else {
			return Time.Textualize(start, "date") + "+" + duration;
		}
	}

	/**
	 * 检查任务数据
	 * @param task 任务对象
	 * @returns 今日是否打卡
	 */
	function Check(task: any): boolean {
		let period: string = task.period[0];
		let duration: number = period.charAt(10) ? Number(period.substring(11)) : -1;

		// 最后一个打卡日的00:00
		const gap: number = Time.GapDay(new Date(), Time.EndDate(new Date(period.substring(0, 10)), duration));
		if (gap > 1) {									// 今日未打卡
			if (gap > 2) {				// 昨日未打卡
				let today_date: string = Time.Textualize(new Date(), "date");

				if (duration == -1) {	// 未开始打卡
					task.period[0] = today_date;
				} else {
					task.period.unshift(today_date);
				}
			}

			return false;
		} else {										// 今日已打卡
			return true;
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
}
