/* 模块调用 */
import * as vscode from "vscode";
import { date } from "../../tool";

/* 清单元素 */
class list extends vscode.TreeItem {
	readonly label: string;
	readonly priority: number;			// 清单排序

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
	readonly id: string;
	readonly type: string;				// 定位entry时需要
	readonly time: string;				// 追加时需要计算的时间
	readonly priority: number;			// 更换视图时排序需要

	constructor(id: string, label: string, type: string, time: string, priority: number, entry: any, gaze: boolean) {
		super(label);
		this.id = id;
		this.type = type;
		this.time = time;
		this.priority = priority;

		if (this.time) {
			this.tooltip = "截止时间: " + this.time + "\n";

			if (date.isRecent(this.time)) {
				this.iconPath = new vscode.ThemeIcon("bell", new vscode.ThemeColor("list.warningForeground"));
				this.description = this.time.substring(11, 16);
			} else {
				this.iconPath = new vscode.ThemeIcon("note");
				this.description = this.time.substring(0, 10);
			}
		} else {
			this.iconPath = new vscode.ThemeIcon("info");
		}

		if (Object.keys(entry).length) {
			this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		}

		if (gaze) {
			this.iconPath = new vscode.ThemeIcon(this.iconPath.id, new vscode.ThemeColor("list.highlightForeground"));
			this.contextValue = "gaze_item";
		} else {
			this.contextValue = "todo_item";
		}

		this.command = {
			title: "显示详情",
			command: "todotodo.list.edit_item",
			arguments: [this, "todo"]
		};
	}
};

/* 条目元素 */
class entry extends vscode.TreeItem {
	readonly id: string;
	readonly root: item;

	constructor(root: item, id: string, label: string, content: string, is_done: boolean) {
		super(content);

		if (label != "__entry") {
			this.label = label + " : " + content;
		}

		this.id = id;
		this.root = root;
		this.contextValue = "todo_entry";

		if (is_done) {
			this.iconPath = new vscode.ThemeIcon("check");
		} else {
			this.iconPath = new vscode.ThemeIcon("symbol-parameter");
		}

		this.command = {
			title: "变更状态",
			command: "todotodo.todo.change",
			arguments: [this]
		};
	}
}

/* 元素提供器 */
export class todo_provider implements vscode.TreeDataProvider<any> {
	private empty_list: boolean = false;
	private todo_data: any;		// 原始数据
	private data: any;
	private profile: any;

	/**
	 * 解析数据
	 */
	parseData(): void {
		this.data = {};

		if (this.profile.tree_type) {
			for (let list_label in this.profile.list_priority) {
				this.data[list_label] = {
					self: new list(list_label, this.profile.list_priority[list_label]),
					item: {}
				};
			}
		}

		for (let id in this.todo_data) {
			let item_data = this.todo_data[id];
			let list_item = new item(id, item_data.label, item_data.type, item_data.time, item_data.priority, item_data.entry, item_data.gaze);

			let entries: entry[] = [];
			for (let id in item_data.entry) {
				let entry_data = item_data.entry[id];
				entries.push(new entry(list_item, id, entry_data.label, entry_data.content, entry_data.done));
			}

			if (this.profile.tree_type) {
				this.data[item_data.type].item[id] = {
					self: list_item,
					entry: entries
				}
			} else {
				this.data[id] = {
					self: list_item,
					entry: entries
				}
			}
		}

		if (this.profile.tree_type && !this.empty_list) {
			for (let list_label in this.profile.list_priority) {
				if (!Object.keys(this.data[list_label].item).length) delete this.data[list_label];
			}
		}
	}

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
		if (element instanceof list) {					// 导入事项
			return this.getItems(element);
		} else if (element instanceof item) {			// 导入条目
			return this.getEntries(element);
		} else {										// 导入清单
			return this.getLists();
		}
	}

	/**
	 * 生成list数组
	 * @returns list数组
	 */
	getLists(): list[] | item[] {
		let items: any[] = [];

		if (this.profile.tree_type) {
			// 清单排序
			for (let list in this.data) {
				let index = items.length;
				while (index > 0 && items[index - 1].priority < this.data[list].self.priority) {
					items[index] = items[index - 1];
					index--;
				}
				items[index] = this.data[list].self;
			}

			return items;
		} else {
			// 事项排序
			return this.sortItems(this.data);
		}
	}

	/**
	 * 生成Item数组
	 * @param element list元素
	 * @returns Item数组
	 */
	getItems(element: list): item[] {
		return this.sortItems(this.data[element.label].item);
	}

	/**
	 * 生成Entry数组
	 * @param element item元素
	 * @returns Enter数组
	 */
	getEntries(element: item) {
		if (this.profile.tree_type) {
			return this.data[element.type].item[element.id].entry;
		} else {
			return this.data[element.id].entry;
		}
	}

	/**
	 * 排序事项
	 * @param item_list 事项对象组
	 * @returns 事项数组
	 */
	sortItems(item_list: any): item[] {
		let items: item[] = [];
		for (let id in item_list) {
			let index: number = items.length;
			while (index > 0) {
				let pointer: number = index - 1;
				let item = item_list[id].self;

				if (item.time && !items[pointer].time) break;
				if (item.time || !items[pointer].time) {
					if (date.parse(item.time) > date.parse(items[pointer].time)) break;
					if (item.priority < items[pointer].priority) break;
				}

				items[index] = items[index - 1];
				index--;
			}
			items[index] = item_list[id].self;
		}

		return items;
	}

	// 刷新事件
	event_emitter = new vscode.EventEmitter<void>();
	onDidChangeTreeData = this.event_emitter.event;

	/**
	 * 刷新视图
	 * @param todo_data 原始数据
	 * @param profile 配置数据
	 * @param empty_list 显示空清单
	 */
	refresh(todo_data?: any, profile?: any, empty_list?: boolean): void {
		if (todo_data && profile && empty_list != undefined) {
			this.todo_data = todo_data;
			this.profile = profile;
			this.empty_list = empty_list;
		}
		this.parseData();

		this.event_emitter.fire();
	}
};
