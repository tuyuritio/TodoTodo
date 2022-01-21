/* 模块调用 */
import * as vscode from "vscode";
import * as file from "../general/file_manage";
import { data } from "../data/data_center";

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

		html = html.replace("style_path", this.toUri(file.getWeb("CSS", "style", true)));
		html = html.replace("item_editor_path", this.toUri(file.getWeb("CSS", "item_editor", true)));
		html = html.replace("list_editor_path", this.toUri(file.getWeb("CSS", "list_editor", true)));
		html = html.replace("log_panel_path", this.toUri(file.getWeb("CSS", "log_panel", true)));

		html = html.replace("script_path", this.toUri(file.getWeb("JS", "script", true)));
		html = html.replace("item_path", this.toUri(file.getWeb("JS", "item", true)));
		html = html.replace("window_path", this.toUri(file.getWeb("JS", "window", true)));
		html = html.replace("element_path", this.toUri(file.getWeb("JS", "element", true)));
		html = html.replace("event_path", this.toUri(file.getWeb("JS", "event", true)));
		html = html.replace("log_path", this.toUri(file.getWeb("JS", "log", true)));

		html = html.replace(/close_path/g, this.toUri(file.getIconPath("close")));
		html = html.replace("clear_path", this.toUri(file.getIconPath("clear-all")));
		html = html.replace("up_path", this.toUri(file.getIconPath("chevron-up")));
		html = html.replace("down_path", this.toUri(file.getIconPath("chevron-down")));
		html = html.replace(/csp_source/g, this.panel.webview.cspSource);

		this.panel.webview.html = html;
		this.initialize();

		this.panel.onDidDispose(() => { this.visible = false });

		this.visible = true;
	}

	/**
	 * 转换安全路径
	 * @param path 原始路径
	 * @returns 安全路径
	 */
	toUri(path: string): string {
		return this.panel.webview.asWebviewUri(vscode.Uri.file(path)).toString();
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
	close(): void {
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
		let lists: { type: string, priority: number, quantity: number }[] = [];
		let entry_types: string[] = [];
		let list_maximum_priority: number = 0;
		let item_maximum_priority: number = 0;
		for (let list in data.todo) {
			lists.push({ type: data.todo[list].type, priority: data.todo[list].priority, quantity: data.todo[list].list.length });

			// 计算清单最大优先层级
			if (data.todo[list].priority > list_maximum_priority) {
				list_maximum_priority = data.todo[list].priority;
			}

			for (let i = 0; i < data.todo[list].list.length; i++) {
				let item_data = data.todo[list].list[i];

				// 计算事项最大优先层级
				if (item_data.priority > item_maximum_priority) {
					item_maximum_priority = item_data.priority;
				}

				// 统计条目类型
				if (item_data.entry) {
					for (let entry in item_data.entry) {
						if (!entry_types.includes(entry) && entry.substring(0, 7) != "__entry") {
							entry_types.push(entry);
						}
					}
				}
			}
		}

		// 清单优先级排序
		for (let index = 1; index < lists.length; index++) {
			let pointer = index - 1;
			let list = lists[index];

			while (pointer >= 0) {
				if (list.type != "默认清单") {
					if (lists[pointer].type == "默认清单") break;					// 默认置顶
					if (lists[pointer].priority >= list.priority) break;
				}

				lists[pointer + 1] = lists[pointer];
				pointer--;
			}

			lists[pointer + 1] = list;
		}

		let page_data = {
			lists: lists,
			entry_types: entry_types,
			item_maximum_priority: item_maximum_priority,
			list_maximum_priority: list_maximum_priority
		}

		this.postToPage("initialize", page_data);
	}

	/**
	 * 显示清单列表
	 */
	showList(): void {
		this.postToPage("list");
	}

	/**
	 * 显示日志
	 */
	showLog(): void {
		this.postToPage("log", data.log);
	}

	/**
	 * 获取主页是否可见
	 * @returns 主页是否可见
	 */
	isVisible(): boolean {
		return this.visible;
	}

	/**
	 * 编辑事项 | 事项信息
	 * @param item 事项对象
	 * @param status 事项状态
	 */
	edit(item: any, status: string): void {
		let item_in_data;
		let item_data: any = {};
		if (status == "todo") {
			item_in_data = data.todo[item.type].list[item.index];
			item_data.type = item.type;
		} else if (status == "done") {
			item_in_data = data.done[item.index];
			item_data.type = item_in_data.type;
		} else if (status == "fail") {
			item_in_data = data.fail[item.index];
			item_data.type = item_in_data.type;
		}

		item_data.id = item.id;
		item_data.index = item.index;
		item_data.label = item_in_data.label;
		item_data.priority = item_in_data.priority;
		item_data.cycle = item_in_data.cycle;
		item_data.time = item_in_data.time;
		item_data.entry = item_in_data.entry;
		item_data.status = status;

		this.postToPage("edit", item_data);
	}

	/**
	 * 校验删除事项，与Page同步
	 * @param type 元素类型 - 可选值为 **"list"** 、 **"item"**
	 * @param item 校验元素
	 */
	synchronize(type: string, item: any): void {
		if (type == "item") {
			this.postToPage("synchronize", item.id);
		} else if (type == "list") {
			for (let index = 0; index < item.length; index++) {
				this.postToPage("synchronize", item[index].id);
			}
		}
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
export function clearLog(): void {
	data.log = [];
}
