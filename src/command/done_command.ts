/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';

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

	file.writeList(item.type, data);

	file.log("事项 \"" + item.label + "(" + item.type + ")\" 已重做。");
}

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
				file.writeList(list_data.type, list_data);
			}

			file.log("已清除所有已办事项。");

			return true;
		} else {
			return false;
		}
	});
}