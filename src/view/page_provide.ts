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

	constructor() {
		this.panel = vscode.window.createWebviewPanel("todo_page", "Todo Page", vscode.ViewColumn.One, new option);
		this.panel.iconPath = vscode.Uri.file(file.getIconPath("icon_page"));

		let html = file.getWeb("HTML");
		html = html.replace("style_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("CSS", true))).toString());
		html = html.replace("script_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", true))).toString());
		html = html.replace(/csp_source/g, this.panel.webview.cspSource);

		this.panel.webview.html = html;
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