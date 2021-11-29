/* 模块调用 */
import * as vscode from "vscode";
import * as file from "../operator/file_operator";
import { data } from "../operator/data_center";
import { configurations } from "../command_manage";

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
		html = html.replace("script_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "script", true))).toString());
		html = html.replace("item_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "item", true))).toString());
		html = html.replace("window_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "window", true))).toString());
		html = html.replace("element_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "element", true))).toString());
		html = html.replace("event_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "event", true))).toString());
		html = html.replace("log_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", "log", true))).toString());
		html = html.replace(/close_path/g, this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("close"))).toString());
		html = html.replace("clear_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("clear-all"))).toString());
		html = html.replace("up_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("chevron-up"))).toString());
		html = html.replace("down_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("chevron-down"))).toString());
		html = html.replace(/csp_source/g, this.panel.webview.cspSource);

		if(configurations.new_configuration.page.log.color){
			html = html.replace("style_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("CSS", "style", true))).toString());
		}else{
			html = html.replace("style_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("CSS", "style_colorless", true))).toString());
		}

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
		let todo_data = data.getTodo();

		let types: { type: string, priority: number, quantity: number }[] = [];
		let list_maximum_priority = 0;
		let item_maximum_priority = 0;
		for (let list in todo_data) {
			types.push({ type: todo_data[list].type, priority: todo_data[list].priority, quantity: todo_data[list].list.length });

			// 计算清单最大优先层级
			if (todo_data[list].priority > list_maximum_priority) {
				list_maximum_priority = todo_data[list].priority;
			}

			// 计算事项最大优先层级
			for (let i = 0; i < todo_data[list].list.length; i++) {
				let item_data = todo_data[list].list[i];
				if (item_data.priority > item_maximum_priority) {
					item_maximum_priority = item_data.priority;
				}
			}
		}
		for (let index = 0; index < todo_data.length; index++) {
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
		this.postToPage("log", data.getLog());
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
 * 清空日志
 */
export function clearLog() {
	data.setLog([]);
}