/* 模块调用 */
import * as file from "./file_operator";
import * as log from "../log_set";
import { configurations } from "../command_manage";

/* 全局变量 */
let is_start = true;

/* 数据中心 */
export class data {
	private static todo_data: any = {};
	private static done_data: any = [];
	private static fail_data: any = [];
	private static recent_data: any = [];
	private static log_data: any = [];

	constructor() {
		file.checkPath();

		let todo_data = file.readJSON("todo");
		for (let index = 0; index < todo_data.length; index++) {
			data.todo_data[todo_data[index].type] = todo_data[index];
		}

		data.done_data = file.readJSON("done");
		data.fail_data = file.readJSON("fail");
		data.log_data = file.readJSON("log");

		if (is_start && configurations.first_configuration.page.log.start.remind) {
			is_start = false;
			log.add();
		}
	}

	static write() {
		file.writeData(data.todo_data, data.done_data, data.fail_data, data.log_data);
	}

	static deleteList(list: string) {
		delete data.todo_data[list];
	}

	static getTodo(list?: string) {
		if (list) {
			if (!(list in data.todo_data)) {
				data.todo_data[list] = {
					type: list,
					priority: 0,
					list: []
				};

				log.add(undefined, { type: list }, log.did.add);
			}

			return data.todo_data[list];
		} else {
			return data.todo_data;
		}
	}

	static setTodo(list: string, list_data: any) {
		data.todo_data[list] = list_data;
	}

	static pushTodo(list: string, item_data: any) {
		data.todo_data[list].list.push(item_data);
	}

	static getDone() {
		return data.done_data;
	}

	static setDone(done_data: any) {
		data.done_data = done_data;
	}

	static unshiftDone(item_data: any) {
		data.done_data.unshift(item_data);
	}

	static getFail() {
		return data.fail_data;
	}

	static setFail(fail_data: any) {
		data.fail_data = fail_data;
	}

	static unshiftFail(item_data: any) {
		data.fail_data.unshift(item_data);
	}

	static getRecent() {
		return data.recent_data;
	}

	static setRecent(recent_data: any) {
		data.recent_data = recent_data;
	}

	static pushRecent(recent_item: any) {
		data.recent_data.push(recent_item);
	}

	static getLog() {
		return data.log_data;
	}

	static setLog(log_data: any) {
		data.log_data = log_data;
	}

	static pushLog(new_log: any) {
		data.log_data.push(new_log);
	}
}