/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';

/**
 * 重做事项
 * @param item 事项对象
 */
export function redo(item: any): void {
	let done_data = file.getJSON("done");
	let item_data = done_data[item.index];
	done_data.splice(item.index, 1);
	file.writeJSON(file.getJSON("done", true), done_data);

	delete item_data.time;
	delete item_data.type;

	let todo_data = file.getList(item.type);
	todo_data.list.push(item_data);
	file.writeList(item.type, todo_data);

	file.log("事项 \"" + item.label + "(" + item.type + ")\" 已重做。");
}

/**
 * 清空已办事项
 */
export async function clear() {
	return vscode.window.showInformationMessage("确认清空已办事项吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			file.writeJSON(file.getJSON("done", true), []);

			file.log("已清除所有已办事项。");

			return true;
		} else {
			return false;
		}
	});
}