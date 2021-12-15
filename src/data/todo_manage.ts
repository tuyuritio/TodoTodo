/* 模块调用 */
import * as vscode from "vscode";
import * as date from "../general/date_operator";
import * as log from "../general/log_manage";
import { data } from "./data_center";

/**
 * 完成事项
 * @param item 事项对象
 */
export function accomplish(item: any) {
	log.add(item, undefined, log.did.accomplish);

	if (item.cycle) {
		newCycle(item);
	}

	let item_data = data.copy(data.todo[item.type].list[item.index]);
	data.todo[item.type].list.splice(item.index, 1);

	item_data.type = item.type;
	item_data.time = date.toString(new Date());
	delete item_data.cycle;
	delete item_data.gaze;
	data.done.unshift(item_data);
}

/**
 * 关闭事项
 * @param item 事项对象
 */
export function shut(item: any) {
	log.add(item, undefined, log.did.shut);

	if (item.cycle) {
		newCycle(item);
	}

	let item_data = data.copy(data.todo[item.type].list[item.index]);
	data.todo[item.type].list.splice(item.index, 1);

	item_data.type = item.type;
	delete item_data.time;
	delete item_data.cycle;
	delete item_data.gaze;
	data.fail.unshift(item_data);
}

/**
 * 删除事项
 * @param item 事项对象
 * @param if_remind 是否确认删除
 * @returns Promise<boolean>
 */
export async function deleteItem(item: any, if_remind: boolean): Promise<boolean> {				// 跟delete重名了，我也很无奈
	if (if_remind) {
		return vscode.window.showInformationMessage("确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消").then((action) => {
			if (action == "确认") {
				let todo_data = data.todo[item.type];
				todo_data.list.splice(item.index, 1);

				// data.setTodo(item.type, todo_data);

				log.add(item, undefined, log.did.delete);

				return true;
			} else {
				return false;
			}
		});
	} else {
		data.todo[item.type].list.splice(item.index, 1);

		log.add(item, undefined, log.did.delete);

		return true;
	}
}

/**
 * 新建下一个周期的循环事项
 * @param cycle_item 循环事项对象
 */
export function newCycle(cycle_item: any) {
	let current_time = new Date();
	let cycle_time = date.toDate(cycle_item.time);

	if (cycle_item.cycle == "daily") {
		let today = new Date();
		today.setHours(0, 0, 0, 0);

		if (date.toNumber(cycle_time) < date.toNumber(today)) {
			while (date.toNumber(cycle_time) < date.toNumber(current_time)) {
				cycle_time.setDate(cycle_time.getDate() + 1);
			}
		} else {
			cycle_time.setDate(cycle_time.getDate() + 1);
		}
	} else if (cycle_item.cycle == "weekly") {
		let this_week = new Date();
		this_week.setDate(this_week.getDate() - (this_week.getDay() + 6) % 7);
		this_week.setHours(0, 0, 0, 0);

		if (date.toNumber(cycle_time) < date.toNumber(this_week)) {
			while (date.toNumber(cycle_time) < date.toNumber(current_time)) {
				cycle_time.setDate(cycle_time.getDate() + 7);
			}
		} else {
			cycle_time.setDate(cycle_time.getDate() + 7);
		}
	}

	let todo_data = data.todo[cycle_item.type];
	let new_item = data.copy(todo_data.list[cycle_item.index]);
	new_item.time = date.toString(cycle_time);

	data.todo[cycle_item.type].list.push(new_item);
	log.add(undefined, cycle_item, log.did.append);
}

/**
 * 当前办理事项
 * @param item 事项对象
 */
export function gaze(item: any) {
	data.todo[item.type].list[item.index].gaze = true;
}

/**
 * 取消办理事项
 * @param item 事项对象
 */
export function undo(item: any) {
	delete data.todo[item.type].list[item.index].gaze;
}

/**
 * 变更条目状态
 * @param entry 条目对象
 */
export function change(entry: any) {
	data.todo[entry.root.type].list[entry.root.index].entry[entry.type].on = !data.todo[entry.root.type].list[entry.root.index].entry[entry.type].on;
}

/**
 * 删除条目
 * @param entry 条目对象
 */
export function remove(entry: any) {
	delete data.todo[entry.root.type].list[entry.root.index].entry[entry.type];
}

/**
 * 删除原有事项
 * @param item 原有事项对象
 */
let old_item: any;				// 保留原有事项
export function deleteOld(item: any): void {
	old_item = item;

	data.todo[item.type].list.splice(item.index, 1);
}

/**
 * 新建事项
 * @param item 事项对象
 */
export function addNew(item: any): void {
	let cycle = item.cycle;
	let time = item.time;
	let entry = item.entry;

	let item_data = {
		label: item.label,
		priority: item.priority,
		cycle: cycle,
		time: time,
		entry: entry
	};

	if (!(item.type in data.todo)) {
		log.add(undefined, { type: item.type }, log.did.add);

		data.todo[item.type] = {
			type: item.type,
			priority: 0,
			list: []
		};
	}

	data.todo[item.type].list.push(item_data);

	if (old_item) {
		let old_data = old_item;
		old_data.type = old_item.type;
		old_data.label = old_item.label;

		log.add(old_data, item, log.did.edit);
	} else {
		log.add(undefined, item, log.did.add);
	}

	old_item = undefined;
}

/**
 * 保存数据
 */
export function save() {
	data.write();
}
