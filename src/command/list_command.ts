/* 模块调用 */
import * as vscode from "vscode";
import * as file from "../operator/file_operator";
import * as date from "../operator/date_operator";
import * as todo from "./todo_command";
import * as log from "../log_set";

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

			if (item_data.time) {
				let deadline = date.toDate(item_data.time);

				if (date.toNumber(deadline) < date.toNumber(expected_time)) {
					let item = {
						type: data[i].type,
						index: j,
						label: item_data.label,
						time: item_data.time,
						cycle: item_data.cycle,
						gaze: item_data.gaze
					};
					items.push(item);
				}
			}
		}
	}

	file.writeJSON(file.getJSON("recent", true), items);
}

/**
 * 清理逾期事项
 */
export function shutOverdueItem() {
	let if_shut = false;

	let data = file.getJSON("recent");
	let current_time = new Date();

	for (let index = 0; index < data.length; index++) {
		if (date.toNumber(data[index].time) < date.toNumber(current_time)) {
			if_shut = true;

			if (data[index].gaze) {
				todo.accomplish(data[index]);
			} else {
				todo.shut(data[index]);
				vscode.window.showWarningMessage("事项 \"" + data[index].label + "\" 已逾期！");
			}

			data.splice(index, 1);
			index--;
		}
	}

	if (if_shut) {
		file.writeJSON(file.getJSON("recent", true), data);
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

			// 有序则break
			// list[pointer]在前，item在后
			while (pointer >= 0) {																		// 插入排序
				if (!list[pointer].time && item.time || list[pointer].time && !item.time) {				// 长期不等
					if (!list[pointer].time) break;
				} else {
					if (list[pointer].time && item.time) {												// 同非长期
						if (date.toNumber(list[pointer].time) != date.toNumber(item.time)) {				// 时间不同
							if (date.toNumber(list[pointer].time) < date.toNumber(item.time)) break;		// Todo升序
						} else {
							if (list[pointer].priority >= item.priority) break;
						}
					} else {																			// 同长期
						if (list[pointer].priority >= item.priority) break;
					}
				}

				list[pointer + 1] = list[pointer];
				pointer--;
			}

			list[pointer + 1] = item;
		}
		data[index].list = list;
		file.writeList(data[index].type, data[index]);
	}
}

/**
 * 删除清单
 * @param list 清单对象
 * @param if_remind 是否确认删除
 * @param move 删除清单的方法 - "move"则移动到默认清单；"remove"则直接删除。
 * @returns Promise<boolean>
 */
export async function deleteList(list: any, if_remind: boolean, move: string): Promise<boolean> {
	if (list.type == "默认清单") {
		vscode.window.showWarningMessage("默认清单无法删除！");
		return false;
	}

	if (if_remind) {
		return vscode.window.showInformationMessage("确认删除清单 \"" + list.type + "\" 吗？", "确认", "取消").then((action) => {
			if (action == "确认") {
				if (move == "move") {
					let data = file.getList(list.type).list;
					let default_data = file.getList("默认清单");

					default_data.list = default_data.list.concat(data);
					file.writeList("默认清单", default_data);
				}

				file.removeList(list.type);

				log.add({ type: list.type }, undefined, log.did.delete);

				return true;
			} else {
				return false;
			}
		});
	} else {
		if (move == "move") {
			let data = file.getList(list.type).list;
			let default_data = file.getList("默认清单");

			default_data.list = default_data.list.concat(data);
			file.writeList("默认清单", default_data);
		}

		file.removeList(list.type);

		log.add({ type: list.type }, undefined, log.did.delete);

		return true;
	}
}

/**
 * 编辑清单
 * @param data 清单对象
 */
export function editList(list: any) {
	if (list.new.priority != list.old.priority) {
		let data = file.getList(list.old.type);
		data.priority = list.new.priority;
		file.writeList(list.old.type, data);
	}

	if (list.new.type != list.old.type) {
		let data = file.getList();
		let if_same = false;
		for (let index = 0; index < data.length; index++) {
			if (index != list.index + 1 && list.new.type == data[index].type) {
				vscode.window.showWarningMessage("存在同名清单，请重新输入！");
				if_same = true;
				break;
			}
		}

		if (!if_same) {
			file.renameList(list.old.type, list.new.type);
		}
	}

	log.add({ type: list.old.type, priority: list.old.priority }, { type: list.new.type, priority: list.new.priority }, log.did.edit);
}