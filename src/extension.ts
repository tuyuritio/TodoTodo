/* 模块调用 */
import { ExtensionContext } from "vscode";
import { controller } from "./control_center";

/* 激活扩展 */
export function activate(context: ExtensionContext): void {
	controller.initialize(context);				// 全局通信
}

/* 停用扩展 */
export function deactivate(): void {
	controller.terminate();						// 保存数据
}
