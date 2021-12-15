/* 模块调用 */
import * as vscode from "vscode";
import * as todo_tree from "./view/todo_tree";
import * as done_tree from "./view/done_tree";
import * as fail_tree from "./view/fail_tree";
import * as progress_bar from "./view/progress_bar";
import * as page_view from "./view/page_view";
import * as list_manage from "./data/list_manage";
import * as todo_manage from "./data/todo_manage";
import * as done_manage from "./data/done_manage";
import * as fail_manage from "./data/fail_manage";
import { configuration } from "./general/configuration_center";
import { data } from "./data/data_center";

/* 全局变量 */
let extension_context: vscode.ExtensionContext;			// 扩展上下文

/* 扩展管理 */
export namespace extension {
	/* 初始化扩展 */
	/**
	 * 注册扩展命令、载入扩展配置、载入本地数据、创建todo_tree视图、done_tree视图、fail_tree视图、进度视图
	 */
	export function initialize(context: vscode.ExtensionContext): void {
		extension_context = context;				// 建立上下文
		command.register();							// 注册命令
		new configuration();						// 扩展配置
		new data();									// 读取数据

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
}

/* 命令管理 */
export namespace command {
	/**
	 * 注册命令
	 * @param command 命令
	 * @param action 函数
	 */
	function set(command: string, action: (...data: any) => any): void {
		extension_context.subscriptions.push(vscode.commands.registerCommand(command, (...data) => action(...data)));
	}

	/**
	 * 注册所有命令
	 */
	export function register(): void {
		// 注册page命令
		set("page.show", () => page.show());
		set("page.list", () => page.showList());
		set("page.add", () => page.add(configuration.page_editor_add_after_action));
		set("page.edit", (item, status) => page.edit(item, status));

		// 注册list命令
		set("list.delete", (item) => list.deleteList(item, configuration.list_all_delete_remind, configuration.list_all_item_delete_method));

		// 注册todo_tree命令
		set("todo.refresh", () => view.refresh(false));
		set("todo.accomplish", (item) => todo.accomplish(item));
		set("todo.shut", (item) => todo.shut(item));
		set("todo.delete", (item) => todo.deleteItem(item, configuration.list_all_item_delete_remind));
		set("todo.gaze", (item) => todo.gaze(item));
		set("todo.undo", (item) => todo.undo(item));
		set("todo.change", (item) => todo.change(item));
		set("todo.remove", (item) => todo.remove(item));
		set("todo.save", () => todo.save());

		// 注册done_tree命令
		set("done.clear", () => done.clear());
		set("done.redo", (item) => done.redo(item));

		// 注册fail_tree命令
		set("fail.restart", (item) => fail.restart(item));
		set("fail.restart_all", () => fail.restartAll());
	}
}

/* 清单管理 */
export namespace list {
	/**
	 * 检索已经逾期或未来24小时内将要逾期的事项
	 */
	export function getRecentItem(): void {
		list_manage.getRecentItem();
	}

	/**
	 * 排序事项
	 */
	export function sortItem(): void {
		list_manage.sortItem();
	}

	/**
	 * 清理逾期事项
	 */
	export function shutOverdueItem(): void {
		let if_shut = list_manage.shutOverdueItem();
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
		list_manage.deleteList(item, if_remind, move).then((if_delete) => {
			if (if_delete) {
				view.refresh();
			}
		});
	}

	/**
	 * 编辑清单
	 * @param list 清单名称
	 */
	export function edit(list: any) {
		list_manage.editList(list);

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
		todo_manage.accomplish(item);

		view.refresh();
	}

	/**
	 * 关闭事项
	 * @param item 被点击的事项对象
	 */
	export function shut(item: any): void {
		todo_manage.shut(item);

		view.refresh();
	}

	/**
	 * 删除事项
	 * @param item 被点击的事项对象
	 * @param if_remind 是否确认删除
	 */
	export function deleteItem(item: any, if_remind: boolean): void {
		todo_manage.deleteItem(item, if_remind).then((if_delete) => {
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
		todo_manage.gaze(item);

		view.refresh();
	}

	/**
	 * 取消办理事项
	 * @param item 事项对象
	 */
	export function undo(item: any) {
		todo_manage.undo(item);

		view.refresh();
	}

	/**
	 * 切换条目状态
	 * @param on 条目状态
	 */
	export function change(entry: any) {
		todo_manage.change(entry);

		view.refresh();
	}

	/**
	 * 删除条目
	 * @param entry 条目对象
	 */
	export function remove(entry: any) {
		todo_manage.remove(entry);

		view.refresh();
	}

	/**
	 * 新建事项
	 * @param item 事项对象
	 */
	export function addNew(item: any) {
		todo_manage.addNew(item);
	}

	/**
	 * 删除原有事项
	 * @param item 原有事项对象
	 */
	export function deleteOld(item: any) {
		todo_manage.deleteOld(item);
	}

	/**
	 * 保存数据
	 */
	export function save(): void {
		todo_manage.save();

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
		done_manage.redo(item);

		view.refresh();
	}

	/**
	 * 清空已做事项
	 */
	export function clear(): void {
		done_manage.clear().then((if_clear) => {
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
		fail_manage.restart(item);

		view.refresh();
	}

	/**
	 * 重启所有事项
	 */
	export function restartAll(): void {
		fail_manage.restartAll().then((if_restart) => {
			if (if_restart) {
				view.refresh();
			}
		});
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
		if (this.view && this.view.isVisible()) {
			if (!auto) {
				this.view.close();
			}

			this.show();
		}
	}

	/**
	* 显示主页
	*/
	static show(): void {
		if (!this.view || !this.view.isVisible()) {
			this.view = page_view.create();
			this.view.initialize();

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
						page.initialize();
						break;

					case "list":
						list.edit(message.data);
						page.initialize();
						break;

					case "deleteList":
						list.deleteList(message.data, configuration.list_all_delete_remind, configuration.list_all_item_delete_method);
						page.initialize();
						break;

					case "clearLog":
						page_view.clearLog();
						break;
				}
			});
		} else {
			this.view.show();
		}

		this.view.showLog();
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
	 * @param status 被点击的事项状态
	 */
	static edit(item: any, status: string): void {
		this.show();

		this.view.edit(item, status);
	}

	/**
	 * 显示清单列表
	 */
	static showList() {
		this.show();

		this.view.showList();
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

		view.todo_tree.refresh(configuration.list_all_empty_show);
		view.done_tree.refresh();
		view.fail_tree.refresh();
		view.progress.show();
	}
}
