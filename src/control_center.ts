/* 模块调用 */
import { transceiver, message, action } from "./tool";
import { file_interface as file } from "./interface/file_interface";
import { workspace_interface as workspace } from "./interface/workspace_interface";
import { configuration_processer as configuration } from "./processer/configuration_processer";
import { profile_processer as profile } from "./processer/profile_processer";
import { task_processer as task } from "./processer/task_processer";
import { list_processer as list } from "./processer/list_processer";
import { todo_processer as todo } from "./processer/todo_processer";
import { done_processer as done } from "./processer/done_processer";
import { fail_processer as fail } from "./processer/fail_processer";
import { view } from "./view_center";
import { data } from "./data_center";

export namespace controller {
	/**
	 * 初始化控制器
	 * @param context 扩展上下文
	 */
	export function initialize(context: any): void {
		transceiver.initialize(context);		// 初始化收发器
		communicator.initialize();				// 初始化通信器
		workspace.initialize();					// 初始化工作区数据
		file.initialize();						// 初始化本地数据
		view.initialize();						// 建立视图
		action.cycle(list.shutOverdue);			// 检测逾期事项
		action.cycle(task.checkAll);			// 检测每日任务
	}

	/**
	 * 保存数据
	 */
	export function terminate() {
		file.side.write();
	}
}

namespace communicator {
	/**
	 * 初始化通信器
	 */
	export function initialize() {
		// 注册configuration命令
		transceiver.register("configuration.path_error", configuration.setPath);
		transceiver.register("configuration.reload", configuration.reload);

		// 注册file命令
		transceiver.register("file.write", file.side.write, true);

		// 注册全局命令
		transceiver.register("refresh", refresher.emit, true);

		// 注册主页命令
		transceiver.register("page.show", () => view.page.show(data.page, data.task.task, data.list.todo, data.profile.list_priority, data.configuration.add_action), true);
		transceiver.register("page.post", view.page.post);
		transceiver.register("page.message", (DATA) => message.show(DATA.type, DATA.text));

		// 注册task命令
		transceiver.register("task.change", task.change, true);
		transceiver.register("task.change_all", task.changeAll, true);
		transceiver.register("task.establish", task.establish, true);
		transceiver.register("task.calendar", task.calendar, true);
		transceiver.register("task.adjust", task.adjust);
		transceiver.register("task.terminate", task.terminate, true);

		// 注册list命令
		transceiver.register("list.create", list.create);
		transceiver.register("list.remove", (DATA) => list.remove(DATA, data.configuration.list_remove_remind), true);
		transceiver.register("list.show", list.alter_send, true);
		transceiver.register("list.alter", list.alter_receive);
		transceiver.register("list.edit_item", list.prepare, true);

		// 注册todo命令
		transceiver.register("todo.delete", (DATA) => todo.deleteItem(DATA, data.configuration.item_delete_remind), true);
		transceiver.register("todo.accomplish", todo.accomplish, true);
		transceiver.register("todo.shut", todo.shut, true);
		transceiver.register("todo.gaze", todo.gaze, true);
		transceiver.register("todo.undo", todo.gaze, true);
		transceiver.register("todo.change", todo.change);
		transceiver.register("todo.remove", todo.remove, true);
		transceiver.register("todo.edit", todo.edit);
		transceiver.register("todo.change_view", () => { profile.changeTree(); refresher.emit("list"); });

		// 注册done命令
		transceiver.register("done.redo", done.redo, true);
		transceiver.register("done.clear", done.clear, true);

		// 注册fail命令
		transceiver.register("fail.restart", fail.restart, true);
		transceiver.register("fail.restart_all", fail.restartAll, true);
		transceiver.register("fail.delete", (DATA) => fail.deleteItem(DATA, data.configuration.item_delete_remind), true);
	}
}

namespace refresher {
	const read = 2 ** 6;
	const page = 2 ** 5;
	const hint = 2 ** 4;
	const task = 2 ** 3;
	const todo = 2 ** 2;
	const done = 2 ** 1;
	const fail = 2 ** 0;

	/**
	 * 解析刷新数据
	 * @param type 刷新类型
	 * @param action 类型行为
	 * @returns 刷新码
	 */
	export function emit(type?: string, action?: string): void {
		let code: number = 0;

		switch (type) {
			case "task":
				code += page;
				code += task;
				break;

			case "list":
				code += page;
				code += todo;
				break;

			case "item":
				switch (action) {
					case "edit":
						code += page;
						code += todo;
						break;

					case "done":
						code += page;
						code += hint;
						code += todo;
						code += done;
						break;

					case "fail":
						code += page;
						code += hint;
						code += todo;
						code += fail;
						break;

					case "gaze":
						code += todo;
						break;

					case "delete":
						code += page;
						code += todo;
						code += fail;
						break;

					case "clear":
						code += page;
						code += done;
						break;

					case "remake":
						code += page;
						code += fail;
						break;
				}
				break;

			case "entry":
				switch (action) {
					case "change":
						code += todo;
						break;

					case "remove":
						code += page;
						code += hint;
						code += todo;
						break;
				}
				break;

			case "side":
				code += hint;
				code += task;
				code += todo;
				code += done;
				code += fail;
				break;

			case "page":
				code += page;
				break;

			case "view":
				code += page;
				code += hint;
				code += task;
				code += todo;
				code += done;
				code += fail;
				break;

			default:
				if (!type) code = Number.MAX_SAFE_INTEGER;
				break;
		}

		if (!code) {
			message.show("error", "刷新命令\"" + type + (action ? "\"+\"" + action : "") + "\"无效！");
		} else {
			parse(code);
		}
	}

	/**
	 * 刷新
	 * @param code 刷新码
	 */
	function parse(code: any): void {
		if (code & read) file.side.read();
		if (code & page) view.page.refresh();
		if (code & hint) view.hint.refresh(data.list.todo);
		if (code & task) view.tree.refresh(data.task.task, "task_tree");
		if (code & todo) view.tree.refresh({ todo: data.list.todo, profile: data.profile, empty_list: data.configuration.empty_list }, "todo_tree");
		if (code & done) view.tree.refresh(data.list.done, "done_tree");
		if (code & fail) view.tree.refresh(data.list.fail, "fail_tree");
	}
}
