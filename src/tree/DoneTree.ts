/* 模块调用 */
import * as vscode from "vscode";
import { Time, Transceiver } from "../Tool";

export namespace DoneTree {
	let view: Tree;
	let tree_data: Item[];

	/**
	 * 建立视图
	 */
	export function Initialize(): void {
		view = new Tree();
		vscode.window.createTreeView("done_tree", { showCollapseAll: false, treeDataProvider: view });
		Transceiver.Send("view.done");
	}

	/**
	 * 解析数据并刷新视图
	 * @param data 原始数据
	 */
	export function ParseData(data: any): void {
		tree_data = [];
		for (let id in data) {
			let item_data = data[id];
			tree_data.unshift(new Item(id, item_data.label, Time.Textualize(item_data.time)));
		}

		view.event_emitter.fire();
	}

	class Item extends vscode.TreeItem {
		constructor(id: string, label: string, time: string) {
			super(label);
			this.id = id;
			this.contextValue = "done_item";
			this.tooltip = "完成时间: " + time;
			this.iconPath = new vscode.ThemeIcon("note");
		}
	};

	class Tree implements vscode.TreeDataProvider<Item> {
		// 刷新事件
		event_emitter = new vscode.EventEmitter<Item | void>();
		onDidChangeTreeData = this.event_emitter.event;

		/**
		 * 意义不明，没有不行
		 */
		getTreeItem(element: Item): vscode.TreeItem | Thenable<vscode.TreeItem> {
			return element;
		}

		/**
		 * 获取子元素
		 * @returns 子元素
		 */
		getChildren(): vscode.ProviderResult<Item[]> {
			return tree_data;
		}
	};
}
