/* 模块调用 */
import * as vscode from "vscode";
import * as file from "../operator/file_operator";
import * as date from "../operator/date_operator";

/* 事项元素 */
class item extends vscode.TreeItem {
	// 事项参数
	type: string;
	index: number = 0;
	priority: number = 0;
	cycle: string | undefined;
	time: string | undefined;
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
	constructor(label: string, ItemId: string, type: string, collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None) {
		super(label, collapsibleState);

		this.type = type;
		this.contextValue = ItemId;

		this.iconPath = new vscode.ThemeIcon("list-unordered");
	}

	/**
	 * 事项参数设置
	 * @param index 事项序号(清单内序号)
	 * @param priority 优先层级
	 * @param cycle 事项周期
	 * @param time 截止时间
	 * @param place 目标地点
	 */
	set(index: number, priority: number, cycle: string, time: string, place: string, mail: string, detail: string): void {
		this.index = index;
		this.priority = priority;

		this.cycle = cycle;
		this.time = time;
		this.place = place;
		this.mail = mail;
		this.detail = detail;

		this.iconPath = new vscode.ThemeIcon("note");

		let tips = "";
		if (this.time) {
			tips += "截止时间: " + this.time + "\n";

			if (date.isRecent(this.time)) {
				this.description = this.time.substr(11, 5);
				this.iconPath = new vscode.ThemeIcon("bell", new vscode.ThemeColor("list.warningForeground"));
			} else {
				this.description = this.time.substr(0, 10);
			}

			if (vscode.workspace.getConfiguration("todotodo").list.todo.item.time.show) {

			}
		} else {
			this.iconPath = new vscode.ThemeIcon("info");
		}

		if (this.place) {
			tips += "目标地点: " + this.place + "\n";
		}

		if (this.mail) {
			tips += "目标邮箱: " + this.mail + "\n";
		}

		if (this.detail) {
			tips += this.detail + "\n";
		}

		this.tooltip = tips;

		if (this.contextValue == "gaze_item") {
			this.iconPath = vscode.Uri.file(file.getIconPath(this.iconPath.id, true));
		}
	}
};

/* 元素提供器 */
export class provider implements vscode.TreeDataProvider<item> {
	ShowEmpty: boolean = false;

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
	 * @param element 
	 * @returns vscode.ProviderResult<item[]>
	 */
	getChildren(element?: item): vscode.ProviderResult<item[]> {
		let data = file.getList();

		let items: item[] = [];
		if (element) {
			for (let i = 0; i < data.length; i++) {
				if (element.type == data[i].type) {			// 进入相应类别清单
					for (let index = 0; index < data[i].list.length; index++) {
						let item_data = data[i].list[index];
						let item_id = item_data.gaze ? "gaze_item" : "todo_item";
						items[index] = new item(item_data.label, item_id, data[i].type);
						items[index].set(index, item_data.priority, item_data.cycle, item_data.time, item_data.place, item_data.mail, item_data.detail);
					}
				}
			}
		} else {
			let count: number = 0;
			for (let i = 0; i < data.length; i++) {
				if (data[i].list.length != 0 || this.ShowEmpty) {
					items[count++] = new item(data[i].type, "todo_list", data[i].type, vscode.TreeItemCollapsibleState.Expanded);
				}
			}

			// 普通事项置顶
			let index = 0;
			while (index < items.length) {
				if (items[index].type == "普通") break;
				index++;
			}
			let default_list = items[index];
			for (let i = index; i >= 1; i--) {
				items[i] = items[i - 1];
			}
			items[0] = default_list;
		}

		return items;
	}

	event_emitter = new vscode.EventEmitter<item | void>();
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
export function createItemTree(): provider {
	let item_provider: provider = new provider();

	let option: vscode.TreeViewOptions<item> = {
		showCollapseAll: true,
		treeDataProvider: item_provider
	};

	vscode.window.createTreeView("todo_tree", option);

	return item_provider;
}