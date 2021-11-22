/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';

/* Page选项 */
class option implements vscode.WebviewOptions, vscode.WebviewPanelOptions {
	enableScripts = true;
	retainContextWhenHidden = true;
}

/* Page提供器 */
class provider {
	panel: vscode.WebviewPanel;

	/**
	 * 构造函数
	 */
	constructor() {
		this.panel = vscode.window.createWebviewPanel("todo_page", "Todo Page", vscode.ViewColumn.One, new option);
		this.panel.iconPath = vscode.Uri.file(file.getIconPath("icon_page"));

		let html = file.getWeb("HTML");
		html = html.replace("style_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("CSS", true))).toString());
		html = html.replace("script_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", true))).toString());
		html = html.replace(/csp_source/g, this.panel.webview.cspSource);

		this.panel.webview.html = html;
		this.initializePage();
	}

	// 整合？
	postMessage(command: string, data: any) {
		let message = {
			command: command,
			data: data
		}

		this.panel.webview.postMessage(message);
	}

	initializePage() {
		let data = file.getList();

		let types: string[] = [];
		let maximum_priority = 0;
		for (let index = 0; index < data.length; index++) {
			types.push(data[index].type);

			for (let i = 0; i < data[index].list.length; i++) {
				let item_data = data[index].list[i];
				if (item_data.priority > maximum_priority) {
					maximum_priority = item_data.priority;
				}
			}
		}

		types.splice(types.indexOf("普通"), 1);

		let page_data = {
			types: types,
			maximum_priority: maximum_priority
		}

		this.postMessage("initialize", page_data);
	}
}

/**
 * 创建Page视图
 * @returns Page提供器
 */
export function createPage() {
	console.log("Page: Created.");

	return new provider();
}

