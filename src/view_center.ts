/* 模块调用 */
import { window } from "vscode";
import { transceiver } from "./tool";
import { progress_provide } from "./view/progress_bar";
import { todo_provider } from "./view/tree/todo_tree";
import { done_provider } from "./view/tree/done_tree";
import { fail_provider } from "./view/tree/fail_tree";
import { task_provider } from "./view/tree/task_tree";
import { page_provider } from "./view/page/edit_page";

export namespace view {
	let process_bar: progress_provide;
	let edit_page: page_provider;
	let task_tree: task_provider;
	let todo_tree: todo_provider;
	let done_tree: done_provider;
	let fail_tree: fail_provider;

	/**
	 * 建立视图
	 * @param page_data Page数据
	 */
	export function initialize(): void {
		process_bar = new progress_provide();

		edit_page = new page_provider();

		task_tree = new task_provider();
		window.createTreeView("task_tree", { showCollapseAll: false, treeDataProvider: task_tree });

		todo_tree = new todo_provider();
		window.createTreeView("todo_tree", { showCollapseAll: true, treeDataProvider: todo_tree });

		done_tree = new done_provider();
		window.createTreeView("done_tree", { showCollapseAll: false, treeDataProvider: done_tree });

		fail_tree = new fail_provider();
		window.createTreeView("fail_tree", { showCollapseAll: false, treeDataProvider: fail_tree });

		transceiver.send("refresh", "side");
	}

	export namespace hint {
		/**
		 * 刷新状态栏
		 * @param todo_data Todo数据
		 */
		export function refresh(todo_data: any) {
			process_bar.refresh(Object.keys(todo_data).length ? "剩余待办：" + Object.keys(todo_data).length + "件" : "已完成所有事项！");
		}
	}

	export namespace tree {
		/**
		 * 刷新视图
		 * @param data 数据
		 * @param view_type 视图类型
		 */
		export function refresh(data: any, view_type: "task_tree" | "todo_tree" | "done_tree" | "fail_tree"): void {
			if (view_type == "task_tree") task_tree.refresh(data);
			if (view_type == "todo_tree") todo_tree.refresh(data.todo, data.profile, data.empty_list);
			if (view_type == "done_tree") done_tree.refresh(data);
			if (view_type == "fail_tree") fail_tree.refresh(data);
		}
	}

	export namespace page {
		/**
		 * 向主页发送命令
		 * @param command 命令文本
		 * @param message 通信数据
		 */
		export function post(command: string, message?: any): void {
			transceiver.send("page.show");
			edit_page.postToPage(command, message);
		}

		/**
		 * 刷新主页
		 */
		export function refresh() {
			if (edit_page.visible) transceiver.send("page.show");
		}

		/**
		 * 显示主页
		 * @param page_data 主页数据
		 * @param task_data Task数据
		 * @param todo_data Todo数据
		 * @param list_priority 清单优先级
		 * @param add_action 新建行为
		 */
		export function show(page_data: any, task_data: any, todo_data: any, list_priority: any, add_action: string) {
			edit_page.show(page_data, task_data, todo_data, list_priority, add_action);
		}
	}
}
