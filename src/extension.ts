/* 模块调用 */
import { ExtensionContext } from "vscode";
import { Controller } from "./ControlCenter";

/* 激活扩展 */
export function activate(context: ExtensionContext): void {
	Controller.Initialize(context);		// 全局通信
}

/* 停用扩展 */
export function deactivate(): void {
	Controller.Terminate();				// 保存数据
}
