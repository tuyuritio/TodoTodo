/* 模块调用 */
import * as vscode from "vscode";
import * as date from "../operator/date_operator";
import * as todo from "./todo_command";
import * as log from "../log_set";
import { data } from "../operator/data_center";

/**
 * 检索已经逾期或未来24小时内将要逾期的事项
 */
export function getRecentItem() {
	let expected_time = new Date();
	expected_time.setHours(expected_time.getHours() + 24);

	data.recent = [];
	for (let list in data.todo) {
		for (let index = 0; index < data.todo[list].length; index++) {
			let item_data = data.copy(data.todo[list].list[index]);

			if (item_data.time && date.toNumber(item_data.time) < date.toNumber(expected_time)) {
				let item = {
					type: list,
					index: index,
					label: item_data.label,
					time: item_data.time,
					cycle: item_data.cycle,
					gaze: item_data.gaze
				};

				data.recent.push(item);
			}
		}
	}
}

/**
 * 清理逾期事项
 */
export function shutOverdueItem() {
	let if_shut = false;
	let current_time = new Date();

	for (let index = 0; index < data.recent.length; index++) {
		if (date.toNumber(data.recent[index].time) < date.toNumber(current_time)) {
			if_shut = true;

			if (data.recent[index].gaze) {
				todo.accomplish(data.recent[index]);
			} else {
				todo.shut(data.recent[index]);
				vscode.window.showWarningMessage("事项 \"" + data.recent[index].label + "\" 已逾期！");
			}

			data.recent.splice(index, 1);
			index--;
		}
	}

	return if_shut;
}

/**
 * 排序事项
 */
export function sortItem() {
	let todo = data.todo;
	for (let list in data.todo) {
		for (let index = 1; index < data.todo[list].list.length; index++) {
			let pointer = index - 1;
			let item = data.copy(data.todo[list].list[index]);

			// 有序则break
			// pointer在前，index在后
			while (pointer >= 0) {																																			// 插入排序
				if (!data.todo[list].list[pointer].time && item.time || data.todo[list].list[pointer].time && !item.time) {	// 长期不等
					if (!data.todo[list].list[pointer].time) break;
				} else {
					if (data.todo[list].list[pointer].time && item.time) {																			// 同非长期
						if (date.toNumber(data.todo[list].list[pointer].time) != date.toNumber(item.time)) {											// 时间不同
							if (date.toNumber(data.todo[list].list[pointer].time) < date.toNumber(item.time)) break;
						} else {
							if (data.todo[list].list[pointer].priority >= item.priority) break;
						}
					} else {																																				// 同长期
						if (data.todo[list].list[pointer].priority >= item.priority) break;
					}
				}

				data.todo[list].list[pointer + 1] = data.todo[list].list[pointer];
				pointer--;
			}

			data.todo[list].list[pointer + 1] = item;
		}
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
					data.todo["默认清单"].list = data.todo["默认清单"].list.concat(data.todo[list.type].list);
				}

				delete data.todo[list.type];

				log.add({ type: list.type }, undefined, log.did.delete);

				return true;
			} else {
				return false;
			}
		});
	} else {
		if (move == "move") {
			data.todo["默认清单"].list = data.todo["默认清单"].list.concat(data.todo[list.type].list);
		}

		delete data.todo[list.type];

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
		data.todo[list_data.old.type].priority = list_data.new.priority;
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
		for (let list in data.todo) {
			if (list == list_data.new.type) {
				vscode.window.showWarningMessage("存在同名清单，请重新输入！");
				return;
			}
		}

		let old_data = data.copy(data.todo[list_data.old.type]);
		old_data.type = list_data.new.type;

		delete data.todo[list_data.old.type];
		data.todo[list_data.new.type] = old_data;
	}

	log.add({ type: list_data.old.type, priority: list_data.old.priority }, { type: list_data.new.type, priority: list_data.new.priority }, log.did.edit);
}