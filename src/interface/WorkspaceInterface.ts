/* 模块调用 */
import { workspace } from "vscode";
import { Transceiver } from "../Tool";
import { Data } from "../DataCenter";

export namespace WorkspaceInterface {
	/**
	 * 载入工作区数据
	 */
	export function Load(): void {
		let workspace_data = workspace.getConfiguration("todotodo");
		Data.Configuration.path = workspace_data.path;
		Data.Configuration.shut_ahead = workspace_data.list.todo.shut.remind.ahead;
	}

	/**
	 * 更新工作区数据
	 */
	export function Update(): void {
		workspace.onDidChangeConfiguration(() => {
			Load();
			Transceiver.Send("file.read");
		});
	}
}
