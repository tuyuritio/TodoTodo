/* 模块调用 */
import { Transceiver, Time, Message } from "../Tool";
import { Data } from "../DataCenter";

export namespace ListProcesser {
	/**
	 * 准备修改清单
	 * @param list 清单对象
	 */
	export function Load(list?: any): void {
		let maximum_priority: number = 0;

		for (const id in Data.Profile.list) {
			const list_data = Data.Profile.list[id];
			if (list_data.priority > maximum_priority) maximum_priority = list_data.priority;
		}

		if (list) {
			Transceiver.Send("input.list", maximum_priority, list.id, Data.Profile.list[list.id]);
		} else {
			Transceiver.Send("input.list", maximum_priority);
		}
	}

	/**
	 * 修改清单
	 * @param id 清单ID
	 * @param list 清单对象
	 */
	export function Alter(id: string, list: any): void {
		Data.Profile.list[id] = list;
		Transceiver.Send("view.todo");
	}

	/**
	 * 移除清单
	 * @param list 清单对象
	 */
	export async function Remove(list: any): Promise<void> {
		if (await Message.Show("warning", "确认移除清单 \"" + list.label + "\" 吗？", "确认", "取消") == "确认") {
			const todo = Data.List.todo;
			for (const id in todo) {
				if (todo[id].type == list.id) delete todo[id];
			}

			delete Data.Profile.list[list.id];
			Transceiver.Send("view.todo");
		}
	}

	/**
	 * 清理逾期事项
	 */
	export function ShutOverdue(): void {
		const current_date: string = Time.Textualize(new Date(), "date");
		let remind_gap = Time.Parse(current_date + "-" + Data.Configuration.shut_ahead) - Time.Parse(current_date);
		remind_gap = remind_gap < 20 * 60 * 60 * 1000 ? remind_gap / 1000 : 60 * 60;

		let remind_start: Date = new Date();
		let remind_end: Date = new Date();
		remind_start.setSeconds(remind_start.getSeconds() + remind_gap);
		remind_end.setSeconds(remind_end.getSeconds() + remind_gap + 1);

		const current_time: Date = new Date();
		for (const id in Data.List.todo) {
			const item_data = Data.List.todo[id];
			if (item_data.cycle != "secular") {
				if (item_data.time < Time.Parse(current_time)) {
					if (item_data.gaze) {
						Transceiver.Send("todo.accomplish", { id: id });
					} else {
						Transceiver.Send("todo.shut", { id: id });
						Message.Show("warning", "事项 \"" + item_data.label + "\" 已逾期！");
					}
				} else if (Time.Parse(remind_start) < Time.Parse(item_data.time) && Time.Parse(item_data.time) <= Time.Parse(remind_end)) {
					Message.Show("warning", "事项 \"" + item_data.label + "\" 即将逾期！");
				}
			}
		}
	}
}
