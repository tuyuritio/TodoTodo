/* 模块调用 */
import * as vscode from "vscode";
import * as date from "../operator/date_operator";
import { data } from "../operator/data_center";

/**
 * 完成事项
 * @param item 事项对象
 */
export function accomplish(item: any) {
	if (item.cycle) {
		newCycle(item);
	}

	let todo_data = data.getTodo(item.type);
	let item_data = todo_data.list[item.index];

	todo_data.list.splice(item.index, 1);

	item_data.type = item.type;
	item_data.time = date.toString(new Date());
	delete item_data.cycle;
	delete item_data.gaze;

	data.unshiftDone(item_data);
}

/**
 * 关闭事项
 * @param item 事项对象
 */
export function shut(item: any) {
	if (item.cycle) {
		newCycle(item);
	}

	let todo_data = data.getTodo(item.type);
	let item_data = todo_data.list[item.index];

	todo_data.list.splice(item.index, 1);

	data.setTodo(item.type, todo_data);

	item_data.type = item.type;
	delete item_data.time;
	delete item_data.cycle;
	delete item_data.gaze;

	data.unshiftFail(item_data);
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
				let todo_data = data.getTodo(item.type);
				todo_data.list.splice(item.index, 1);

				data.setTodo(item.type, todo_data);

				return true;
			} else {
				return false;
			}
		});
	} else {
		let todo_data = data.getTodo(item.type);
		todo_data.list.splice(item.index, 1);

		data.setTodo(item.type, todo_data);

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

	let todo_data = data.getTodo(cycle_item.type);

	let new_item = todo_data.list[cycle_item.index];
	new_item.time = date.toString(cycle_time);
	todo_data.list.push(new_item);

	data.setTodo(cycle_item.type, todo_data);
}

/**
 * 当前办理事项
 * @param item 事项对象
 */
export function gaze(item: any) {
	data.getTodo(item.type).list[item.index].gaze = true;
}

/**
 * 取消办理事项
 * @param item 事项对象
 */
export function undo(item: any) {
	delete data.getTodo(item.type).list[item.index].gaze;
}

/**
 * 删除原有事项
 * @param item 原有事项对象
 */
let old_item: any;				// 保留原有事项
export function deleteOld(item: any): void {
	old_item = item;

	data.getTodo(item.type).list.splice(item.index, 1);
}

/**
 * 新建事项
 * @param item 事项对象
 */
export function addNew(item: any): void {
	let todo_data = data.getTodo(item.type);

	let cycle = item.cycle;
	let time = item.time;
	let place = item.place;
	let mail = item.mail;
	let particulars = item.particulars;

	let item_data = {
		label: item.label,
		priority: item.priority,
		cycle: cycle,
		time: time,
		place: place,
		mail: mail,
		particulars: particulars
	};

	todo_data.list.push(item_data);
	data.setTodo(item.type, todo_data);

	old_item = undefined;
}