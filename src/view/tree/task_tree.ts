/* 模块调用 */
import * as vscode from "vscode";

/* 任务元素 */
class task extends vscode.TreeItem {
	// 任务参数
	private readonly today: boolean;
	readonly priority: number;

	constructor(id: string, label: string, priority: number, today: boolean, duration: number) {
		super(label);
		this.contextValue = "task_item";

		this.id = id;
		this.priority = priority;
		this.today = today;

		if (this.today) {
			this.iconPath = new vscode.ThemeIcon("check");
		} else {
			this.iconPath = new vscode.ThemeIcon("bookmark");
		}

		if (duration != -1) {
			this.tooltip = "已连续打卡" + (duration + 1) + "天！";
		} else {
			this.tooltip = "暂未开始打卡。";
		}

		this.command = {
			title: "变更状态",
			command: "todotodo.task.change",
			arguments: [this]
		};
	}
};

/* 元素提供器 */
export class task_provider implements vscode.TreeDataProvider<task> {
	private data: any;

	/**
	 * getTreeItem
	 * @param element
	 * @returns TreeItem
	 */
	getTreeItem(element: task): vscode.TreeItem {
		return element;
	}

	/**
	 * getChildren
	 * @returns vscode.ProviderResult<item[]>
	 */
	getChildren(): vscode.ProviderResult<task[]> {
		let items: task[] = [];
		for (let id in this.data) {
			items.push(new task(id, this.data[id].label, this.data[id].priority, this.data[id].today, this.data[id].duration));
		}

		// 任务排序
		for (let index = 1; index < items.length; index++) {
			let pointer: number = index - 1;
			let item = items[index];

			// 有序则break
			// pointer在前，index在后
			while (pointer >= 0) {
				if (items[pointer].priority >= item.priority) break;

				items[pointer + 1] = items[pointer];
				pointer--;
			}

			items[pointer + 1] = item;
		}

		return items;
	}

	event_emitter = new vscode.EventEmitter<task | void>();
	onDidChangeTreeData = this.event_emitter.event;

	/**
	 * 刷新视图
	 * @param task_data 原始数据
	 */
	refresh(task_data: any): void {
		this.data = task_data;
		this.event_emitter.fire();
	}
};
