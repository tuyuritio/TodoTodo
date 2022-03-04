/* 模块调用 */
import * as vscode from "vscode";
import { date } from "../../tool";

export namespace done_tree {
	let view: tree;
	let tree_data: item[];

	/**
	 * 建立视图
	 */
	export function initialize() {
		view = new tree();
		vscode.window.createTreeView("done_tree", { showCollapseAll: false, treeDataProvider: view });
	}

	/**
	 * 解析数据并刷新视图
	 * @param done_data 原始数据
	 */
	export function parseData(done_data: any) {
		tree_data = [];
		for (let id in done_data) {
			let item_data = done_data[id];
			tree_data.unshift(new item(id, item_data.label, date.textualize(item_data.time)));
		}

		view.event_emitter.fire();
	}

	class item extends vscode.TreeItem {
		constructor(id: string, label: string, time: string) {
			super(label);
			this.id = id;
			this.contextValue = "done_item";
			this.tooltip = "完成时间: " + time;
			this.iconPath = new vscode.ThemeIcon("note");
			this.command = {
				title: "显示详情",
				command: "todotodo.list.edit_item",
				arguments: [this, "done"]
			};
		}
	};

	class tree implements vscode.TreeDataProvider<item> {
		// 刷新事件
		event_emitter = new vscode.EventEmitter<item | void>();
		onDidChangeTreeData = this.event_emitter.event;

		/**
		 * 意义不明，没有不行
		 */
		getTreeItem(element: item): vscode.TreeItem | Thenable<vscode.TreeItem> {
			return element;
		}

		/**
		 * 获取子元素
		 * @returns 子元素
		 */
		getChildren(): vscode.ProviderResult<item[]> {
			return tree_data;
		}
	};
}