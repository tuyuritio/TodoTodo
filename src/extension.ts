/* 模块调用 */
import * as vscode from "vscode";
import { extension, list } from "./extension_manage";

/* 激活扩展 */
export function activate(context: vscode.ExtensionContext): void {
	// 初始化扩展
	extension.initialize(context);
}

/* 停用扩展 */
export function deactivate(): void {
	extension.terminate();
}
