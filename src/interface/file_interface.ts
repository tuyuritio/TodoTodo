/* 模块调用 */
import { code, date, path, transceiver } from "../tool";
import { data } from "../data_center";

export namespace file_interface {
	/**
	 * 初始化本地数据
	 */
	export function initialize(): void {
		side.read();
		page.read();
	}

	export namespace side {
		/**
		 * 检查文件路径
		 * @param data_path 文件路径
		 * @returns 文件路径 | undefined
		 */
		function checkPath(data_path: string): string | undefined {
			if (data_path.replace(" ", "") == "") {
				return path.link(__dirname, "..", "..", "TodoTodoData");
			} else if (!path.exist(data_path)) {
				transceiver.send("configuration.path_error");
				return undefined;
			} else {
				return data_path;
			}
		}

		/**
		 * 读取本地数据
		 */
		export function read(): void {
			let local_data: any = {};
			let data_path = checkPath(data.configuration.path);
			if (data_path) {
				for (let file_name of ["task", "todo", "done", "fail", "profile"]) {
					if (path.exist(path.link(data_path, file_name + ".json"))) {
						local_data[file_name] = path.readJSON(path.link(data_path, file_name + ".json"));
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

			{	// 兼容2.0.1
				for (let id in data.list.todo) {
					let item = data.list.todo[id];
					item.time = date.parse(item.time ? item.time : new Date());
					delete item.id;

					for (let id in item.entry) {
						if (item.entry[id].label.substring(0, 7) == "__entry") {
							item.entry[id].label = "";
						}
					}
				}

				for (let id in data.list.done) {
					let item = data.list.done[id];
					item.time = date.parse(item.time ? item.time : "2020/01/01-00:00");
					item.cycle = "once";
					delete item.id;

					if (item.entry) {
						for (let id in item.entry) {
							delete item.entry[id].id;
							if (!item.entry[id].label) {
								if (id.substring(0, 7) == "__entry") {
									item.entry[id].label = "";
								} else {
									item.entry[id].label = id;
								}
								item.entry[code.generate(8)] = data.copy(item.entry[id]);
								delete item.entry[id];
							}
						}
					} else {
						item.entry = {};
					}
				}

				for (let id in data.list.fail) {
					let item = data.list.fail[id];
					item.time = date.parse(item.time ? item.time : "2020/01/01-00:00");
					item.cycle = "once";
					delete item.id;

					if (item.entry) {
						for (let id in item.entry) {
							delete item.entry[id].id;
							if (!item.entry[id].label) {
								if (id.substring(0, 7) == "__entry") {
									item.entry[id].label = "";
								} else {
									item.entry[id].label = id;
								}
								item.entry[code.generate(8)] = data.copy(item.entry[id]);
								delete item.entry[id];

							}
						}
					} else {
						item.entry = {};
					}
				}
			}

			transceiver.send("view.page");
			transceiver.send("view.task");
			transceiver.send("view.todo");
			transceiver.send("view.done");
			transceiver.send("view.fail");
			transceiver.send("view.hint");
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
