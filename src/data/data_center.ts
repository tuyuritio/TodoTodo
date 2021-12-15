/* 模块调用 */
import * as file from "../general/file_manage";

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
	}

	static write() {
		file.writeData(data.todo, data.done, data.fail, data.log);
	}

	static copy(object: any) {
		return JSON.parse(JSON.stringify(object));
	}
}
