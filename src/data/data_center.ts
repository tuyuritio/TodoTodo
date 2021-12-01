/* 模块调用 */
import * as file from "../general/file_manage";
import * as log from "../general/log_manage";
import { configuration } from "../general/configuration_center";

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

		if (is_start && configuration.first_configuration.page.log.start.remind) {
			is_start = false;
			log.add();
		}
	}

	static write() {
		file.writeData(data.todo, data.done, data.fail, data.log);
	}

	static copy(object: any) {
		return JSON.parse(JSON.stringify(object));
	}
}
