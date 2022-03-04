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

/* 输入测试 */

import { window, QuickPickItem } from "vscode";

function testInput() {
	let input = window.createInputBox();
	input.totalSteps = 3;
	input.step = 1;
	input.prompt = "一些文字";

	input.onDidAccept(() => {
		window.showInformationMessage(input.value);
		input.dispose();
	});

	input.show();
}

function testPick() {
	let pick = window.createQuickPick<item>();
	pick.items = [new item("a"), new item("b")];
	pick.onDidAccept(() => {
		window.showInformationMessage(pick.value);
	});
	pick.show();
}

class item implements QuickPickItem {
	label: string;
	description?: string | undefined;
	detail?: string | undefined;
	picked?: boolean | undefined;
	alwaysShow?: boolean | undefined;

	constructor(label: string) {
		this.label = label;
	}
}
