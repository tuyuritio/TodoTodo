/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';
import * as time from '../operator/date_operator';
import * as todo from './todo_command';

/**
 * 检索已经逾期或未来24小时内将要逾期的事项
 */
export function getRecentItem() {
	let data = file.getList();
	let expected_time = new Date();
	expected_time.setHours(expected_time.getHours() + 24);

	let items = [];
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].list.length; j++) {
			let item_data = data[i].list[j];

			if (item_data.status == "todo" && item_data.time) {
				let deadline = time.toDate(item_data.time);

				if (deadline < expected_time) {
					let item = {
						type: data[i].type,
						index: j,
						label: item_data.label,
						time: item_data.time,
						cycle: item_data.cycle
					}
					items.push(item);
				}
			}
		}
	}

	file.writeJSON(file.getJSON("recent", true), items);

	console.log("List(all).Item(recent): Got.");
}

/**
 * 清理逾期事项
 */
export function shutOverdue() {
	let if_shut = false;

	let data = file.getJSON("recent");
	let current_time = new Date();

	for (let index = 0; index < data.length; index++) {
		if (time.toDate(data[index].time) < current_time) {
			if_shut = true;

			todo.shut(data[index]);
			vscode.window.showWarningMessage("事项 \"" + data[index].label + "\" 已逾期！");

			data.splice(index, 1);
			index--;
		}
	}

	if (if_shut) {
		file.writeJSON(file.getJSON("recent", true), data);
		console.log("List(all).Item(fail).Status: todo -> fail.");
	}


	return if_shut;
}

/**
 * 排序事项
 */
export function sortItem() {
	let data = file.getList();

	for (let index = 0; index < data.length; index++) {
		let list = data[index].list;

		for (let i = 1; i < list.length; i++) {
			let pointer = i - 1;
			let item = list[i];

			while (pointer >= 0) {
				if (!list[pointer].time || !item.time) {
					if (item.time) break;													// 长期事项优先
					if (!list[pointer].time) {												// 同为长期事项
						if (list[pointer].priority >= item.priority) break;
					}
				} else if (time.toDate(list[pointer].time) != time.toDate(item.time)) {
					if (time.toDate(list[pointer].time) <= time.toDate(item.time)) break;	// 早期事项优先
				} else if (list[pointer].priority >= item.priority) {
					break;																	// 高优先级优先
				};

				list[pointer + 1] = list[pointer];
				pointer--;
			}

			list[pointer + 1] = item;
		}
		data[index].list = list;
		file.writeJSON(file.getList(data[index].type, true), data[index]);
	}

	console.log("List(all).Item(all): Sorted.")
}

/**
 * 删除清单
 * @param list 清单对象
 * @param move 是否移动事项到普通清单 - true则移动；false则删除。- **默认：** true
 */
export async function deleteList(list: any, move: boolean = true) {
	return vscode.window.showInformationMessage("确认删除清单 \"" + list.label + "\" 吗？", "确认", "取消").then((action) => {
		if (action == "确认") {
			if (move) {
				let data = file.getList(list.label).list;
				let default_data = file.getList("普通");

				default_data.list = default_data.list.concat(data);
				file.writeJSON(file.getList("普通", true), default_data);
			}

			file.removeList(list.label);

			console.log("List(" + list.label + "): Deleted.");

			return true;
		} else {
			return false;
		}
	});
}