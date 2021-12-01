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
import { data  } from "./operator/data_center";

/* 全局变量 */
let extension_context: vscode.ExtensionContext;			// 扩展上下文

/* 初始化扩展 */
/**
 * 注册扩展命令、载入扩展配置、载入本地数据、创建todo_tree视图、done_tree视图、fail_tree视图、进度视图
 */
export function initialize(context: vscode.ExtensionContext): void {
	extension_context = context;				// 建立上下文
	commands.register();						// 注册命令
	new configurations();						// 扩展配置
	new data();

	view.todo_tree = todo_tree.create();		// 创建todo_tree视图
	view.done_tree = done_tree.create();		// 创建done_tree视图
	view.fail_tree = fail_tree.create();		// 创建fail_tree视图
	view.progress = progress_bar.create();		// 创建进度视图
	view.progress.show();						// 显示进程视图
}

/* 终止扩展 */
/**
 * 写入日志文件
 */
export function terminate() {
	data.write();
}

/* 扩展配置管理 */
export class configurations {
	static first_configuration = vscode.workspace.getConfiguration("todotodo");
	static new_configuration = configurations.first_configuration;

	static listAllItemDeleteRemind = this.first_configuration.list.todo.item.delete.remind;
	static listAllDeleteRemind = this.first_configuration.list.todo.delete.remind;
	static listAllItemDeleteMethod = this.first_configuration.list.todo.delete.method;
	static listAllEmptyShow = this.first_configuration.list.todo.empty.show;
	static pageEditorAddAfterAction = this.first_configuration.page.editor.add.after.action;
	static path = this.first_configuration.path;

	constructor() {
		// 监听配置变更
		vscode.workspace.onDidChangeConfiguration(() => {
			configurations.new_configuration = vscode.workspace.getConfiguration("todotodo");

			configurations.listAllItemDeleteRemind = configurations.new_configuration.list.todo.item.delete.remind;
			configurations.listAllDeleteRemind = configurations.new_configuration.list.todo.delete.remind;
			configurations.listAllItemDeleteMethod = configurations.new_configuration.list.todo.delete.method;
			configurations.listAllEmptyShow = configurations.new_configuration.list.todo.empty.show;
			configurations.pageEditorAddAfterAction = configurations.new_configuration.page.editor.add.after.action;

			package_set.setEmptyText();
			view.refresh();
		});
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
		set("page.list", () => page.showList());

		// 注册list命令
		set("list.delete", (item) => list.deleteList(item, configurations.listAllDeleteRemind, configurations.listAllItemDeleteMethod));

		// 注册todo_tree命令
		set("todo.refresh", () => view.refresh(false));
		set("todo.accomplish", (item) => todo.accomplish(item));
		set("todo.shut", (item) => todo.shut(item));
		set("todo.delete", (item) => todo.deleteItem(item, configurations.listAllItemDeleteRemind));
		set("todo.gaze", (item) => todo.gaze(item));
		set("todo.undo", (item) => todo.undo(item));
		set("todo.save", () => todo.save());

		// 注册done_tree命令
		set("done.clear", () => done.clear());
		set("done.redo", (item) => done.redo(item));

		// 注册fail_tree命令
		set("fail.restart", (item) => fail.restart(item));
		set("fail.restart_all", () => fail.restartAll());
	}
}

/* 视图管理 */
export class view {
	static todo_tree: todo_tree.provider;
	static done_tree: done_tree.provider;
	static fail_tree: fail_tree.provider;
	static progress: progress_bar.progress_provider;

	/**
	 * 刷新全局视图
	 * @param auto 刷新时是否读写本地数据并刷新网页 - true则仅执行刷新；false则在刷新前读写本地数据
	 */
	static refresh(auto: boolean = true): void {
		if (!auto) {
			new data();
		}

		list.getRecentItem();
		list.sortItem();

		page.refresh(auto);

		view.todo_tree.refresh(configurations.listAllEmptyShow);
		view.done_tree.refresh();
		view.fail_tree.refresh();
		view.progress.show();
	}
}

/* 主页管理 */
export class page {
	private static view: page_view.provider;

	/**
	 * 刷新视图
	 * @param auto 是否强制刷新 - false则强制刷新；false则默认刷新
	 */
	static refresh(auto: boolean = true) {
		if (this.view && this.view.is_visible()) {
			if (!auto) {
				this.view.close();
				this.view = page_view.create();
			}

			this.view.showLog();
			this.view.initialize();
		}
	}

	/**
	* 显示主页
	*/
	static show(): void {
		if (!this.view || !this.view.is_visible()) {
			this.view = page_view.create();
			this.view.showLog();

			page.view.panel.webview.onDidReceiveMessage((message) => {
				switch (message.command) {
					case "warning":
						vscode.window.showWarningMessage(message.data);
						break;

					case "add":
						if (message.data.old_item) {
							todo.deleteOld(message.data.old_item);
						}
						todo.addNew(message.data.new_item);

						view.refresh();
						break;

					case "list":
						list.edit(message.data);
						break;

					case "deleteList":
						list.deleteList(message.data, configurations.listAllDeleteRemind, configurations.listAllItemDeleteMethod);
						break;

					case "clearLog":
						page_view.clearLog();
						break;
				}
			});
		} else {
			this.view.show();
		}
	}

	/**
	 * 关闭主页
	 */
	static close() {
		this.view.close();
	}

	/**
	 * 初始化主页
	 */
	static initialize(): void {
		if (this.view) {
			this.view.initialize();
		}
	}

	/**
	 * 新增事项
	 */
	static add(action: string): void {
		this.show();

		this.view.postToPage("add", action);
	}

	/**
	 * 编辑事项
	 * @param item 被点击的事项对象
	 */
	static edit(item: any): void {
		this.show();

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
		this.view.postToPage("edit", data);
	}

	/**
	 * 显示事项信息
	 * @param item 事项对象
	 * @param status 事项状态
	 */
	static particulars(item: any, status: string) {
		this.show();

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
		this.view.postToPage("information", data);
	}

	/**
	 * 显示清单列表
	 */
	static showList() {
		this.show();

		this.view.showList();
	}
}

/* 清单管理 */
export namespace list {
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

	/**
	 * 删除清单
	 * @param item 清单对象
	 * @param if_remind 是否确认删除
	 * @param move 删除清单的方法 - "move"则移动到默认清单；"remove"则直接删除。
	 */
	export function deleteList(item: any, if_remind: boolean, move: string): void {
		list_command.deleteList(item, if_remind, move).then((if_delete) => {
			if (if_delete) {
				view.refresh();
			}
		});
	}

	export function edit(list: any) {
		list_command.editList(list);

		view.refresh();
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

	/**
	 * 新建事项
	 * @param item 事项对象
	 */
	export function addNew(item: any) {
		todo_command.addNew(item);
	}

	/**
	 * 删除原有事项
	 * @param item 原有事项对象
	 */
	export function deleteOld(item: any) {
		todo_command.deleteOld(item);
	}

	/**
	 * 保存数据
	 */
	export function save(): void {
		todo_command.save();

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