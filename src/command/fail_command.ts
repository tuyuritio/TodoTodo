/* 模块调用 */
import * as vscode from "vscode";
import * as file from "../operator/file_operator";

/**
 * 重启事项
 * @param item 事项对象
 */
export function restart(item: any) {
	let fail_data = file.getJSON("fail");
	let item_data = fail_data[item.index];
	fail_data.splice(item.index, 1);
	file.writeJSON(file.getJSON("fail", true), fail_data);

	delete item_data.type;

	let todo_data = file.getList(item.type);
	todo_data.list.push(item_data);
	file.writeList(item.type, todo_data);

	file.log("事项 \"" + item.label + "(" + item.type + ")\" 已重启。");
}

/**
 * 重启所有事项
 */
export async function restartAll() {
	return vscode.window.showInformationMessage("确认重启全部失效事项吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			let fail_data = file.getJSON("fail");
			for (let index = 0; index < fail_data.length; index++) {
				let item_data = fail_data[index];

				let type = item_data.type;
				delete item_data.type;

				let todo_data = file.getList(type);
				todo_data.list.push(item_data);
				file.writeList(type, todo_data);
			}

			file.writeJSON(file.getJSON("fail", true), []);

			file.log("已重启所有失效事项。")

			return true;
		} else {
			return false;
		}
	});
}