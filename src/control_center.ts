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
import { edit_page } from "./view/page/edit_page";
import { task_tree } from "./view/tree/task_tree";
import { todo_tree } from "./view/tree/todo_tree";
import { done_tree } from "./view/tree/done_tree";
import { fail_tree } from "./view/tree/fail_tree";
import { hint_bar } from "./view/hint_bar";
import { data } from "./data_center";

export namespace controller {
	/**
	 * 初始化控制器
	 * @param context 扩展上下文
	 */
	export function initialize(context: any): void {
		transceiver.initialize(context);		// 初始化收发器
		communicator.initialize();				// 初始化通信器

		task_tree.initialize();					// 建立Task视图
		todo_tree.initialize();					// 建立Todo视图
		done_tree.initialize();					// 建立Done视图
		fail_tree.initialize();					// 建立Fail视图
		hint_bar.initialize();					// 建立Hint视图

		workspace.initialize();					// 初始化工作区数据
		file.initialize();						// 初始化本地数据

		action.cycle(list.shutOverdue);			// 检测逾期事项
		action.cycle(task.checkAll);			// 检测每日任务
	}

	/**
	 * 终止扩展并保存数据
	 */
	export function terminate(): void {
		file.side.write();
	}
}

namespace communicator {
	/**
	 * 初始化通信器
	 */
	export function initialize(): void {
		// 注册configuration命令
		transceiver.register("configuration.path_error", configuration.setPath);

		// 注册file命令
		transceiver.register("file.read", file.side.read, true);
		transceiver.register("file.write", file.side.write, true);

		// 注册view命令
		transceiver.register("view.page", () => edit_page.parseData(data.task.task, data.list.todo, data.profile.list_priority, data.configuration.add_action));
		transceiver.register("view.task", () => task_tree.parseData(data.task.task));
		transceiver.register("view.todo", () => todo_tree.parseData(data.list.todo, data.profile, data.configuration.empty_list));
		transceiver.register("view.done", () => done_tree.parseData(data.list.done));
		transceiver.register("view.fail", () => fail_tree.parseData(data.list.fail));
		transceiver.register("view.hint", () => hint_bar.parseData(data.list.todo));

		// 注册主页命令
		transceiver.register("page.show", () => edit_page.show(data.page));
		transceiver.register("page.close", edit_page.close);
		transceiver.register("page.post", edit_page.postToPage);
		transceiver.register("page.message", (DATA) => message.show(DATA.type, DATA.text));

		// 注册task命令
		transceiver.register("task.establish", task.establish, true);
		transceiver.register("task.adjust", task.adjust);
		transceiver.register("task.terminate", task.terminate, true);
		transceiver.register("task.change", task.change, true);
		transceiver.register("task.change_all", task.changeAll, true);
		transceiver.register("task.calendar", task.calendar, true);

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
		transceiver.register("todo.change", todo.change, true);
		transceiver.register("todo.remove", todo.remove, true);
		transceiver.register("todo.edit", todo.edit);
		transceiver.register("todo.change_view", profile.changeTree, true);

		// 注册done命令
		transceiver.register("done.redo", done.redo, true);
		transceiver.register("done.clear", done.clear, true);

		// 注册fail命令
		transceiver.register("fail.restart", fail.restart, true);
		transceiver.register("fail.restart_all", fail.restartAll, true);
		transceiver.register("fail.delete", (DATA) => fail.deleteItem(DATA, data.configuration.item_delete_remind), true);
	}
}
