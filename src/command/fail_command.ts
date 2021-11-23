/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';

/**
 * 重启事项
 * @param item 事项对象
 */
export function restart(item: any) {
	let data = file.getList(item.type);
	let item_data = data.list[item.index];
	data.list.splice(item.index, 1);

	item_data.status = "todo";
	data.list.push(item_data);

	file.writeList(item.type, data);

	file.log("事项 \"" + item.label + "(" + item.type + ")\" 已重启。");
}

/**
 * 重启所有事项
 */
export async function restartAll() {
	return vscode.window.showInformationMessage("确认重启全部失效事项吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			let data = file.getList();
			for (let index = 0; index < data.length; index++) {
				let list_data = data[index];
				for (let i = 0; i < list_data.list.length; i++) {
					let item_data = list_data.list[i];

					if (item_data.status == "fail") {
						list_data.list.splice(i, 1);

						item_data.status = "todo";
						list_data.list.push(item_data);
					}
				}
				file.writeList(list_data.type, list_data);
			}

			file.log("已重启所有失效事项。")

			return true;
		} else {
			return false;
		}
	});
}