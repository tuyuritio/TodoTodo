/* 模块调用 */
import { data } from "../data/data_center";

/* 全局变量 */
export enum did { add, delete, append, edit, accomplish, shut, redo, clear, restart };	// 操作类型

/**
 * 写入日志信息
 * @param new_data 新数据
 * @param action 操作类型
 * @param old_data 原有数据
 */
export function add(old_data?: any, new_data?: any, action?: did): void {
	let time = new Date();

	// 基本日志形式
	let new_log: { time: string, list?: string, item?: string, action?: string, old: any, new: any } = {
		time: time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate().toString().padStart(2, "0") + "-" + time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0"),
		action: undefined,
		list: undefined,
		item: undefined,
		old: {},
		new: {}
	};

	let if_change = true;

	if (action != undefined) {
		let action_arrary = ["add", "delete", "append", "edit", "accomplish", "shut", "redo", "clear", "restart"];
		new_log.action = action_arrary[action];
	} else {
		new_log.action = "welcome";
	}

	if (action == did.edit) {
		if_change = false;
	}

	// 以有无label判断list还是item
	if (new_data) {
		new_log.list = new_data.type;
		new_log.item = new_data.label;
	} else if (old_data) {
		new_log.list = old_data.type;
		new_log.item = old_data.label;
	}

	if (new_data && old_data) {
		let item_properties = { type: undefined, label: undefined, priority: undefined, cycle: undefined, time: undefined, entry: undefined };
		for (let property in item_properties) {
			if (property == "entry") {							// 条目变更
				if (new_data.entry && old_data.entry) {			// 同时存在
					for (let entry in new_data.entry) {
						if (!old_data.entry[entry]) {
							if_change = true;

							// 默认条目名称修改
							new_log.new[entry.substring(0, 7) == "__entry" ? "条目" + entry.substring(8) : entry] = new_data.entry[entry].content;
						} else {
							if (new_data.entry[entry].content != old_data.entry[entry].content) {
								if_change = true;

								new_log.new[entry.substring(0, 7) == "__entry" ? "条目" + entry.substring(8) : entry] = new_data.entry[entry].content;
								new_log.old[entry.substring(0, 7) == "__entry" ? "条目" + entry.substring(8) : entry] = old_data.entry[entry].content;
							}
						}
					}

					// 旧项有但新项无的条目
					for (let entry in old_data.entry) {
						if (!new_data.entry[entry]) {
							if_change = true;

							new_log.old[entry.substring(0, 7) == "__entry" ? "条目" + entry.substring(8) : entry] = old_data.entry[entry].content;
						}
					}
				} else if (new_data.entry && !old_data.entry) {			// 旧项不存在
					if_change = true;

					for (let entry in new_data.entry) {
						new_log.new[entry.substring(0, 7) == "__entry" ? "条目" + entry.substring(8) : entry] = new_data.entry[entry].content;
					}
				} else if (!new_data.entry && old_data.entry) {			// 新项不存在
					if_change = true;

					for (let entry in old_data.entry) {
						new_log.old[entry.substring(0, 7) == "__entry" ? "条目" + entry.substring(8) : entry] = old_data.entry[entry].content;
					}
				}
			} else {				// 普通变更数据
				if (new_data[property] != old_data[property]) {
					if_change = true;

					new_log.new[property] = new_data[property];
					new_log.old[property] = old_data[property];
				}
			}
		}
	}

	if (if_change) {
		data.log.push(new_log);
	}
}
