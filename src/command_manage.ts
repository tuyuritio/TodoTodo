/* 模块调用 */
import * as vscode from "vscode";
import * as package_set from "./package_set";
import * as todo_tree from "./view/todo_tree";
import * as done_tree from "./view/done_tree";
import * as fail_tree from "./view/fail_tree";
import * as progress_bar from "./view/progress_bar";
import * as page_view from "./view/page_view";
import * as list_command from "./command/list_command";
import * as todo_command from "./command/todo_command";
import * as done_command from "./command/done_command";
import * as fail_command from "./command/fail_command";

/* 初始化扩展 */
/**
 * 创建todo_tree视图、done_tree视图、fail_tree视图、进度视图
 */
export function initialize(context: vscode.ExtensionContext): void {
	extension_context = context;						// 建立上下文
	commands.register();

	view.todo_tree = todo_tree.createItemTree();		// 创建todo_tree视图
	view.done_tree = done_tree.createItemTree();		// 创建done_tree视图
	view.fail_tree = fail_tree.createItemTree();		// 创建fail_tree视图
	view.progress = progress_bar.CreateProgress();	// 创建进度视图
}

/* 扩展配置参数 */
export class configurations {
	static configuration = vscode.workspace.getConfiguration("todotodo");
	static listAllItemDeleteRemind = configurations.configuration.list.todo.item.delete.remind;
	static listAllDeleteRemind = configurations.configuration.list.todo.delete.remind;
	static listAllItemDeleteMethod = configurations.configuration.list.todo.delete.method;
	static listAllEmptyShow = configurations.configuration.list.todo.empty.show;
	static pageEditorAddAfterAction = configurations.configuration.page.editor.add.after.action;

	constructor() {
		// 监听配置变更
		vscode.workspace.onDidChangeConfiguration(() => {
			configurations.configuration = vscode.workspace.getConfiguration("todotodo");
			configurations.listAllItemDeleteRemind = configurations.configuration.list.todo.item.delete.remind;
			configurations.listAllDeleteRemind = configurations.configuration.list.todo.delete.remind;
			configurations.listAllItemDeleteMethod = configurations.configuration.list.todo.delete.method;
			configurations.listAllEmptyShow = configurations.configuration.list.todo.empty.show;
			configurations.pageEditorAddAfterAction = configurations.configuration.page.editor.add.after.action;

			package_set.setEmptyText();
			view.refresh();
		});
	}
}

/* 全局变量 */
let extension_context: vscode.ExtensionContext;			// 扩展上下文
new configurations();									// 扩展配置

/* 视图管理 */
export class view {
	static todo_tree: todo_tree.provider;
	static done_tree: done_tree.provider;
	static fail_tree: fail_tree.provider;
	static progress: progress_bar.progress_provider;
	static page_view: page_view.provider;

	/**
	 * 刷新全局视图
	 */
	static refresh(): void {
		if (view.page_view && view.page_view.is_visible()) {
			view.page_view.showLog();
			view.page_view.initialize();
		}

		list_command.getRecentItem();
		list_command.sortItem();

		view.todo_tree.refresh(configurations.listAllEmptyShow);
		view.done_tree.refresh();
		view.fail_tree.refresh();
		view.progress.show();
	}
}

/* 命令注册管理 */
export namespace commands {
	function set(command: string, action: (...data: any) => any): void {
		extension_context.subscriptions.push(vscode.commands.registerCommand(command, (...data) => action(...data)));
	}

	export function register(): void {
		// 注册page命令
		set("page.show", () => page.show());
		set("page.add", () => page.add(configurations.pageEditorAddAfterAction));
		set("page.edit", (item) => page.edit(item));
		set("page.particulars", (item, status) => page.particulars(item, status));
		set("page.list", () => page.list());

		// 注册list命令
		set("list.delete", (item) => list.deleteList(item, configurations.listAllDeleteRemind, configurations.listAllItemDeleteMethod));

		// 注册todo_tree命令
		set("todo.refresh", () => view.refresh());					// 作用于全局刷新
		set("todo.accomplish", (item) => todo.accomplish(item));
		set("todo.shut", (item) => todo.shut(item));
		set("todo.delete", (item) => todo.deleteItem(item, configurations.listAllItemDeleteRemind));
		set("todo.gaze", (item) => todo.gaze(item));
		set("todo.undo", (item) => todo.undo(item));

		// 注册done_tree命令
		set("done.clear", () => done.clear());
		set("done.redo", (item) => done.redo(item));

		// 注册fail_tree命令
		set("fail.restart", (item) => fail.restart(item));
		set("fail.restart_all", () => fail.restartAll());
	}
}

/* 主页管理 */
export namespace page {
	/**
	* 显示主页
	*/
	export function show(): void {
		if (!view.page_view || !view.page_view.is_visible()) {
			view.page_view = page_view.createPage();
			view.page_view.showLog();
		}
	}

	/**
	 * 初始化主页
	 */
	export function initialize(): void {
		if (view.page_view) {
			view.page_view.initialize();
		}
	}

	/**
	 * 新增事项
	 */
	export function add(action: string): void {
		show();

		view.page_view.postToPage("add", action);
	}

	/**
	 * 编辑事项
	 * @param item 被点击的事项对象
	 */
	export function edit(item: any): void {
		show();

		let data = {
			type: item.type,
			index: item.index,
			label: item.label,
			priority: item.priority,
			cycle: item.cycle,
			time: item.time,
			place: item.place,
			mail: item.mail,
			particulars: item.particulars
		};
		view.page_view.postToPage("edit", data);
	}

	/**
	 * 显示事项信息
	 * @param item 事项对象
	 * @param status 事项状态
	 */
	export function particulars(item: any, status: string) {
		show();

		let data = {
			type: item.type,
			index: item.index,
			label: item.label,
			priority: item.priority,
			cycle: item.cycle,
			time: item.time,
			place: item.place,
			mail: item.mail,
			particulars: item.particulars,
			status: status
		};
		view.page_view.postToPage("information", data);
	}

	export function list() {
		show();

		view.page_view.list();
	}
}

/* 清单管理 */
export namespace list {
	/**
	 * 删除清单
	 * @param item 清单对象
	 * @param if_remind 是否确认删除
	 * @param move 删除清单的方法 - "move"则移动到普通清单；"remove"则直接删除。
	 */
	export function deleteList(item: any, if_remind: boolean, move: string): void {
		list_command.deleteList(item, if_remind, move).then((if_delete) => {
			if (if_delete) {
				view.refresh();
			}
		});
	}

	/**
	 * 检索已经逾期或未来24小时内将要逾期的事项
	 */
	export function getRecentItem(): void {
		list_command.getRecentItem();
	}

	/**
	 * 排序事项
	 */
	export function sortItem(): void {
		list_command.sortItem();
	}

	/**
	 * 清理逾期事项
	 */
	export function shutOverdueItem(): void {
		let if_shut = list_command.shutOverdueItem();
		if (if_shut) {
			view.refresh();
		}
	}
}

/* Todo命令管理 */
export namespace todo {
	/**
	 * 完成事项
	 * @param item 被点击的事项对象
	 */
	export function accomplish(item: any): void {
		todo_command.accomplish(item);

		view.refresh();
	}

	/**
	 * 关闭事项
	 * @param item 被点击的事项对象
	 */
	export function shut(item: any): void {
		todo_command.shut(item);

		view.refresh();
	}

	/**
	 * 删除事项
	 * @param item 被点击的事项对象
	 * @param if_remind 是否确认删除
	 */
	export function deleteItem(item: any, if_remind: boolean): void {
		todo_command.deleteItem(item, if_remind).then((if_delete) => {
			if (if_delete) {
				view.refresh();
			}
		});
	}

	/**
	 * 当前办理事项
	 * @param item 事项对象
	 */
	export function gaze(item: any) {
		todo_command.gaze(item);

		view.refresh();
	}

	/**
	 * 取消办理事项
	 * @param item 事项对象
	 */
	export function undo(item: any) {
		todo_command.undo(item);

		view.refresh();
	}
}

/* Done命令管理 */
export namespace done {
	/**
	 * 重做事项
	 * @param item 被点击的事项对象
	 */
	export function redo(item: any): void {
		done_command.redo(item);

		view.refresh();
	}

	/**
	 * 清空已做事项
	 */
	export function clear(): void {
		done_command.clear().then((if_clear) => {
			if (if_clear) {
				view.refresh();
			}
		});
	}
}

/* Fail命令管理 */
export namespace fail {
	/**
	 * 重启事项
	 * @param item 被点击的事项对象
	 */
	export function restart(item: any): void {
		fail_command.restart(item);

		view.refresh();
	}

	/**
	 * 重启所有事项
	 */
	export function restartAll(): void {
		fail_command.restartAll().then((if_restart) => {
			if (if_restart) {
				view.refresh();
			}
		});
	}
}