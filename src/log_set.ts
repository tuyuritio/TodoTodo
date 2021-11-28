import * as file from "./operator/file_operator";

/* 全局变量 */
export enum did { add, delete, append, edit, accomplish, shut, redo, clear, restart };	// 操作类型

/**
 * 写入日志信息
 * @param new_data 新数据
 * @param action 操作类型
 * @param old_data 原有数据
 */
export function add(old_data?: any, new_data?: any, action?: did): void {
	let data = file.getJSON("log");
	let time = new Date();

	let new_log: { time: string, list?: string, item?: string, action?: string, old?: { label?: string, type?: string, priority?: number, cycle?: string, time?: string, place?: string, mail?: string, particulars?: string }, new?: { label?: string, type?: string, priority?: number, cycle?: string, time?: string, place?: string, mail?: string, particulars?: string }, text?: string } = {
		time: time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate().toString().padStart(2, "0") + "-" + time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0"),
		action: undefined,
		list: undefined,
		item: undefined,
		old: undefined,
		new: undefined,
		text: undefined
	};

	switch (action) {
		// 用有无label判断list还是item
		case did.add:
			new_log.action = "add";

			new_log.list = new_data.type;
			if (new_data.label) {
				new_log.item = new_data.label;
			}

			break;

		case did.append:
			new_log.action = "append";

			new_log.list = new_data.type;
			new_log.item = new_data.label;

			new_log.new = {
				cycle: new_data.cycle,
				time: new_data.time
			};

			break;

		case did.delete:
			new_log.action = "delete";

			new_log.list = old_data.type;
			if (old_data.label) {
				new_log.item = old_data.label;
			}

			break;

		case did.edit:
			new_log.action = "edit";

			new_log.list = new_data.type;
			if (new_data.label) {
				new_log.item = new_data.label;

				new_log.old = {};
				new_log.new = {};

				if (old_data.label != new_data.label) {
					new_log.old.label = old_data.label;
					new_log.new.label = new_data.label;
				}

				if (old_data.type != new_data.type) {
					new_log.old.type = old_data.type;
					new_log.new.type = new_data.type;
				}

				if (old_data.priority != new_data.priority) {
					new_log.old.priority = old_data.priority;
					new_log.new.priority = new_data.priority;
				}

				if (old_data.cycle != new_data.cycle) {
					new_log.old.cycle = old_data.cycle;
					new_log.new.cycle = new_data.cycle;
				}

				if (old_data.time != new_data.time) {
					new_log.old.time = old_data.time;
					new_log.new.time = new_data.time;
				}

				if (old_data.place != new_data.place) {
					new_log.old.place = old_data.place;
					new_log.new.place = new_data.place;
				}

				if (old_data.mail != new_data.mail) {
					new_log.old.mail = old_data.mail;
					new_log.new.mail = new_data.mail;
				}

				if (old_data.particulars != new_data.particulars) {
					new_log.old.particulars = old_data.particulars;
					new_log.new.particulars = new_data.particulars;
				}
			}

			break;

		case did.accomplish:
			new_log.action = "accomplish";

			new_log.list = old_data.type;
			new_log.item = old_data.label;

			break;

		case did.redo:
			new_log.action = "redo";

			new_log.list = old_data.type;
			new_log.item = old_data.label;

			break;

		case did.clear:
			new_log.action = "clear";

			break;

		case did.shut:
			new_log.action = "shut";

			new_log.list = old_data.type;
			new_log.item = old_data.label;

			break;

		case did.restart:
			new_log.action = "restart";

			new_log.list = old_data.type;
			new_log.item = old_data.label;

			break;

		default:
			new_log.text = "欢迎使用TodoTodo！";
			break;
	}

	data.unshift(new_log);
	file.writeJSON(file.getJSON("log", true), data);
}