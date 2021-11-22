/* 模块调用 */
import * as vscode from 'vscode';
import * as file from '../operator/file_operator';
import * as date from '../operator/date_operator';

/* 事项元素 */
class item extends vscode.TreeItem {
	// 事项参数
	type: string;
	index: number = 0;
	status: string | undefined;
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
		this.tooltip = undefined;

		this.iconPath = new vscode.ThemeIcon("list-unordered");
	}

	/**
	 * 事项参数设置
	 * @param index 事项序号(清单内序号)
	 * @param status 事项状态
	 * @param priority 事项优先级
	 * @param cycle 事项周期
	 * @param time 事项截止时间
	 * @param place 事项目标地点
	 */
	set(index: number, status: string, priority: number, cycle: string, time: string, place: string, mail: string, detail: string): void {
		this.index = index;
		this.status = status;
		this.priority = priority;

		this.cycle = cycle;
		this.time = time;
		this.place = place;
		this.mail = mail;
		this.detail = detail;

		this.iconPath = new vscode.ThemeIcon("note");

		if (this.status == "todo") {
			let tips = "";

			if (this.time) {
				tips += "截止时间: " + this.time + "\n";

				if (date.isRecent(this.time)) {
					this.iconPath = new vscode.ThemeIcon("bell", new vscode.ThemeColor("list.warningForeground"));
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

			if(this.time){
				if (date.isRecent(this.time)) {
					this.description = this.time.substr(11, 5);
				} else {
					this.description = this.time.substr(0, 10);
				}
			}
		}
	}
};

/* 元素提供器 */
class provider implements vscode.TreeDataProvider<item> {
	ViewId: string;
	ItemId: string;

	/**
	 * 构造方法
	 * @param ViewId 树状视图ID
	 * @param ItemId 事项元素视图ID
	 */
	constructor(ViewId: string, ItemId: string) {
		this.ViewId = ViewId;
		this.ItemId = ItemId;
	}

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

		let items: item[] = []
		let count: number = 0;
		if (element) {
			for (let i = 0; i < data.length; i++) {
				if (element.type == data[i].type) {
					for (let index = 0; index < data[i].list.length; index++) {
						let item_data = data[i].list[index];
						if (item_data.status == this.ItemId.substr(0, 4)) {
							items[count] = new item(item_data.label, this.ItemId, data[i].type);
							items[count].set(index, item_data.status, item_data.priority, item_data.cycle, item_data.time, item_data.place, item_data.mail, item_data.detail);

							count++;
						}
					}
				}
			}
		} else {
			for (let i = 0; i < data.length; i++) {
				let count_todo: number = 0;
				for (let index = 0; index < data[i].list.length; index++) {
					if (this.ViewId == "todo_tree") {
						if (data[i].list[index].status == "todo") {
							count_todo++;
						}
					} else {
						let item_data = data[i].list[index];
						if (item_data.status == this.ItemId.substr(0, 4)) {
							items[count] = new item(item_data.label, this.ItemId, data[i].type);
							items[count].set(index, item_data.status, item_data.priority, item_data.cycle, item_data.time, item_data.place, item_data.mail, item_data.detail);

							count++;
						}
					}
				}

				if (this.ViewId == "todo_tree" && count_todo != 0) {
					items[count++] = new item(data[i].type, "todo_list", data[i].type, vscode.TreeItemCollapsibleState.Expanded);
				}
			}

			// 普通事项置顶
			if (this.ViewId == "todo_tree") {
				for (let index = 0; index < items.length; index++) {
					let temporary_list = items[index];
					if (temporary_list.type == "普通") {
						items[index] = items[0];
						items[0] = temporary_list;
					}
				}
			}
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

		console.log(this.ViewId + ": Refreshed.");
	}
};

/**
 * 创建树状视图
 * @param ViewId 树状视图ID
 * @param ItemId 事项元素视图ID
 * @returns 元素提供器
 */
export function createItemTree(ViewId: string, ItemId: string): provider {
	let item_provider: provider = new provider(ViewId, ItemId);

	let option: vscode.TreeViewOptions<item> = {
		showCollapseAll: false,
		treeDataProvider: item_provider
	};

	if (ViewId == "todo_tree") {
		option.showCollapseAll = true;
	}

	vscode.window.createTreeView(ViewId, option);

	console.log(ViewId + ": Created.");

	return item_provider;
}