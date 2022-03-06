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
		let local_data: any = {};
		let data_path = CheckPath(Data.Configuration.path);
		if (data_path) {
			for (let file_name of ["task", "todo", "done", "fail", "profile"]) {
				if (Path.Exist(Path.Link(data_path, file_name + ".json"))) {
					local_data[file_name] = Path.ReadJSON(Path.Link(data_path, file_name + ".json"));
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
