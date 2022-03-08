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
		const data_version: string = "3.4.0";		// 最新数据版本

		// 数据初始化
		Data.Profile = { data_version: data_version, list: {}, tree_type: true, empty_list: false };
		Data.Task.task = {};
		Data.List = { todo: {}, done: {}, fail: {} };

		const data_path: string | undefined = CheckPath(Data.Configuration.path);
		if (data_path) {
			let local_data: any = {};
			for (const data_type of ["task", "todo", "done", "fail", "profile"]) {
				const file_path = Path.Link(data_path, data_type + ".json");
				if (Path.Exist(file_path)) {
					local_data[data_type] = Path.ReadJSON(file_path);
				}
			}

			Compatible(local_data, data_version);

			if (local_data.profile) Data.Profile = local_data.profile;
			if (local_data.task) Data.Task.task = local_data.task;
			if (local_data.todo) Data.List.todo = local_data.todo;
			if (local_data.done) Data.List.done = local_data.done;
			if (local_data.fail) Data.List.fail = local_data.fail;
		}
	}

	/**
	 * 写入数据
	 */
	export function Write(): void {
		let written_data: any = {
			profile: Data.Profile,
			task: Data.Task.task,
			todo: Data.List.todo,
			done: Data.List.done,
			fail: Data.List.fail
		};

		if (CheckPath(Data.Configuration.path)) {
			for (const file_name in written_data) {
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

	/**
	 * 数据兼容性调整
	 * @param data 前版本数据
	 * @param data_version 现版本号
	 */
	function Compatible(data: any, data_version: string): void {
		if (data && data.profile.data_version != data_version) {
			// 数据版本更新
			data.profile.data_version = data_version;

			// 数据兼容语句
		}
	}
}
