/* 模块调用 */
import * as vscode from "vscode";
import * as file from "../operator/file_operator";

/* 事项元素 */
class item extends vscode.TreeItem {
	// 事项参数
	type: string;
	index: number = 0;
	priority: number = 0;
	place: string | undefined;
	mail: string | undefined;
	detail: string | undefined;

	/**
	 * 构造方法
	 * @param label 事项标题
	 * @param ItemId 事项元素视图ID
	 * @param type 事项类别
	 * @param collapsibleState 折叠状态 - **默认：** `非折叠`
	 */
	constructor(label: string, type: string, collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None) {
		super(label, collapsibleState);
		this.contextValue = "fail_item";

		this.type = type;
		this.iconPath = new vscode.ThemeIcon("circle-slash");
	}

	/**
	 * 事项参数设置
	 * @param index 事项序号(清单内序号)
	 * @param priority 优先层级
	 * @param time 截止时间
	 * @param place 目标地点
	 */
	set(index: number, priority: number, place: string, mail: string, detail: string): void {
		this.index = index;
		this.priority = priority;

		this.place = place;
		this.mail = mail;
		this.detail = detail;
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
		let data = file.getJSON("fail");

		let items: item[] = [];
		for (let index = 0; index < data.length; index++) {
			items[index] = new item(data[index].label, data[index].type);
			items[index].set(index, data[index].priority, data[index].place, data[index].mail, data[index].detail);
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
export function createItemTree(): provider {
	let item_provider: provider = new provider();

	let option: vscode.TreeViewOptions<item> = {
		showCollapseAll: false,
		treeDataProvider: item_provider
	};

	vscode.window.createTreeView("fail_tree", option);

	return item_provider;
}