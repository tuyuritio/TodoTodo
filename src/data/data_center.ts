/* 模块调用 */
import * as file from "../general/file_manage";
import { profile } from "../general/profile_center";

/* 数据中心 */
export class data {
	static todo: any;
	static done: any;
	static fail: any;
	static recent: any;
	static log: any;

	/**
	 * 构造方法
	 */
	constructor() {
		file.checkPath();
		data.read();
	}

	/**
	 * 读取本地数据
	 */
	static read(): void {
		let todo_data = file.readJSON("todo");
		if (profile.list_tree) {
			data.todo = {};
			for (let index = 0; index < todo_data.length; index++) {
				data.todo[todo_data[index].type] = todo_data[index];
			}
		} else {
			data.todo = [];
			for (let index = 0; index < todo_data.length; index++) {
				for (let i = 0; i < todo_data[index].list.length; i++) {
					data.todo.push(todo_data[index].list[i]);
				}
			}
		}

		data.done = [];
		data.done = file.readJSON("done");

		data.fail = [];
		data.fail = file.readJSON("fail");

		data.log = [];
		data.log = file.readJSON("log");
	}

	/**
	 * 保存数据至本地
	 */
	static write(): void {
		file.writeData(data.todo, data.done, data.fail, data.log);
	}

	/**
	 * 复制数据对象
	 * @param object 被复制的数据对象
	 * @returns 数据对象的值
	 */
	static copy(object: any): any {
		return JSON.parse(JSON.stringify(object));
	}
}
