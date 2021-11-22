/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';

/**
 * 清空已办事项
 */
export async function clear() {
	return vscode.window.showInformationMessage("确认清空已办事项吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			let data = file.getList();
			for (let index = 0; index < data.length; index++) {
				let list_data = data[index];
				for (let i = 0; i < list_data.list.length; i++) {
					if (list_data.list[i].status == "done") {
						list_data.list.splice(i, 1);
					}
				}
				file.writeJSON(file.getList(list_data.type, true), list_data);
			}

			console.log("List(all).Item(done): Deleted.");

			return true;
		} else {
			return false;
		}
	});
}

/**
 * 重做事项
 * @param item 事项对象
 */
export function redo(item: any): void {
	let data = file.getList(item.type);
	let item_data = data.list[item.index];
	data.list.splice(item.index, 1);

	item_data.status = "todo";
	delete item_data.time;
	data.list.push(item_data);

	file.writeJSON(file.getList(item.type, true), data);

	console.log("List(" + item.type + ").Item(" + item.label + ").Status: done -> todo.");
}