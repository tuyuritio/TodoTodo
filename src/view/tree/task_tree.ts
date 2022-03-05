/* 模块调用 */
import * as vscode from "vscode";
import { transceiver } from "../../tool";

export namespace task_tree {
	let view: Tree;
	let tree_data: Task[];

	/**
	 * 建立视图
	 */
	export function initialize() {
		view = new Tree();
		vscode.window.createTreeView("task_tree", { showCollapseAll: false, treeDataProvider: view });
		transceiver.send("view.task");
	}

	/**
	 * 解析数据并刷新视图
	 * @param task_data 原始数据
	 */
	export function parseData(task_data: any) {
		tree_data = [];
		for (let id in task_data) {
			let task_item = task_data[id];

			let index = tree_data.length;
			while (index > 0 && task_item.priority > task_data[String(tree_data[index - 1].id)].priority) {
				tree_data[index] = tree_data[index - 1];
				index--;
			}
			tree_data.unshift(new Task(id, task_item.label, task_item.today, task_item.duration));
		}

		view.event_emitter.fire();
	}

	class Task extends vscode.TreeItem {
		constructor(id: string, label: string, today: boolean, duration: number) {
			super(label);
			this.id = id;
			this.contextValue = "task_item";
			this.command = {
				title: "变更状态",
				command: "todotodo.task.change",
				arguments: [this]
			};

			if (today) {
				this.iconPath = new vscode.ThemeIcon("check");
			} else {
				this.iconPath = new vscode.ThemeIcon("bookmark");
			}

			if (duration != -1) {
				this.tooltip = "已连续打卡" + (duration + 1) + "天！";
			} else {
				this.tooltip = "暂未开始打卡。";
			}
		}
	};

	class Tree implements vscode.TreeDataProvider<Task> {
		// 刷新事件
		event_emitter = new vscode.EventEmitter<Task | void>();
		onDidChangeTreeData = this.event_emitter.event;

		/**
		 * 意义不明，没有不行
		 */
		getTreeItem(element: Task): vscode.TreeItem | Thenable<vscode.TreeItem> {
			return element;
		}

		/**
		 * 获取子元素
		 * @returns 子元素
		 */
		getChildren(): vscode.ProviderResult<Task[]> {
			return tree_data;
		}
	};
}
