/* 模块调用 */
import * as vscode from "vscode";
import * as date from "../operator/date_operator";
import * as todo from "./todo_command";
import { data } from "../operator/data_center";
import * as log from "../log_set";

/**
 * 检索已经逾期或未来24小时内将要逾期的事项
 */
export function getRecentItem() {
	let list_data = data.getTodo();
	let expected_time = new Date();
	expected_time.setHours(expected_time.getHours() + 24);

	let items = [];
	for (let i = 0; i < list_data.length; i++) {
		for (let j = 0; j < list_data[i].list.length; j++) {
			let item_data = list_data[i].list[j];

			if (item_data.time) {
				let deadline = date.toDate(item_data.time);

				if (date.toNumber(deadline) < date.toNumber(expected_time)) {
					let item = {
						type: list_data[i].type,
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

	data.setRecent(items);
}

/**
 * 清理逾期事项
 */
export function shutOverdueItem() {
	let if_shut = false;

	let recent_data = data.getRecent();
	let current_time = new Date();

	for (let index = 0; index < recent_data.length; index++) {
		if (date.toNumber(recent_data[index].time) < date.toNumber(current_time)) {
			if_shut = true;

			if (recent_data[index].gaze) {
				todo.accomplish(recent_data[index]);
			} else {
				todo.shut(recent_data[index]);
				vscode.window.showWarningMessage("事项 \"" + recent_data[index].label + "\" 已逾期！");
			}

			recent_data.splice(index, 1);
			index--;
		}
	}

	if (if_shut) {
		data.setRecent(recent_data);
	}

	return if_shut;
}

/**
 * 排序事项
 */
export function sortItem() {
	let todo_data = data.getTodo();

	for (let list in todo_data) {
		let list_data = todo_data[list].list;
		for (let i = 1; i < list_data.length; i++) {
			let pointer = i - 1;
			let item = list_data[i];

			// 有序则break
			// list[pointer]在前，item在后
			while (pointer >= 0) {																		// 插入排序
				if (!list_data[pointer].time && item.time || list_data[pointer].time && !item.time) {				// 长期不等
					if (!list_data[pointer].time) break;
				} else {
					if (list_data[pointer].time && item.time) {												// 同非长期
						if (date.toNumber(list_data[pointer].time) != date.toNumber(item.time)) {				// 时间不同
							if (date.toNumber(list_data[pointer].time) < date.toNumber(item.time)) break;		// Todo升序
						} else {
							if (list_data[pointer].priority >= item.priority) break;
						}
					} else {																			// 同长期
						if (list_data[pointer].priority >= item.priority) break;
					}
				}

				list_data[pointer + 1] = list_data[pointer];
				pointer--;
			}

			list_data[pointer + 1] = item;
		}

		todo_data[list].list = list_data;
		data.setTodo(list, todo_data[list]);
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
					let todo_data = data.getTodo(list.type).list;
					let default_data = data.getTodo("默认清单");

					default_data.list = default_data.list.concat(todo_data);
					data.setTodo("默认清单", default_data);
				}

				data.deleteList(list.type);

				log.add({ type: list.type }, undefined, log.did.delete);

				return true;
			} else {
				return false;
			}
		});
	} else {
		if (move == "move") {
			let todo_data = data.getTodo(list.type).list;
			let default_data = data.getTodo("默认清单");

			default_data.list = default_data.list.concat(todo_data);
			data.setTodo("默认清单", default_data);
		}

		data.deleteList(list.type);

		log.add({ type: list.type }, undefined, log.did.delete);

		return true;
	}
}

/**
 * 编辑清单
 * @param data 清单对象
 */
export function editList(list_data: any) {
	if (list_data.new.priority != list_data.old.priority) {
		let todo_data = data.getTodo(list_data.old.type);
		todo_data.priority = list_data.new.priority;
		data.setTodo(list_data.old.type, todo_data);
	}

	for (let index = 0; index < list_data.new.type.length; index++) {
		let character = list_data.new.type[index];
		let invalid_character = ["\\", "/", ":", "*", "?", "\"", "<", ">", "|"];
		if (invalid_character.includes(character)) {
			vscode.window.showWarningMessage("清单名称中禁止包含以下字符：\\, /, :, *, ?, \", <, >, |，请重新输入！");
			return;
		}
	}

	if (list_data.new.type != list_data.old.type) {
		let todo_data = data.getTodo();
		let if_same = false;
		for (let list in todo_data) {
			if (list == list_data.new.type) {
				vscode.window.showWarningMessage("存在同名清单，请重新输入！");
				if_same = true;
				return;
			}
		}
	}
	log.add({ type: list_data.old.type, priority: list_data.old.priority }, { type: list_data.new.type, priority: list_data.new.priority }, log.did.edit);
}