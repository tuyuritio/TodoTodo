/* 模块调用 */
import * as vscode from "vscode";
import * as file from "../operator/file_operator";

/* Page选项 */
class option implements vscode.WebviewOptions, vscode.WebviewPanelOptions {
	enableScripts = true;
	retainContextWhenHidden = true;
}

/* Page提供器 */
export class provider {
	panel: vscode.WebviewPanel;
	visible: boolean;

	/**
	 * 构造函数
	 */
	constructor() {
		this.panel = vscode.window.createWebviewPanel("todo_page", "Todo Page", vscode.ViewColumn.One, new option);
		this.panel.iconPath = vscode.Uri.file(file.getIconPath("icon_page"));

		let html = file.getWeb("HTML");
		html = html.replace("style_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("CSS", undefined, true))).toString());
		html = html.replace("script_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "script", true))).toString());
		html = html.replace("item_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "item", true))).toString());
		html = html.replace("window_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "window", true))).toString());
		html = html.replace("element_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "element", true))).toString());
		html = html.replace("event_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "event", true))).toString());
		html = html.replace(/close_path/g, this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("close"))).toString());
		html = html.replace("clear_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("clear-all"))).toString());
		html = html.replace("up_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("chevron-up"))).toString());
		html = html.replace("down_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("chevron-down"))).toString());
		html = html.replace(/csp_source/g, this.panel.webview.cspSource);

		this.panel.webview.html = html;
		this.initialize();

		this.panel.onDidDispose(() => { this.visible = false });

		this.visible = true;
	}

	/**
	 * 显示主页
	 */
	show(): void {
		this.panel.reveal();
	}

	/**
	 * 关闭主页
	 */
	close() {
		this.panel.dispose();
	}

	/**
	 * 发送主页命令
	 * @param command 命令文本
	 * @param data 通信数据
	 */
	postToPage(command: string, data?: any): void {
		let message = {
			command: command,
			data: data
		}

		this.panel.webview.postMessage(message);
	}

	/**
	 * 初始化主页
	 */
	initialize(): void {
		let data = file.getList();

		let types: { type: string, priority: number, quantity: number }[] = [];
		let list_maximum_priority = 0;
		let item_maximum_priority = 0;
		for (let index = 0; index < data.length; index++) {
			types.push({ type: data[index].type, priority: data[index].priority, quantity: data[index].list.length });

			// 计算清单最大优先层级
			if (data[index].priority > list_maximum_priority) {
				list_maximum_priority = data[index].priority;
			}

			// 计算事项最大优先层级
			for (let i = 0; i < data[index].list.length; i++) {
				let item_data = data[index].list[i];
				if (item_data.priority > item_maximum_priority) {
					item_maximum_priority = item_data.priority;
				}
			}
		}

		for (let index = 1; index < types.length; index++) {
			let pointer = index - 1;
			let list = types[index];

			while (pointer >= 0) {
				if (list.type != "默认清单") {					// 默认置顶
					if (types[pointer].priority >= list.priority) break;
				}

				types[pointer + 1] = types[pointer];
				pointer--;
			}

			types[pointer + 1] = list;
		}

		let page_data = {
			types: types,
			item_maximum_priority: item_maximum_priority,
			list_maximum_priority: list_maximum_priority
		}

		this.postToPage("initialize", page_data);
	}

	/**
	 * 显示清单列表
	 */
	showList() {
		this.postToPage("list");
	}

	/**
	 * 显示日志
	 */
	showLog() {
		this.postToPage("log", file.getJSON("log"));
	}

	/**
	 * 获取主页是否可见
	 * @returns 主页是否可见
	 */
	is_visible(): boolean {
		return this.visible;
	}
}

/**
 * 创建Page视图
 * @returns Page提供器
 */
export function create(): provider {
	return new provider();
}

/**
 * 清空日志文件
 */
export function clearLog() {
	file.writeJSON(file.getJSON("log", true), []);
}