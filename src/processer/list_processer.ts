/* 模块调用 */
import { transceiver, date, message } from "../tool";
import { data } from "../data_center";

export namespace list_processer {
	/**
	 * 准备编辑事项
	 * @param item 事项对象
	 * @param state 事项状态
	 * @returns 数据
	 */
	export function prepare(item: any, state: "todo" | "done" | "fail"): void {
		let item_data: any;

		if (item) {
			item_data = data.list[state][item.id];
			item_data.id = item.id;
		} else {
			item_data = undefined;
		}

		transceiver.send("page.show");
		transceiver.send("page.post", "item", { item_data: item_data, state: state });
	}

	/**
	 * 创建清单
	 * @param list 清单名称
	 */
	export function create(list: string): void {
		data.profile.list_priority[list] = 0;
	}

	/**
	 * 显示清单列表
	 */
	export function alter_send(): void {
		transceiver.send("page.show");
		transceiver.send("page.post", "list");
	}

	/**
	 * 修改清单
	 * @param list 清单对象
	 */
	export function alter_receive(list: any): void {
		if (list.old.label == list.new.label && list.old.priority == list.new.priority) return;
		if (list.new.label.replace(/\s/g, "") == "") message.show("warning", "清单名称为空，请重新输入！");

		if (list.old.label != list.new.label) {
			for (let list_label in data.profile.list_priority) {
				if (list.new.label == list_label) message.show("warning", "清单名称重复，请重新输入！");
			}

			let todo = data.list.todo;
			for (let id in todo) {
				let item_data = todo[id];
				if (item_data.type == list.old.label) {
					item_data.type = list.new.label;
				}
			}
		}

		delete data.profile.list_priority[list.old.label];
		data.profile.list_priority[list.new.label] = list.new.priority;

		transceiver.send("view.todo");
		transceiver.send("view.page");
	}

	/**
	 * 移除清单
	 * @param list 清单对象
	 * @param if_remind 是否确认移除
	 * @returns 是否移除
	 */
	export async function remove(list: any, if_remind: boolean): Promise<void> {
		let if_remove: boolean = true;
		if (if_remind && await message.show("information", "确认移除清单 \"" + list.label + "\" 吗？", "确认", "取消") == "取消") {
			if_remove = false;
		}

		if (if_remove) {
			{
				let todo = data.list.todo;
				for (let id in todo) {
					if (todo[id].type == list.label) delete todo[id];
				}

				delete data.profile.list_priority[list.label];
			}
			transceiver.send("view.todo");
			transceiver.send("view.hint");
			transceiver.send("page.close");
		}
	}

	/**
	 * 清理逾期事项
	 * @returns 有无事项失效
	 */
	export function shutOverdue(remind_gap: any): void {
		let current_time: Date = new Date();
		let remind_start: Date = new Date();
		let remind_end: Date = new Date();

		if (remind_gap < 20 * 60 * 60) {				// 预警间隔是否有效
			remind_start.setSeconds(remind_start.getSeconds() + remind_gap);
			remind_end.setSeconds(remind_end.getSeconds() + remind_gap + 1);
		}

		let todo = data.copy(data.list.todo);
		for (let id in todo) {
			let item_data = todo[id];
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
