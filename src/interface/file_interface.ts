/* 模块调用 */
import { path, transceiver } from "../tool";
import { data } from "../data_center";

import { code, date } from "../tool";									// 兼容向工具
let copy = (data: any) => { return JSON.parse(JSON.stringify(data)); };	// 兼容向工具

export namespace file_interface {
	/**
	 * 初始化本地数据
	 */
	export function initialize() {
		side.read();
		page.read();
	}

	export namespace side {
		let COMPATIBLE: boolean;		// 兼容1.0.3

		/**
		 * 检查文件路径
		 * @param data_path 文件路径
		 * @returns 文件路径 | undefined
		 */
		function checkPath(data_path: string): string | undefined {
			COMPATIBLE = false;

			if (data_path.replace(" ", "") == "") {
				return path.link(__dirname, "..", "..", "TodoTodoData");
			} else if (!path.exist(data_path)) {
				transceiver.send("configuration.path_error");
				return undefined;
			} else {
				if (path.exist(path.link(data_path, "TodoData"))) {	// 兼容1.0.3
					COMPATIBLE = true;

					path.removeFile(path.link(data_path, "log.json"));

					let data: any = [];
					let files: string[] = path.readDirectory(path.link(data_path, "TodoData"));
					for (let file_name of files) {
						let file_path = path.link(data_path, "TodoData", file_name);
						data.push(path.readJSON(file_path));
						path.removeFile(file_path);
					}

					path.removeDirectory(path.link(data_path, "TodoData"));

					let todo_data: any = {};
					for (let index = 0; index < data.length; index++) {
						todo_data[data[index].type] = data[index];
					}

					path.writeJSON(path.link(data_path, "todo.json"), todo_data);
				}

				return data_path;
			}
		}

		/**
		 * 读取本地数据
		 */
		export function read() {
			let local_data: any = {};
			let data_path = checkPath(data.configuration.path);
			if (data_path) {
				for (let file_name of ["task", "todo", "done", "fail", "profile"]) {
					if (path.exist(path.link(data_path, file_name + ".json"))) {
						local_data[file_name] = path.readJSON(path.link(data_path, file_name + ".json"));
					}
				}
			}

			if (COMPATIBLE) {						// 兼容1.0.3
				for (let file_name in local_data) {
					let novel_data: any = {};

					if (file_name == "todo") {
						local_data.profile = { tree_type: true, list_priority: {} };
						for (let type in local_data.todo) {
							local_data.profile.list_priority[type] = local_data.todo[type].priority;

							for (let index = 0; index < local_data.todo[type].list.length; index++) {
								let item = copy(local_data.todo[type].list[index]);

								if (!item.cycle) {
									if (item.time) {
										item.cycle = "once";
									} else {
										item.cycle = "secular";
									}
								}

								if (item.entry) {
									let entries: any = {};
									for (let label in item.entry) {
										entries[code.generate(8)] = {
											label: label.substring(0, 7) == "__entry" ? "__entry" : label,
											content: item.entry[label].content,
											done: item.entry[label].on
										}
									}

									item.entry = copy(entries);
								} else {
									item.entry = {};
								}

								delete item.id;
								item.type = type;
								item.gaze = false;

								novel_data[code.generate(8)] = item;
							}
						}
						local_data.todo = novel_data;
					}

					if (file_name == "done" || file_name == "fail") {
						for (let index = 0; index < local_data[file_name].length; index++) {
							let item = copy(local_data[file_name][index]);
							delete item.id;
							for (let id in item.entry) {
								let done = !copy(item.entry[id]).on;
								delete item.entry[id].on;
								item.entry[id].done = done;
							}

							novel_data[code.generate(8)] = item;
						}

						local_data[file_name] = novel_data;
					}
				}
			}

			if (local_data.profile) {
				data.profile.list_priority = local_data.profile.list_priority;
				data.profile.tree_type = local_data.profile.tree_type;
			} else {
				data.profile.list_priority = {};
				data.profile.tree_type = true;
			}

			if (local_data.task) {
				data.task.task = local_data.task;
			} else {
				data.task.task = {};
			}

			if (local_data.todo) {
				data.list.todo = local_data.todo;
			} else {
				data.list.todo = {};
			}

			if (local_data.done) {
				data.list.done = local_data.done;
			} else {
				data.list.done = {};
			}

			if (local_data.fail) {
				data.list.fail = local_data.fail;
			} else {
				data.list.fail = {};
			}
		}

		/**
		 * 写入数据
		 * @param data 原始数据
		 */
		export function write(): void {
			let written_data: any = {
				profile: {
					list_priority: data.profile.list_priority,
					tree_type: data.profile.tree_type
				},
				task: data.task.task,
				todo: data.list.todo,
				done: data.list.done,
				fail: data.list.fail
			};

			if (checkPath(data.configuration.path)) {
				for (let file_name in written_data) {
					path.writeJSON(path.link(data.configuration.path, file_name + ".json"), written_data[file_name]);
				}
			} else {
				transceiver.send("configuration.path_error");
			}
		}
	}

	export namespace page {
		/**
		 * 获取Page数据
		 */
		export function read(): any {
			let web_path = path.link(__dirname, "..", "..", "src", "view", "page");
			data.page.html = path.readFile(path.link(web_path, "index.html"));

			data.page.css = {};
			let css_files = path.readDirectory(path.link(web_path, "css"));
			for (let file_name of css_files) {
				data.page.css[file_name.replace(".", "_")] = path.link(web_path, "css", file_name);
			}

			data.page.js = {};
			let js_files = path.readDirectory(path.link(web_path, "js"));
			for (let file_name of js_files) {
				data.page.js[file_name.replace(".", "_")] = path.link(web_path, "js", file_name);
			}

			data.page.icon = path.link(__dirname, "..", "..", "resources", "icon", "icon_page.svg");
		}
	}
}
