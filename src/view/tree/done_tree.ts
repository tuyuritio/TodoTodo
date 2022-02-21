/* 模块调用 */
import * as vscode from "vscode";

/* 事项元素 */
class item extends vscode.TreeItem {
	constructor(id: string, label: string, time: string) {
		super(label);
		this.id = id;
		this.contextValue = "done_item";
		this.tooltip = "完成时间: " + time + "\n";
		this.iconPath = new vscode.ThemeIcon("note");
		this.command = {
			title: "显示详情",
			command: "todotodo.list.edit_item",
			arguments: [this, "done"]
		};
	}
};

/* 元素提供器 */
export class done_provider implements vscode.TreeDataProvider<item> {
	private data: any;

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
		for (let id in this.data) {
			items.unshift(new item(id, this.data[id].label, this.data[id].time));
		}

		return items;
	}

	event_emitter = new vscode.EventEmitter<item | void>();
	onDidChangeTreeData = this.event_emitter.event;

	/**
	 * 刷新视图
	 * @param done_data 原始数据
	 */
	refresh(done_data: any): void {
		this.data = done_data;
		this.event_emitter.fire();
	}
};
