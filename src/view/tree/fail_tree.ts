/* 模块调用 */
import * as vscode from "vscode";

/* 事项元素 */
class item extends vscode.TreeItem {
	constructor(id: string, label: string, time: string) {
		super(label);
		this.id = id;
		this.contextValue = "fail_item";
		this.tooltip = "失效时间: " + time + "\n";
		this.iconPath = new vscode.ThemeIcon("circle-slash");
		this.command = {
			title: "显示详情",
			command: "todotodo.list.edit_item",
			arguments: [this, "fail"]
		};
	}
};

/* 元素提供器 */
export class fail_provider implements vscode.TreeDataProvider<item> {
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
	 * @param fail_data 原始数据
	 */
	refresh(fail_data: any): void {
		this.data = fail_data;
		this.event_emitter.fire();
	}
};
