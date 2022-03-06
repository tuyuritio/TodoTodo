/* 模块调用 */
import { Code, Command, Time, Message, Path } from "../Tool";
import { Data } from "../DataCenter";

export namespace FileInterface {
	/**
	 * 检查文件路径
	 * @param data_path 文件路径
	 * @returns 文件路径 | undefined
	 */
	function CheckPath(data_path: string): string | undefined {
		if (data_path.replace(" ", "") == "") {
			return Path.Link(__dirname, "..", "..", "TodoTodoData");
		} else if (!Path.Exist(data_path)) {
			SetPath();
			return undefined;
		} else {
			return data_path;
		}
	}

	/**
	 * 读取本地数据
	 */
	export function Read(): void {
		let local_data: any = {};
		let data_path = CheckPath(Data.Configuration.path);
		if (data_path) {
			for (let file_name of ["task", "todo", "done", "fail", "profile"]) {
				if (Path.Exist(Path.Link(data_path, file_name + ".json"))) {
					local_data[file_name] = Path.ReadJSON(Path.Link(data_path, file_name + ".json"));
				}
			}
		}

		{	// 兼容2.1.0
			if (local_data.profile) {
				if (local_data.profile.list_priority) {
					local_data.profile.list = { __untitled: { label: "暂存清单", priority: -1 } };

					for (let label in local_data.profile.list_priority) {
						local_data.profile.list[Code.Generate(8)] = {
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
				item.time = Time.Parse(item.time ? item.time : new Date());
				delete item.id;

				for (let id in item.entry) {
					if (item.entry[id].label.substring(0, 7) == "__entry") {
						item.entry[id].label = "";
					}
				}
			}

			for (let id in local_data.done) {
				let item = local_data.done[id];
				item.time = Time.Parse(item.time ? item.time : "2020/01/01-00:00");
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
							item.entry[Code.Generate(8)] = Data.Copy(item.entry[id]);
							delete item.entry[id];
						}
					}
				} else {
					item.entry = {};
				}
			}

			for (let id in local_data.fail) {
				let item = local_data.fail[id];
				item.time = Time.Parse(item.time ? item.time : "2020/01/01-00:00");
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
							item.entry[Code.Generate(8)] = Data.Copy(item.entry[id]);
							delete item.entry[id];

						}
					}
				} else {
					item.entry = {};
				}
			}
		}

		if (local_data.profile) {
			Data.Profile.list = local_data.profile.list;
			Data.Profile.tree_type = local_data.profile.tree_type;
			Data.Profile.empty_list = local_data.profile.empty_list;
		} else {
			Data.Profile.list = {};
			Data.Profile.tree_type = true;
			Data.Profile.empty_list = false;
		}

		if (local_data.task) {
			Data.Task.task = local_data.task;
		} else {
			Data.Task.task = {};
		}

		if (local_data.todo) {
			Data.List.todo = local_data.todo;
		} else {
			Data.List.todo = {};
		}

		if (local_data.done) {
			Data.List.done = local_data.done;
		} else {
			Data.List.done = {};
		}

		if (local_data.fail) {
			Data.List.fail = local_data.fail;
		} else {
			Data.List.fail = {};
		}
	}

	/**
	 * 写入数据
	 */
	export function Write(): void {
		let written_data: any = {
			profile: {
				list: Data.Profile.list,
				tree_type: Data.Profile.tree_type,
				empty_list: Data.Profile.empty_list
			},
			task: Data.Task.task,
			todo: Data.List.todo,
			done: Data.List.done,
			fail: Data.List.fail
		};

		if (CheckPath(Data.Configuration.path)) {
			for (let file_name in written_data) {
				Path.WriteJSON(Path.Link(Data.Configuration.path, file_name + ".json"), written_data[file_name]);
			}
		} else {
			SetPath();
		}
	}

	/**
	 * 设置路径
	 */
	async function SetPath(): Promise<void> {
		if (await Message.Show("error", "自定义文件目录路径无效，请检查！", "前往设置") == "前往设置") {
			Command.Execute("workbench.action.openSettings", "todotodo.path");
		}
	}
}
