/* 模块调用 */
import * as vscode from "vscode";
import { extension, list } from "./extension_manage";

/* 激活扩展 */
export function activate(context: vscode.ExtensionContext) {
	// 使用控制台来输出诊断信息（console.log）和错误（console.error）。
	// 这行代码将在你的扩展被激活时执行，且只执行一次。
	console.log("扩展 \"TodoTodo\" 已激活！");

	// 初始化扩展
	extension.initialize(context);

	// 设置事项检测
	list.getRecentItem();
	setInterval(() => list.getRecentItem(), 24 * 60 * 60 * 1000);
	setInterval(() => list.shutOverdueItem(), 1000);
}

/* 停用扩展 */
export function deactivate() {
	extension.terminate();

	console.log("扩展 \"TodoTodo\" 已关闭！");
}
