/* 模块调用 */
import * as vscode from "vscode";
import { extension, list } from "./extension_manage";

/* 激活扩展 */
export function activate(context: vscode.ExtensionContext) {
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
}
