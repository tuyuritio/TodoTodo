/* 模块调用 */
import * as vscode from "vscode";
import { Time, Transceiver } from "../Tool";

export namespace TaskTree {
	let view: Tree;
	let tree_data: Task[];

	/**
	 * 建立视图
	 */
	export function Initialize(): void {
		view = new Tree();
		vscode.window.createTreeView("task_tree", { showCollapseAll: false, treeDataProvider: view });
		Transceiver.Send("view.task");
	}

	/**
	 * 解析数据并刷新视图
	 * @param data 原始数据
	 */
	export function ParseData(data: any): void {
		tree_data = [];
		for (const id in data) {
			const task_item = data[id];

			let duration: number = task_item.period[0].charAt(10) ? Number(task_item.period[0].substring(11)) : -1;

			let history: string[] = [];
			for (let index = task_item.period.length - 1; index >= 0; index--) {
				const days: string = task_item.period[index];

				if (!index && !days.charAt(10)) continue;
				history.unshift(Time.Period(days.substring(0, 10), Number(days.substring(11))));
			}

			let index = tree_data.length;
			while (index > 0 && task_item.priority > data[String(tree_data[index - 1].id)].priority) {
				tree_data[index] = tree_data[index - 1];
				index--;
			}
			tree_data[index] = new Task(id, task_item.label, task_item.today, duration, history);
		}

		view.event_emitter.fire();
	}

	class Task extends vscode.TreeItem {
		constructor(id: string, label: string, today: boolean, duration: number, history: string[]) {
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
				this.description = "已打卡" + (duration + 1) + "天";
			}

			if (history.length) {
				this.tooltip = "打卡记录 :";
				for (let index = 0; index < history.length; index++) {
					this.tooltip += "\n" + history[index];
				}
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
