/* 模块调用 */
import * as vscode from "vscode";
import * as log from "../log_set";
import { data } from "../operator/data_center";

/**
 * 重做事项
 * @param item 事项对象
 */
export function redo(item: any): void {
	let done_data = data.getDone();
	let item_data = done_data[item.index];
	done_data.splice(item.index, 1);
	data.setDone(done_data);

	delete item_data.time;
	delete item_data.type;

	if (item.type in data.getTodo()) {
		data.pushTodo(item.type, item_data);
	} else {
		data.pushTodo("默认清单", item_data);
	}

	log.add(item, undefined, log.did.redo);
}

/**
 * 清空已办事项
 */
export async function clear() {
	return vscode.window.showInformationMessage("确认清空已办事项吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			data.setDone([]);

			log.add(undefined, undefined, log.did.clear);
			
			return true;
		} else {
			return false;
		}
	});
}