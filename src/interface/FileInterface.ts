/* 模块调用 */
import { Command, Message, Path } from "../Tool";
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
		const data_path: string | undefined = CheckPath(Data.Configuration.path);
		let local_data: any = {};
		if (data_path) {
			for (const data_type of ["task", "list", "todo", "done", "fail", "profile"]) {
				const file_path = Path.Link(data_path, data_type + ".json");
				if (Path.Exist(file_path)) {
					local_data[data_type] = Path.ReadJSON(file_path);
				}
			}

			Compatible(local_data, data_path);
		}

		Data.Profile = local_data.profile ? local_data.profile : { data_version: "__EMPTY__", tree_type: true, empty_list: false };
		Data.Task.task = local_data.task ? local_data.task : {};
		Data.List.type = local_data.list ? local_data.list : { __untitled: { "label": "暂存清单", "priority": -1 } };
		Data.List.todo = local_data.todo ? local_data.todo : {};
		Data.List.done = local_data.done ? local_data.done : {};
		Data.List.fail = local_data.fail ? local_data.fail : {};
	}

	/**
	 * 写入数据
	 */
	export function Write(): void {
		let written_data: any = {
			profile: Data.Profile,
			task: Data.Task.task,
			list: Data.List.type,
			todo: Data.List.todo,
			done: Data.List.done,
			fail: Data.List.fail
		};

		let data_path: string | undefined = CheckPath(Data.Configuration.path);

		if (data_path) {
			for (const file_name in written_data) {
				Path.WriteJSON(Path.Link(data_path, file_name + ".json"), written_data[file_name]);
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

	/**
	 * 数据兼容性调整
	 * @param data 前版本数据
	 * @param path 文件路径
	 */
	function Compatible(data: any, path: string): void {
		const data_version: string = "3.5.0";		// 最新数据版本

		if (!data.profile) data.profile = { data_version: data_version, tree_type: true, empty_list: false };

		if (data.profile.data_version != data_version) {
			// 数据版本更新
			data.profile.data_version = data_version;

			// 数据兼容语句
			for (let id in data.task) {
				let task = data.task[id];

				let period: string[] = [];
				period.push(task.start);
				
				if (task.duration == -1) {
					period[0] += "-1";
				} else {
					period[0] += "+" + task.duration;
				}
				
				for (let index = 0; index < task.history.length; index++) {
					period.push(task.history[index]);
				}
				
				delete task.history;
				delete task.start;
				delete task.duration;

				task.period = period;
			}
		}
	}
}
