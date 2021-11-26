/* 模块调用 */
import * as vscode from "vscode";
import * as command from "../command_manage";
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
		html = html.replace("style_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("CSS", true))).toString());
		html = html.replace("script_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("JS", true))).toString());
		html = html.replace("item_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getWeb("Item", true))).toString());
		html = html.replace(/close_path/g, this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("close"))).toString());
		html = html.replace("clear_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("clear-all"))).toString());
		html = html.replace("up_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("chevron-up"))).toString());
		html = html.replace("down_path", this.panel.webview.asWebviewUri(vscode.Uri.file(file.getIconPath("chevron-down"))).toString());
		html = html.replace(/csp_source/g, this.panel.webview.cspSource);

		this.panel.webview.html = html;
		this.initializePage();

		this.panel.webview.onDidReceiveMessage((message) => {
			switch (message.command) {
				case "warning":
					vscode.window.showWarningMessage(message.data);
					break;

				case "add":
					if (message.data.old_item.type != "") {
						deleteOld(message.data.old_item);
					}
					createNew(message.data.new_item);
					command.view.refresh();
					break;

				case "clearLog":
					file.clearLog();
					break;
			}
		})

		this.panel.onDidDispose(() => { this.visible = false });

		this.visible = true;
	}

	postToPage(command: string, data?: any): void {
		let message = {
			command: command,
			data: data
		}

		this.panel.webview.postMessage(message);
	}

	initializePage(): void {
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

		this.postToPage("initialize", page_data);
	}

	close() {
		this.panel.dispose();
	}

	showLog() {
		this.postToPage("log", file.getJSON("log"));
	}

	is_visible(): boolean {
		return this.visible;
	}
}

/**
 * 创建Page视图
 * @returns Page提供器
 */
export function createPage(): provider {
	return new provider();
}

/**
 * 删除原有事项
 * @param item 原有事项对象
 */
function deleteOld(item: any): void {
	let data = file.getList(item.type);
	data.list.splice(item.index, 1);
	file.writeList(item.type, data);
}

/**
 * 新建事项
 * @param item 事项对象
 */
function createNew(item: any): void {
	let data = file.getList(item.type);

	let cycle = item.cycle != "" ? item.cycle : undefined;
	let time = item.time != "" ? item.time : undefined;
	let place = item.place != "" ? item.place : undefined;
	let mail = item.mail != "" ? item.mail : undefined;
	let particulars = item.particulars != "" ? item.particulars : undefined;

	let item_data = {
		label: item.label,
		priority: item.priority,
		cycle: cycle,
		time: time,
		place: place,
		mail: mail,
		particulars: particulars
	};

	data.list.push(item_data);
	file.writeList(item.type, data);

	file.log("事项 \"" + item.label + "(" + item.type + ")\" 已编辑。");

	command.page.initialize();
}