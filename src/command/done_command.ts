/* 模块调用 */
import * as vscode from "vscode";
import * as log from "../log_set";
import { data } from "../operator/data_center";

/**
 * 重做事项
 * @param item 事项对象
 */
export function redo(item: any): void {
	let item_data = data.copy(data.done[item.index]);
	data.done.splice(item.index, 1);

	delete item_data.time;
	delete item_data.type;

	if (item.type in data.todo) {
		data.todo[item.type].list.push(item_data);
	} else {
		data.todo["默认清单"].list.push(item_data);
	}

	log.add(item, undefined, log.did.redo);
}

/**
 * 清空已办事项
 */
export async function clear() {
	return vscode.window.showInformationMessage("确认清空已办事项吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			data.done = [];

			log.add(undefined, undefined, log.did.clear);

			return true;
		} else {
			return false;
		}
	});
}