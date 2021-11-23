/* 模块调用 */
import * as item_provide from './view/item_provide';
import * as process_provide from './view/process_provide';
import * as page_provide from './view/page_provide';
import * as list from './command/list_command';
import * as todo from './command/todo_command';
import * as done from './command/done_command';
import * as fail from './command/fail_command';

export namespace view {
}

/* 命令管理 */
export class command_manager {
	/* 声明视图 */
	private todo_tree;
	private done_tree;
	private fail_tree;
	private process;
	private page?: any;

	/* 声明配置 */
	private show_empty: boolean = false;

	/* 初始化 */
	/**
	 * 创建todo_tree视图、done_tree视图、fail_tree视图、进程视图
	 */
	constructor() {
		this.todo_tree = item_provide.createItemTree("todo_tree", "todo_item");	// 创建todo_tree视图
		this.done_tree = item_provide.createItemTree("done_tree", "done_item");	// 创建done_tree视图
		this.fail_tree = item_provide.createItemTree("fail_tree", "fail_item");	// 创建fail_tree视图
		this.process = process_provide.CreateProgress();						// 创建进程视图
	}

	/* 视图管理 */
	/**
	 * 刷新全局视图
	 */
	Refresh(if_show_empty_list: boolean): void {
		this.show_empty = if_show_empty_list;

		if (this.page && this.page.is_visible()) {
			this.page.showLog();
		}

		list.getRecentItem();
		list.sortItem();

		this.todo_tree.refresh(this.show_empty);
		this.done_tree.refresh();
		this.fail_tree.refresh();
		this.process.show();
	}

	/**
	* 显示主页
	*/
	ShowPage(): void {
		if (!this.page || !this.page.is_visible()) {
			this.page = page_provide.createPage();
			this.page.showLog();
		}
	}

	/**
	 * 新增事项
	 */
	Add(): void {
		this.ShowPage();

		this.page.postToPage("add");
	}

	/**
	 * 编辑事项
	 * @param item 被点击的事项对象
	 */
	Edit(item: any): void {
		this.ShowPage();

		let data = {
			type: item.type,
			index: item.index,
			label: item.label,
			priority: item.priority,
			cycle: item.cycle,
			time: item.time,
			place: item.place,
			mail: item.mail,
			detail: item.detail
		};
		this.page.postToPage("edit", data);
	}

	/* 清单管理 */
	/**
	 * 删除清单
	 * @param item 清单对象
	 * @param if_remind 是否确认删除
	 * @param move 删除清单的方法 - "move"则移动到普通清单；"remove"则直接删除。
	 */
	DeleteList(item: any, if_remind: boolean, move: string): void {
		list.deleteList(item, if_remind, move).then((if_delete) => {
			if (if_delete) {
				this.Refresh(this.show_empty);
			}
		});
	}

	/**
	 * 检索已经逾期或未来24小时内将要逾期的事项
	 */
	GetRecentItem(): void {
		list.getRecentItem();
	}

	/**
	 * 排序事项
	 */
	SortItem(): void {
		list.sortItem();
	}

	/**
	 * 清理逾期事项
	 */
	ShutOverdue(): void {
		let if_fail = list.shutOverdue();
		if (if_fail) {
			this.Refresh(this.show_empty);
		}
	}

	/* todo命令管理 */
	/**
	 * 完成事项
	 * @param item 被点击的事项对象
	 */
	Accomplish(item: any): void {
		todo.accomplish(item);

		this.Refresh(this.show_empty);
	}

	/**
	 * 关闭事项
	 * @param item 被点击的事项对象
	 */
	Shut(item: any): void {
		todo.shut(item);

		this.Refresh(this.show_empty);
	}

	/**
	 * 删除事项
	 * @param item 被点击的事项对象
	 * @param if_remind 是否确认删除
	 */
	Delete(item: any, if_remind: boolean): void {
		todo.deleteItem(item, if_remind).then((if_delete) => {
			if (if_delete) {
				this.Refresh(this.show_empty);
			}
		});
	}

	/* done命令管理 */
	/**
	 * 重做事项
	 * @param item 被点击的事项对象
	 */
	Redo(item: any): void {
		done.redo(item);

		this.Refresh(this.show_empty);
	}

	/**
	 * 清空已做事项
	 */
	Clear(): void {
		done.clear().then((if_clear) => {
			if (if_clear) {
				this.Refresh(this.show_empty);
			}
		});
	}

	/* fail命令管理 */
	/**
	 * 重启事项
	 * @param item 被点击的事项对象
	 */
	Restart(item: any): void {
		fail.restart(item);

		this.Refresh(this.show_empty);
	}

	/**
	 * 重启所有事项
	 */
	RestartAll(): void {
		fail.restartAll().then((if_restart) => {
			if (if_restart) {
				this.Refresh(this.show_empty);
			}
		});
	}
}