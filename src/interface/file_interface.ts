/* 模块调用 */
import { code, command, date, message, path } from "../tool";
import { data } from "../data_center";

export namespace file_interface {
	/**
	 * 检查文件路径
	 * @param data_path 文件路径
	 * @returns 文件路径 | undefined
	 */
	function checkPath(data_path: string): string | undefined {
		if (data_path.replace(" ", "") == "") {
			return path.link(__dirname, "..", "..", "TodoTodoData");
		} else if (!path.exist(data_path)) {
			setPath();
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

		{	// 兼容2.1.0
			if (local_data.profile) {
				if (local_data.profile.list_priority) {
					local_data.profile.list = { __untitled: { label: "暂存清单", priority: -1 } };

					for (let label in local_data.profile.list_priority) {
						local_data.profile.list[code.generate(8)] = {
							label: label,
							priority: local_data.profile.list_priority[label]
						}
					}

					delete local_data.profile.list_priority;

					for (let list in local_data.profile.list) {
						for (let id in local_data.todo) {
							if (local_data.todo[id].type == local_data.profile.list[list].label) {
								local_data.todo[id].type = list;
							}
						}
					}

					for (let list in local_data.profile.list) {
						for (let id in local_data.done) {
							if (local_data.done[id].type == local_data.profile.list[list].label) {
								local_data.done[id].type = list;
							}
						}
					}

					for (let list in local_data.profile.list) {
						for (let id in local_data.fail) {
							if (local_data.fail[id].type == local_data.profile.list[list].label) {
								local_data.fail[id].type = list;
							}
						}
					}
				}

				if (!local_data.profile.empty_list) {
					local_data.profile.empty_list = false;
				}
			}

			for (let id in local_data.todo) {
				let item = local_data.todo[id];
				item.time = date.parse(item.time ? item.time : new Date());
				delete item.id;

				for (let id in item.entry) {
					if (item.entry[id].label.substring(0, 7) == "__entry") {
						item.entry[id].label = "";
					}
				}
			}

			for (let id in local_data.done) {
				let item = local_data.done[id];
				item.time = date.parse(item.time ? item.time : "2020/01/01-00:00");
				delete item.cycle;
				delete item.gaze;
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

			for (let id in local_data.fail) {
				let item = local_data.fail[id];
				item.time = date.parse(item.time ? item.time : "2020/01/01-00:00");
				delete item.cycle;
				delete item.gaze;
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

		if (local_data.profile) {
			data.profile.list = local_data.profile.list;
			data.profile.tree_type = local_data.profile.tree_type;
			data.profile.empty_list = local_data.profile.empty_list;
		} else {
			data.profile.list = {};
			data.profile.tree_type = true;
			data.profile.empty_list = false;
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
	 */
	export function write(): void {
		let written_data: any = {
			profile: {
				list: data.profile.list,
				tree_type: data.profile.tree_type,
				empty_list: data.profile.empty_list
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
			setPath();
		}
	}

	/**
	 * 设置路径
	 */
	async function setPath(): Promise<void> {
		if (await message.show("error", "自定义文件目录路径无效，请检查！", "前往设置") == "前往设置") {
			command.execute("workbench.action.openSettings", "todotodo.path");
		}
	}
}
