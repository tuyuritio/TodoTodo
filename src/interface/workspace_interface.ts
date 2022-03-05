/* 模块调用 */
import { workspace } from "vscode";
import { transceiver } from "../tool";
import { data } from "../data_center";

export namespace workspace_interface {
	/**
	 * 载入工作区数据
	 */
	export function load(): void {
		let workspace_data = workspace.getConfiguration("todotodo");
		data.configuration.path = workspace_data.path;
		data.configuration.empty_list = workspace_data.list.empty.show;
		data.configuration.shut_ahead = workspace_data.list.todo.shut.remind.ahead;
		data.configuration.hint_position = workspace_data.hint.position;
	}

	/**
	 * 更新工作区数据
	 */
	export function update(): void {
		workspace.onDidChangeConfiguration(() => {
			load();
			transceiver.send("file.read");
		});
	}
}
