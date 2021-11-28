/* 模块调用 */
import * as vscode from "vscode";
import { data } from "../operator/data_center";

/* 进度提供器 */
export class progress_provider {
	progress: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 20000);

	/**
	 * 显示进度视图
	 */
	show(): void {
		let left: number = this.count_todo();

		if (left == 0) {
			this.progress.text = "您已完成所有事项！";
		} else {
			this.progress.text = "剩余待办：" + this.count_todo() + "件";
		}

		this.progress.show();
	}

	/**
	 * 统计todo事项
	 * @returns todo事项总数
	 */
	count_todo(): number {
		let todo_data = data.getTodo();
		let count: number = 0;

		for (let list in todo_data) {
			count += todo_data[list].list.length;
		}

		return count;
	}
}

/**
 * 创建进度视图
 * @returns 进度提供器
 */
export function create(): progress_provider {
	return new progress_provider();
}