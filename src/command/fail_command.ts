/* 模块调用 */
import * as vscode from "vscode";
import * as log from "../log_set";
import { data } from "../operator/data_center";

/**
 * 重启事项
 * @param item 事项对象
 */
export function restart(item: any) {
	let fail_data = data.getFail();
	let item_data = fail_data[item.index];
	fail_data.splice(item.index, 1);
	data.setFail(fail_data);

	delete item_data.type;

	if (item.type in data.getTodo()) {
		data.pushTodo(item.type, item_data);
	}else{
		data.pushTodo("默认清单", item_data);
	}

	log.add(item, undefined, log.did.restart);
}

/**
 * 重启所有事项
 */
export async function restartAll() {
	return vscode.window.showInformationMessage("确认重启全部失效事项吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			let fail_data = data.getFail();
			for (let index = 0; index < fail_data.length; index++) {
				let item_data = fail_data[index];

				log.add(item_data, undefined, log.did.restart);

				let type = item_data.type;
				delete item_data.type;

				data.pushTodo(type, item_data);
			}

			data.setFail([]);

			return true;
		} else {
			return false;
		}
	});
}