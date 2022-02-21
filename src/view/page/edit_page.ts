/* 模块调用 */
import * as vscode from "vscode";
import { transceiver } from "../../tool";

/* 主页提供器 */
export class page_provider {
	panel?: vscode.WebviewPanel;
	visible: boolean;
	html: string;
	icon: string;

	constructor() {
		this.visible = false;
		this.html = "";
		this.icon = "";
	}

	/**
	 * 解析基本数据并显示主页
	 * @param page_data 主页数据
	 * @param task_data Task数据
	 * @param todo_data Todo数据
	 * @param list_priority 清单优先级
	 * @param add_action 新建行为
	 */
	show(page_data: any, task_data: any, todo_data: any, list_priority: any, add_action: string): void {
		if (this.visible && this.panel) {
			this.panel.reveal();
		} else {
			this.icon = page_data.icon;
			this.html = page_data.html;

			for (let file_name in page_data.css) {
				this.html = this.html.replace(file_name, this.security("path", page_data.css[file_name]));
			}

			for (let file_name in page_data.js) {
				this.html = this.html.replace(file_name, this.security("path", page_data.js[file_name]));
			}

			this.html = this.html.replace(/csp_source/g, this.security("policy"));

			this.panel = vscode.window.createWebviewPanel("todo_page", "Todo Page", vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true });
			this.panel.iconPath = vscode.Uri.file(this.icon);
			this.panel.webview.html = this.html;
			this.panel.webview.onDidReceiveMessage((message) => transceiver.send(message.command, message.data));
			this.panel.onDidDispose(() => this.visible = false);
			this.visible = true;
		}

		this.postToPage("refresh", this.parseData(task_data, todo_data, list_priority, add_action));
	}

	/**
	 * 获取安全资源
	 * @param data 原始资源
	 * @returns 安全资源
	 */
	security(type: "path" | "policy", data?: any) {
		let panel_tool = vscode.window.createWebviewPanel("", "", vscode.ViewColumn.One);

		switch (type) {
			case "path":
				data = panel_tool.webview.asWebviewUri(vscode.Uri.file(data)).toString();
				break;

			case "policy":
				data = panel_tool.webview.cspSource;
				break;
		}

		panel_tool.dispose();
		return data;
	}

	/**
	 * 发送主页命令
	 * @param command 命令文本
	 * @param data 通信数据
	 */
	postToPage(command: string, data?: any): void {
		this.panel?.webview.postMessage({ command: command, data: data });
	}

	/**
	 * 准备选项数据
	 * @param task_data Task数据
	 * @param todo_data Todo数据
	 * @param list_priority 清单优先级
	 * @param add_action 新建行为
	 */
	parseData(task_data: any, todo_data: any, list_priority: any, add_action: string) {
		let lists: any = {};
		let task_priority: number = 0;
		let item_priority: number = 0;
		let type_priority: number = 0;

		for (let id in task_data) {
			if (task_data[id].priority > task_priority) task_priority = task_data[id].priority;
		}

		for (let list in list_priority) {
			lists[list] = {
				quantity: 0,
				priority: list_priority[list]
			};
			if (list_priority[list] > type_priority) type_priority = list_priority[list];
		}

		for (let id in todo_data) {
			lists[todo_data[id].type].quantity++;
			if (todo_data[id].priority > item_priority) item_priority = todo_data[id].priority;
		}

		let list_data: any[] = [];
		for (let list in lists) {
			let index: number = list_data.length;
			while (index > 0 && list_data[index - 1].priority < lists[list].priority) {
				list_data[index] = list_data[index - 1];
				index--;
			}
			list_data[index] = { label: list, quantity: lists[list].quantity, priority: lists[list].priority };
		}

		let data = {
			lists: list_data,
			task_priority: task_priority,
			item_priority: item_priority,
			list_priority: type_priority,
			add_action: add_action,
		}

		return data;
	}
}
