/* 模块调用 */
import * as vscode from "vscode";
import * as log from "../log_set";
import { data } from "../operator/data_center";

/**
 * 重启事项
 * @param item 事项对象
 */
export function restart(item: any) {
	let item_data = data.copy(data.fail[item.index]);
	data.fail.splice(item.index, 1);

	delete item_data.type;

	if (item.type in data.todo) {
		data.todo[item.type].list.push(item_data);
	} else {
		data.todo["默认清单"].list.push(item_data);
	}

	log.add(item, undefined, log.did.restart);
}

/**
 * 重启所有事项
 */
export async function restartAll() {
	return vscode.window.showInformationMessage("确认重启全部失效事项吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			for (let index = 0; index < data.fail.length; index++) {
				let item_data = data.copy(data.fail[index]);

				log.add(item_data, undefined, log.did.restart);

				let type = item_data.type;
				delete item_data.type;

				data.todo[type].list.push(item_data);
			}

			data.fail = [];

			return true;
		} else {
			return false;
		}
	});
}