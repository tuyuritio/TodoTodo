/* 模块调用 */
import * as vscode from "vscode";
import { data } from "../data/data_center";

/* 事项元素 */
class item extends vscode.TreeItem {
	// 事项参数
	index: number = 0;
	type: string;

	constructor(label: string, type: string, index: number, time: string) {
		super(label);
		this.contextValue = "done_item";

		this.type = type;
		this.index = index;
		this.iconPath = new vscode.ThemeIcon("note");

		this.tooltip = "完成时间: " + time + "\n";

		this.command = {
			title: "显示详情",
			command: "page.edit",
			arguments: [this, "done"]
		};
	}
};

/* 元素提供器 */
export class provider implements vscode.TreeDataProvider<item> {
	/**
	 * getTreeItem
	 * @param element
	 * @returns TreeItem
	 */
	getTreeItem(element: item): vscode.TreeItem {
		return element;
	}

	/**
	 * getChildren
	 * @returns vscode.ProviderResult<item[]>
	 */
	getChildren(): vscode.ProviderResult<item[]> {
		let items: item[] = [];
		for (let index = 0; index < data.done.length; index++) {
			let done_data = data.copy(data.done[index]);
			items[index] = new item(done_data.label, done_data.type, index, done_data.time);
		}

		return items;
	}

	event_emitter = new vscode.EventEmitter<item | void>();
	onDidChangeTreeData = this.event_emitter.event;

	/**
	 * 刷新元素视图
	 */
	refresh(): void {
		this.event_emitter.fire();
	}
};

/**
 * 创建树状视图
 * @returns 元素提供器
 */
export function create(): provider {
	let item_provider: provider = new provider();

	let option: vscode.TreeViewOptions<item> = {
		showCollapseAll: false,
		treeDataProvider: item_provider
	};

	vscode.window.createTreeView("done_tree", option);

	return item_provider;
}
