/* 模块调用 */
import * as vscode from 'vscode';
import { command_manager } from './command_manage';

/**
 * 立即执行一个函数后按间隔时间执行
 * @param Function 需要执行的函数
 * @param second 循环间隔的秒数
 */
function Circulate(Function: () => void, second: number) {
	Function();
	setInterval(() => Function(), second * 1000);
}

/* 激活扩展 */
export function activate(context: vscode.ExtensionContext) {
	// 使用控制台来输出诊断信息（console.log）和错误（console.error）。
	// 这行代码将在你的扩展被激活时执行，且只执行一次。
	console.log("Extension \"TodoTodo\" is now active.");

	// 创建命令管理器
	let command: command_manager = new command_manager();

	// 检测事项
	command.Refresh();
	setInterval(() => command.GetRecentItem(), 24 * 60 * 60 * 1000);
	setInterval(() => command.ShutOverdue(), 1000);

	// 注册page命令
	context.subscriptions.push(vscode.commands.registerCommand("page.show", () => command.ShowPage()));

	// 注册list命令
	context.subscriptions.push(vscode.commands.registerCommand("list.delete", (item) => command.DeleteList(item)));

	// 注册todo_tree命令
	context.subscriptions.push(vscode.commands.registerCommand("todo.refresh", () => command.Refresh()));					// 作用于全局刷新
	context.subscriptions.push(vscode.commands.registerCommand("todo.add", () => command.Add()));
	context.subscriptions.push(vscode.commands.registerCommand("todo.edit", (item) => command.Edit(item)));
	context.subscriptions.push(vscode.commands.registerCommand("todo.accomplish", (item) => command.Accomplish(item)));
	context.subscriptions.push(vscode.commands.registerCommand("todo.fail", (item) => command.Shut(item)));
	context.subscriptions.push(vscode.commands.registerCommand("todo.delete", (item) => command.Delete(item)));

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