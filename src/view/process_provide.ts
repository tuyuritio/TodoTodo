/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';

/* 进程提供器 */
class progress_provider {
	progress: vscode.StatusBarItem = vscode.window.createStatusBarItem("progress", vscode.StatusBarAlignment.Left, 20000);

	/**
	 * 显示进程视图
	 */
	show(): void {
		let left: number = this.count_todo();

		if (left == 0) {
			this.progress.text = "您已完成所有事项！";
		} else {
			this.progress.text = "剩余待办事项：" + this.count_todo() + "件";
		}

		this.progress.show();
	}

	/**
	 * 统计todo事项
	 * @returns todo事项总数
	 */
	count_todo(): number {
		let data = file.getList();
		let count: number = 0;

		for (let i = 0; i < data.length; i++) {
			count += data[i].list.length;
		}

		return count;
	}
}

/**
 * 创建进程视图
 * @returns 进程提供器
 */
export function CreateProgress(): progress_provider {
	return new progress_provider();
}