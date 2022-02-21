/* 模块调用 */
import * as vscode from "vscode";

export class progress_provide {
	private progress_item: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 20000);

	constructor() {
		this.progress_item.command = {
			command: "todotodo.todo.change_view",
			title: "切换视图"
		}
	}

	/**
	 * 刷新进度视图
	 */
	refresh(text: string): void {
		this.progress_item.text = text;
		this.progress_item.show();
	}
}
