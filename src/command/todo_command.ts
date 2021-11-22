/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';
import * as date from '../operator/date_operator';

/**
 * 完成事项
 * @param item 事项对象
 */
export function accomplish(item: any) {
	if (item.cycle) {
		newCycle(item);
	}

	let data = file.getList(item.type);

	data.list[item.index].status = "done";
	data.list[item.index].time = date.toString(new Date());
	delete data.list[item.index].cycle;

	file.writeJSON(file.getList(item.type, true), data);

	console.log("List(" + item.type + ").Item(" + item.label + ").Status: todo -> done.");
}

/**
 * 关闭事项
 * @param item 事项对象
 */
export function shut(item: any) {
	if (item.cycle) {
		newCycle(item);
	}

	let data = file.getList(item.type);

	data.list[item.index].status = "fail";
	delete data.list[item.index].cycle;
	delete data.list[item.index].time;

	file.writeJSON(file.getList(item.type, true), data);

	console.log("List(" + item.type + ").Item(" + item.label + ").Status: todo -> fail.");
}

/**
 * 删除事项
 * @param item 事项对象
 * @returns Promise<boolean>
 */
export async function deleteItem(item: any): Promise<boolean> {				// 跟delete重名了，我也很无奈
	return vscode.window.showInformationMessage("确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			let data = file.getList(item.type);
			data.list.splice(item.index, 1);

			file.writeJSON(file.getList(item.type, true), data);

			console.log("List(" + item.type + ").Item(" + item.label + ").Status: Deleted.");

			return true;
		} else {
			return false;
		}
	});
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

		if (cycle_time < today) {
			while (cycle_time < current_time) {
				cycle_time.setDate(cycle_time.getDate() + 1);
			}
		} else {
			cycle_time.setDate(cycle_time.getDate() + 1);
		}
	} else if (cycle_item.cycle == "weekly") {
		let this_week = new Date();
		this_week.setDate(this_week.getDate() - (this_week.getDay() + 6) % 7);
		this_week.setHours(0, 0, 0, 0);

		if (cycle_time < this_week) {
			while (cycle_time < current_time) {
				cycle_time.setDate(cycle_time.getDate() + 7);
			}
		} else {
			cycle_time.setDate(cycle_time.getDate() + 7);
		}
	}

	let data = file.getList(cycle_item.type);

	let new_item = data.list[cycle_item.index];
	new_item.time = date.toString(cycle_time);
	data.list.push(new_item);

	file.writeJSON(file.getList(cycle_item.type, true), data);

	console.log("List(" + cycle_item.type + ").Item(" + cycle_item.label + "): Add new cycle item.");
}