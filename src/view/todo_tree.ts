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
	particulars: string | undefined;

	/**
	 * 构造方法
	 * @param label 事项标题
	 * @param ItemId 事项元素视图ID
	 * @param type 事项类别
	 * @param collapsibleState 折叠状态 - **默认：** `非折叠`
	 */
	constructor(label: string, ItemId: string, type: string, priority: number, collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None) {
		super(label, collapsibleState);

		this.type = type;
		this.priority = priority;
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
	set(index: number, cycle: string, time: string, place: string, mail: string, particulars: string): void {
		this.index = index;

		this.cycle = cycle;
		this.time = time;
		this.place = place;
		this.mail = mail;
		this.particulars = particulars;

		this.iconPath = new vscode.ThemeIcon("note");

		let tips = "";
		if (this.time) {
			tips += "截止时间: " + this.time + "\n";

			if (date.isRecent(this.time)) {
				this.iconPath = new vscode.ThemeIcon("bell", new vscode.ThemeColor("list.warningForeground"));
				if (vscode.workspace.getConfiguration("todotodo").list.todo.item.time.show) {
					this.description = this.time.substr(12, 5);
				}
			} else {
				if (vscode.workspace.getConfiguration("todotodo").list.todo.item.time.show) {
					this.description = this.time.substr(0, 10);
				}
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

		if (this.particulars) {
			tips += this.particulars + "\n";
		}

		this.tooltip = tips;

		if (this.contextValue == "gaze_item") {
			this.iconPath = vscode.Uri.file(file.getIconPath(this.iconPath.id, true));
		}

		this.command = {
			command: "page.particulars",
			title: "显示详情",
			arguments: [this, "todo"]
		};
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
						items[index] = new item(item_data.label, item_id, data[i].type, item_data.priority);
						items[index].set(index, item_data.cycle, item_data.time, item_data.place, item_data.mail, item_data.particulars);
					}
				}
			}
		} else {
			let count: number = 0;
			for (let index = 0; index < data.length; index++) {
				if (data[index].list.length != 0 || this.ShowEmpty) {
					items[count++] = new item(data[index].type, "todo_list", data[index].type, data[index].priority, vscode.TreeItemCollapsibleState.Expanded);
				}
			}

			for (let index = 1; index < items.length; index++) {
				let pointer = index - 1;
				let list = items[index];

				while (pointer >= 0) {
					if (list.priority != -1) {
						if (items[pointer].priority == -1) break;
						if (items[pointer].priority >= list.priority) break;
					}

					items[pointer + 1] = items[pointer];
					pointer--;
				}

				items[pointer + 1] = list;
			}
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