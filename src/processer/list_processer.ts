/* 模块调用 */
import { transceiver, date, message } from "../tool";
import { data } from "../data_center";

export namespace list_processer {
	/**
	 * 准备修改清单
	 * @param list 清单对象
	 */
	export function load(list?: any) {
		let maximum_priority: number = 0;

		for (let id in data.profile.list) {
			let list_data = data.profile.list[id];
			if (list_data.priority > maximum_priority) maximum_priority = list_data.priority;
		}

		if (list) {
			transceiver.send("input.list", maximum_priority, list.id, data.profile.list[list.id]);
		} else {
			transceiver.send("input.list", maximum_priority);
		}
	}

	/**
	 * 修改清单
	 * @param id 清单ID
	 * @param list 清单对象
	 */
	export function alter(id: string, list: any): void {
		data.profile.list[id] = list;

		transceiver.send("view.todo");
	}

	/**
	 * 移除清单
	 * @param list 清单对象
	 * @returns 是否移除
	 */
	export async function remove(list: any): Promise<void> {
		if (await message.show("information", "确认移除清单 \"" + list.label + "\" 吗？", "确认", "取消") == "确认") {
			let todo = data.list.todo;
			for (let id in todo) {
				if (todo[id].type == list.id) delete todo[id];
			}

			delete data.profile.list[list.id];

			transceiver.send("view.todo");
			transceiver.send("view.hint");
		}
	}

	/**
	 * 清理逾期事项
	 * @returns 有无事项失效
	 */
	export function shutOverdue(): void {
		let current_date: string = date.textualize(new Date(), "date");
		let remind_gap = date.parse(current_date + "-" + data.configuration.shut_ahead) - date.parse(current_date);
		remind_gap = remind_gap < 20 * 60 * 60 * 1000 ? remind_gap / 1000 : 60 * 60;

		let remind_start: Date = new Date();
		let remind_end: Date = new Date();
		remind_start.setSeconds(remind_start.getSeconds() + remind_gap);
		remind_end.setSeconds(remind_end.getSeconds() + remind_gap + 1);

		let current_time: Date = new Date();
		for (let id in data.list.todo) {
			let item_data = data.list.todo[id];
			if (item_data.cycle != "secular") {
				if (date.parse(item_data.time) < date.parse(current_time)) {
					if (item_data.gaze) {
						transceiver.send("todo.accomplish", { id: id });
					} else {
						transceiver.send("todo.shut", { id: id });
						message.show("warning", "事项 \"" + item_data.label + "\" 已逾期！");
					}
				} else if (date.parse(remind_start) < date.parse(item_data.time) && date.parse(item_data.time) <= date.parse(remind_end)) {
					message.show("warning", "事项 \"" + item_data.label + "\" 即将逾期！");
				}
			}
		}
	}
}
