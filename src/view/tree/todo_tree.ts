/* 模块调用 */
import * as vscode from "vscode";
import { date } from "../../tool";

export namespace todo_tree {
	let view: tree;
	let tree_type: boolean;
	let tree_data: { list: list[], list_item: any, item_entry: any };

	/**
	 * 建立视图
	 */
	export function initialize() {
		view = new tree();
		vscode.window.createTreeView("todo_tree", { showCollapseAll: true, treeDataProvider: view });
	}

	/**
	 * 解析数据并刷新视图
	 * @param todo_data 原始数据
	 * @param profile 配置数据
	 * @param empty_list 显示空清单
	 */
	export function parseData(todo_data?: any, profile?: any, empty_list?: boolean) {
		if (todo_data != undefined && profile != undefined && empty_list != undefined) {
			tree_type = profile.tree_type;
			tree_data = { list: [], list_item: undefined, item_entry: undefined };

			// 生成清单事项框架
			if (tree_type) {
				tree_data.list_item = {};
				for (let list_label in profile.list_priority) {
					tree_data.list_item[list_label] = [];
				}
			} else {
				tree_data.list_item = [];
			}

			// 排序事项并装入相应清单
			tree_data.item_entry = {};
			for (let item_id in todo_data) {
				let item_data = todo_data[item_id];

				let item_list: any;
				if (tree_type) {
					item_list = tree_data.list_item[item_data.type];
				} else {
					item_list = tree_data.list_item;
				}

				// 事项排序
				let index: number = item_list.length;
				while (index > 0) {
					let pointer_item = todo_data[item_list[index - 1].id];

					if (item_data.cycle != "secular" && pointer_item.cycle == "secular") break;
					if (item_data.time > pointer_item.time) break;
					if (item_data.priority < pointer_item.priority) break;

					item_list[index] = item_list[index - 1];
					index--;
				}
				item_list[index] = new item(item_id, item_data.label, item_data.cycle, item_data.time, Object.keys(item_data.entry).length, item_data.gaze);

				// 生成条目
				tree_data.item_entry[item_id] = [];
				let entry_item = tree_data.item_entry[item_id];
				for (let entry_id in item_data.entry) {
					let entry_data = item_data.entry[entry_id];

					let entry_label = entry_data.label == "" ? entry_data.content : entry_data.label + " : " + entry_data.content;
					entry_item.push(new entry(entry_id, entry_label, item_id, entry_data.done));
				}
			}

			if (tree_type) {
				for (let label in profile.list_priority) {
					// 清单排序
					let index: number = tree_data.list.length;
					if (tree_data.list_item[label].length || empty_list) {			// 去除空清单
						let list_data = profile.list_priority[label];
						while (index > 0 && list_data > profile.list_priority[String(tree_data.list[index - 1].label)].priority) {
							tree_data.list[index] = tree_data.list[index - 1];
							index--;
						}
						tree_data.list[index] = new list(label, tree_data.list_item[label].length);
					}
				}
			}
		}

		view.event_emitter.fire();
	}

	class list extends vscode.TreeItem {
		constructor(label: string, item: boolean) {
			super(label);
			this.contextValue = "todo_list";
			this.iconPath = new vscode.ThemeIcon("list-unordered");
			this.collapsibleState = item ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
		}
	}

	class item extends vscode.TreeItem {
		constructor(id: string, label: string, cycle: string, time: number, entry: number, gaze: boolean) {
			super(label);
			this.id = id;
			this.collapsibleState = entry ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
			this.command = {
				title: "显示详情",
				command: "todotodo.list.edit_item",
				arguments: [this, "todo"]
			};

			let time_text = date.textualize(time);
			switch (cycle) {
				case "secular":
					this.tooltip = "修改时间: " + time_text;
					this.iconPath = new vscode.ThemeIcon("info");
					break;

				default:
					this.tooltip = "截止时间: " + time_text;

					if (date.isRecent(time_text)) {
						this.iconPath = new vscode.ThemeIcon("bell", new vscode.ThemeColor("list.warningForeground"));
						this.description = time_text.substring(11, 16);
					} else {
						this.iconPath = new vscode.ThemeIcon("note");
						this.description = time_text.substring(0, 10);
					}
					break;
			}

			if (gaze) {
				this.contextValue = "gaze_item";
				this.iconPath = new vscode.ThemeIcon(this.iconPath.id, new vscode.ThemeColor("list.highlightForeground"));
			} else {
				this.contextValue = "todo_item";
			}
		}
	}

	class entry extends vscode.TreeItem {
		readonly root: string;

		constructor(id: string, label: string, root: string, is_done: boolean) {
			super(label);
			this.id = id;
			this.root = root;
			this.contextValue = "todo_entry";
			this.command = {
				title: "变更状态",
				command: "todotodo.todo.change",
				arguments: [this]
			};

			if (is_done) {
				this.iconPath = new vscode.ThemeIcon("check");
			} else {
				this.iconPath = new vscode.ThemeIcon("symbol-parameter");
			}
		}
	}

	class tree implements vscode.TreeDataProvider<any>{
		// 刷新事件
		event_emitter = new vscode.EventEmitter<void>();
		onDidChangeTreeData: vscode.Event<any> = this.event_emitter.event;

		/**
		 * 意义不明，没有不行
		 */
		getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
			return element;
		}

		/**
		 * 获取子元素
		 * @param element 视图元素
		 * @returns 子元素
		 */
		getChildren(element?: any): vscode.ProviderResult<any[]> {
			if (element instanceof list) {					// 导入事项
				return tree_data.list_item[String(element.label)];
			} else if (element instanceof item) {			// 导入条目
				return tree_data.item_entry[String(element.id)];
			} else {
				if (tree_type) {							// 导入清单
					return tree_data.list;
				} else {
					return tree_data.list_item;
				}
			}
		}
	}
}
