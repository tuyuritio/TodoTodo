/* 模块调用 */
import * as vscode from "vscode";
import { Time, Transceiver } from "../Tool";

export namespace TodoTree {
	let view: Tree;
	let tree_type: boolean;
	let tree_data: { list: List[], list_item: any, item_entry: any };

	/**
	 * 建立视图
	 */
	export function Initialize(): void {
		view = new Tree();
		vscode.window.createTreeView("todo_tree", { showCollapseAll: true, treeDataProvider: view });
		Transceiver.Send("view.todo");
	}

	/**
	 * 解析数据并刷新视图
	 * @param data 原始数据
	 * @param profile 配置数据
	 */
	export function ParseData(data: any, profile: any): void {
		tree_type = profile.tree_type;
		tree_data = { list: [], list_item: undefined, item_entry: undefined };

		// 生成清单事项框架
		if (tree_type) {
			tree_data.list_item = {};
			for (const id in data.type) {
				tree_data.list_item[id] = [];
			}
		} else {
			tree_data.list_item = [];
		}

		// 排序事项并装入相应清单
		tree_data.item_entry = {};
		for (const item_id in data.todo) {
			const item_data = data.todo[item_id];

			let item_list: any;
			if (tree_type) {
				item_list = tree_data.list_item[item_data.type];
			} else {
				item_list = tree_data.list_item;
			}

			// 事项排序
			let index: number = item_list.length;
			while (index > 0) {
				const pointer_item = data.todo[item_list[index - 1].id];

				if (item_data.cycle == -1 && pointer_item.cycle == -1) {
					if (item_data.priority <= pointer_item.priority) break;
				} else if (item_data.cycle != -1 && pointer_item.cycle != -1) {
					if (item_data.time == pointer_item.time) {
						if (item_data.priority <= pointer_item.priority) break;
					} else if (item_data.time > pointer_item.time) {
						break;
					}
				} else if (item_data.cycle != -1 && pointer_item.cycle == -1) {
					break;
				}

				item_list[index] = item_list[index - 1];
				index--;
			}
			item_list[index] = new Item(item_id, item_data.label, item_data.cycle, item_data.time, Object.keys(item_data.entry).length, item_data.gaze);

			// 生成条目
			tree_data.item_entry[item_id] = [];
			const entry_item = tree_data.item_entry[item_id];
			for (const entry_id in item_data.entry) {
				const entry_data = item_data.entry[entry_id];
				entry_item.push(new Entry(item_id, entry_id, entry_data.content, entry_data.done));
			}
		}

		if (tree_type) {
			for (const id in data.type) {
				// 清单排序
				let index: number = tree_data.list.length;
				if (tree_data.list_item[id].length || profile.empty_list) {			// 去除空清单
					const list_data = data.type[id];
					while (index > 0 && list_data.priority > data.type[String(tree_data.list[index - 1].id)].priority) {
						tree_data.list[index] = tree_data.list[index - 1];
						index--;
					}
					tree_data.list[index] = new List(id, list_data.label, tree_data.list_item[id].length);
				}
			}
		}

		view.event_emitter.fire();
	}

	class List extends vscode.TreeItem {
		constructor(id: string, label: string, size: number) {
			super(label);
			this.id = id;
			this.contextValue = id == "__untitled" ? "untitled_list" : "todo_list";
			this.iconPath = new vscode.ThemeIcon("list-unordered");
			this.collapsibleState = size ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
			this.description = "( " + size + " )";
		}
	}

	class Item extends vscode.TreeItem {
		constructor(id: string, label: string, cycle: number, time: number, entry: number, gaze: boolean) {
			super(label);
			this.id = id;
			this.collapsibleState = entry ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;

			const time_text = Time.Textualize(time);
			if (cycle + 1) {
				this.tooltip = "截止时间: " + time_text;

				if (Time.In24(time_text)) {
					this.iconPath = new vscode.ThemeIcon("bell", new vscode.ThemeColor("list.warningForeground"));
					this.description = time_text.substring(11, 16);
				} else {
					this.iconPath = new vscode.ThemeIcon("note");
					this.description = time_text.substring(0, 10);
				}

				if (cycle > 0) {
					this.contextValue = "cycle_item";
				} else {
					this.contextValue = "todo_item";
				}
			} else {
				this.tooltip = "修改时间: " + time_text;
				this.iconPath = new vscode.ThemeIcon("info");
				this.contextValue = "todo_item";
			}

			if (gaze) {
				this.contextValue = "gaze_item";
				this.iconPath = new vscode.ThemeIcon(this.iconPath.id, new vscode.ThemeColor("list.highlightForeground"));
			}
			// else {
			// 	this.contextValue = "todo_item";
			// }
		}
	}

	class Entry extends vscode.TreeItem {
		readonly root: string;

		constructor(root: string, id: string, label: string, is_done: boolean) {
			super(label);
			this.id = id;
			this.root = root;
			this.contextValue = "todo_entry";
			this.command = {
				title: "变更状态",
				command: "todotodo.entry.change",
				arguments: [this]
			};

			if (is_done) {
				this.iconPath = new vscode.ThemeIcon("check");
			} else {
				this.iconPath = new vscode.ThemeIcon("symbol-parameter");
			}
		}
	}

	class Tree implements vscode.TreeDataProvider<any>{
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
			if (element instanceof List) {					// 导入事项
				return tree_data.list_item[String(element.id)];
			} else if (element instanceof Item) {			// 导入条目
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
