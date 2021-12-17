/* 模块调用 */
import * as vscode from "vscode";
import * as date from "../general/date_operator";
import { data } from "../data/data_center";
import { getIconPath } from "../general/file_manage";
import { configuration } from "../general/configuration_center";

/* 清单元素 */
class list extends vscode.TreeItem {
	label: string;
	priority: number = 0;					// 清单排序

	/**
	 * 构造方法
	 * @param label 清单类别
	 */
	constructor(label: string, priority: number) {
		super(label, vscode.TreeItemCollapsibleState.Expanded);

		this.label = label;
		this.priority = priority;
		this.contextValue = "todo_list";
		this.iconPath = new vscode.ThemeIcon("list-unordered");
	}
}

/* 事项元素 */
class item extends vscode.TreeItem {
	label: string;
	type: string;				// 定位清单
	index: number;				// 定位事项
	cycle: string | undefined;	// 判断完成时是否需要追加
	time: string | undefined;	// 追加时需要计算的时间
	entry: any | undefined;

	/**
	 * 构造方法
	 * @param label 事项标题
	 * @param ItemId 事项元素视图ID
	 */
	constructor(ItemId: string, label: string, type: string, index: number, cycle: string, time: string, entry: any) {
		super(label);
		this.contextValue = ItemId;
		this.iconPath = new vscode.ThemeIcon("note");

		this.label = label;
		this.type = type;
		this.index = index;
		this.cycle = cycle;
		this.time = time;
		this.entry = entry;

		if (this.time) {
			this.tooltip = "截止时间: " + this.time + "\n";

			if (date.isRecent(this.time)) {
				this.iconPath = new vscode.ThemeIcon("bell", new vscode.ThemeColor("list.warningForeground"));
				this.description = this.time.substring(11, 16);
			} else {
				this.description = this.time.substring(0, 10);
			}
		} else {
			this.iconPath = new vscode.ThemeIcon("info");
		}

		if (this.entry) {
			this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		}

		if (this.contextValue == "gaze_item") {
			switch (configuration.new_configuration.list.todo.item.gaze.style) {
				case "flash":
					this.iconPath = vscode.Uri.file(getIconPath(this.iconPath.id, true));
					break;

				case "highlight":
					this.iconPath = new vscode.ThemeIcon(this.iconPath.id, new vscode.ThemeColor("list.highlightForeground"));
					break;

				case "disabled":
					this.iconPath = new vscode.ThemeIcon(this.iconPath.id);
					break;
			}
		}

		this.command = {
			title: "显示详情",
			command: "page.edit",
			arguments: [this, "todo"]
		};
	}
};

/* 条目元素 */
class entry extends vscode.TreeItem {
	root: item;
	type: string;

	constructor(root: item, type: string, content: string, is_on: boolean) {
		super(content);

		this.contextValue = "todo_entry";
		this.type = type;
		if (type.substring(0, 7) != "__entry") {
			this.label = type + " : " + content;
		}

		this.root = root;

		if (is_on) {
			this.iconPath = new vscode.ThemeIcon("symbol-parameter");
		} else {
			this.iconPath = new vscode.ThemeIcon("check");
		}

		this.command = {
			title: "状态变更",
			command: "todo.change",
			arguments: [this]
		};
	}
}

/* 元素提供器 */
export class provider implements vscode.TreeDataProvider<any> {
	ShowEmpty: boolean = false;

	/**
	 * getTreeItem
	 * @param element
	 * @returns TreeItem
	 */
	getTreeItem(element: any): vscode.TreeItem {
		return element;
	}

	/**
	 * getChildren
	 * @param element 
	 * @returns vscode.ProviderResult<item[]>
	 */
	getChildren(element?: any): vscode.ProviderResult<any[]> {
		let todo_data = data.todo;
		let items: any[] = [];
		let count: number = 0;

		if (element instanceof list) {					// 导入事项
			let list_data = todo_data[element.label];

			for (let index = 0; index < list_data.list.length; index++) {
				let item_data = list_data.list[index];
				let item_id = item_data.gaze ? "gaze_item" : "todo_item";
				items[index] = new item(item_id, item_data.label, list_data.type, index, item_data.cycle, item_data.time, item_data.entry);
			}
		} else if (element instanceof item) {			// 导入条目
			let entries = todo_data[element.type].list[element.index].entry;

			for (let property in entries) {
				items[count] = new entry(element, property, entries[property].content, entries[property].on);
				count++;
			}
		} else {										// 导入清单
			let count: number = 0;
			for (let list_type in todo_data) {
				if (todo_data[list_type].list.length != 0 || this.ShowEmpty) {
					items[count++] = new list(todo_data[list_type].type, todo_data[list_type].priority);
				}
			}

			// 清单排序
			for (let index = 1; index < items.length; index++) {
				let pointer = index - 1;
				let list = items[index];

				while (pointer >= 0) {
					if (items[pointer].priority >= list.priority) break;

					items[pointer + 1] = items[pointer];
					pointer--;
				}

				items[pointer + 1] = list;
			}
		}

		return items;
	}

	event_emitter = new vscode.EventEmitter<void>();
	onDidChangeTreeData = this.event_emitter.event;

	/**
	 * 刷新元素视图
	 */
	refresh(if_show_empty_list: boolean = false): void {
		this.ShowEmpty = if_show_empty_list;

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
		showCollapseAll: true,
		treeDataProvider: item_provider
	};

	vscode.window.createTreeView("todo_tree", option);

	return item_provider;
}
