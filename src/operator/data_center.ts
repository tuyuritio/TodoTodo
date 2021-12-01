/* 模块调用 */
import * as file from "./file_operator";
import * as log from "../log_set";
import { configurations } from "../command_manage";

/* 全局变量 */
let is_start = true;

/* 数据中心 */
export class data {
	static todo: any = {};
	static done: any = [];
	static fail: any = [];
	static recent: any = [];
	static log: any = [];

	constructor() {
		file.checkPath();

		let todo_data = file.readJSON("todo");
		for (let index = 0; index < todo_data.length; index++) {
			data.todo[todo_data[index].type] = todo_data[index];
		}

		data.done = file.readJSON("done");
		data.fail = file.readJSON("fail");
		data.log = file.readJSON("log");

		if (is_start && configurations.first_configuration.page.log.start.remind) {
			is_start = false;
			log.add();
		}
	}

	static write() {
		file.writeData(data.todo, data.done, data.fail, data.log);
	}

	static createList(list: string) {
		log.add(undefined, { type: list }, log.did.add);

		return data.todo[list] = {
			type: list,
			priority: 0,
			list: []
		};
	}

	static copy(object: any) {
		return JSON.parse(JSON.stringify(object));
	}
}