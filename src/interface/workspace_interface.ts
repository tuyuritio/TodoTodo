/* 模块调用 */
import { workspace } from "vscode";
import { data } from "../data_center";
import { transceiver } from "../tool";

export namespace workspace_interface {
	let last_path: any;

	/**
	 * 获取工作区数据、建立工作区数据更新
	 */
	export function initialize() {
		load();
		update();
		last_path = data.copy(data.configuration.path);
	}

	/**
	 * 载入工作区数据
	 */
	function load() {
		let workspace_data = workspace.getConfiguration("todotodo");
		data.configuration.path = workspace_data.path;
		data.configuration.add_action = workspace_data.page.editor.add.action;
		data.configuration.empty_list = workspace_data.list.empty.show;
		data.configuration.list_remove_remind = workspace_data.list.remove.remind;
		data.configuration.shut_ahead = workspace_data.list.todo.shut.remind.ahead;
		data.configuration.item_delete_remind = workspace_data.list.delete.remind;
	}

	/**
	 * 更新工作区数据
	 */
	function update() {
		workspace.onDidChangeConfiguration(() => {
			load();
			if (last_path != data.configuration.path) {
				transceiver.send("configuration.reload");
				last_path = data.copy(data.configuration.path);
			}
			transceiver.send("refresh", "view");
		});
	}
}
