/* 模块调用 */
import * as vscode from "vscode";
import { getPackage, setPackage } from "./file_manage";

/**
 * 设置空Todo清单视图提示文本
 */
export function setEmptyText(): void {
	let configuration = vscode.workspace.getConfiguration("todotodo");
	let todo_text = configuration.list.todo.empty.text;
	let done_text = configuration.list.done.empty.text;
	let fail_text = configuration.list.fail.empty.text;

	let data = getPackage();
	data.contributes.viewsWelcome[0].contents = todo_text + "\n[$(add) 新增待办事项](command:page.add)";
	data.contributes.viewsWelcome[1].contents = done_text;
	data.contributes.viewsWelcome[2].contents = fail_text;
	setPackage(data);
}