/* 模块调用 */
import * as vscode from 'vscode';
import { command_manager } from './command_manage';

/* 激活扩展 */
export function activate(context: vscode.ExtensionContext) {
	// 使用控制台来输出诊断信息（console.log）和错误（console.error）。
	// 这行代码将在你的扩展被激活时执行，且只执行一次。
	console.log("Extension \"TodoTodo\" is now active.");

	// 获取设置参数
	let configuration = vscode.workspace.getConfiguration("todotodo");
	let remindDeleteItem = configuration.delete.item.remind;
	let remindDeleteList = configuration.delete.list.remind;
	let deleteListMethod = configuration.delete.list.method;
	let showEmptyList = configuration.show.emptyList;

	vscode.workspace.onDidChangeConfiguration(() => {
		console.log("change");
		configuration = vscode.workspace.getConfiguration("todotodo");
		remindDeleteItem = configuration.delete.item.remind;
		remindDeleteList = configuration.delete.list.remind;
		deleteListMethod = configuration.delete.list.method;
		showEmptyList = configuration.show.emptyList;

		command.Refresh(showEmptyList);
	})

	// 创建命令管理器
	let command: command_manager = new command_manager();
	extra_command = command;

	// 检测事项
	command.Refresh(showEmptyList);
	setInterval(() => command.GetRecentItem(), 24 * 60 * 60 * 1000);
	setInterval(() => command.ShutOverdue(), 1000);

	// 注册page命令
	context.subscriptions.push(vscode.commands.registerCommand("page.show", () => command.ShowPage()));
	context.subscriptions.push(vscode.commands.registerCommand("page.add", () => command.Add()));
	context.subscriptions.push(vscode.commands.registerCommand("page.edit", (item) => command.Edit(item)));

	// 注册list命令
	context.subscriptions.push(vscode.commands.registerCommand("list.delete", (item) => command.DeleteList(item, remindDeleteList, deleteListMethod)));

	// 注册todo_tree命令
	context.subscriptions.push(vscode.commands.registerCommand("todo.refresh", () => command.Refresh(showEmptyList)));					// 作用于全局刷新
	context.subscriptions.push(vscode.commands.registerCommand("todo.accomplish", (item) => command.Accomplish(item)));
	context.subscriptions.push(vscode.commands.registerCommand("todo.fail", (item) => command.Shut(item)));
	context.subscriptions.push(vscode.commands.registerCommand("todo.delete", (item) => command.Delete(item, remindDeleteItem)));

	// 注册done_tree命令
	context.subscriptions.push(vscode.commands.registerCommand("done.clear", () => command.Clear()));
	context.subscriptions.push(vscode.commands.registerCommand("done.redo", (item) => command.Redo(item)));

	// 注册fail_tree命令
	context.subscriptions.push(vscode.commands.registerCommand("fail.restart", (item) => command.Restart(item)));
	context.subscriptions.push(vscode.commands.registerCommand("fail.restart_all", () => command.RestartAll()));
}

/* 停用扩展 */
export function deactivate() {
}

/* 强制刷新 */
let extra_command: command_manager;
export function REFRESH() {
	extra_command.Refresh(extra_command.show_empty);
}