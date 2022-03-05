/* 模块调用 */
import { transceiver, message, action } from "./tool";
import { file_interface as file } from "./interface/file_interface";
import { workspace_interface as workspace } from "./interface/workspace_interface";
import { profile_processer as profile } from "./processer/profile_processer";
import { task_processer as task } from "./processer/task_processer";
import { list_processer as list } from "./processer/list_processer";
import { todo_processer as todo, entry_processer as entry } from "./processer/todo_processer";
import { done_processer as done } from "./processer/done_processer";
import { fail_processer as fail } from "./processer/fail_processer";
import { operation_inputer } from "./input/operation_inputer";
import { task_inputer } from "./input/task_inputer";
import { list_inputer } from "./input/list_inputer";
import { item_inputer } from "./input/item_inputer";
import { entry_inputer } from "./input/entry_inputer";
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
		transceiver.initialize(context);							// 初始化收发器
		communicator.initialize();									// 初始化通信器

		workspace.load();											// 加载工作区数据
		file.read();												// 读取本地数据

		task_tree.initialize();										// 建立Task视图
		todo_tree.initialize();										// 建立Todo视图
		done_tree.initialize();										// 建立Done视图
		fail_tree.initialize();										// 建立Fail视图
		hint_bar.initialize(data.configuration.hint_position);		// 建立Hint视图

		workspace.update();											// 检测工作区数据
		action.cycle(list.shutOverdue);								// 检测逾期事项
		action.cycle(task.checkAll);								// 检测每日任务
	}

	/**
	 * 终止扩展并保存数据
	 */
	export function terminate(): void {
		file.write();
	}
}

namespace communicator {
	/**
	 * 初始化通信器
	 */
	export function initialize(): void {
		// 注册file命令
		transceiver.register("file.write", file.write, true);
		transceiver.register("file.read", () => {
			file.read();
			transceiver.send("view.task");
			transceiver.send("view.todo");
			transceiver.send("view.fail");
			transceiver.send("view.done");
			transceiver.send("view.hint");
		}, true);

		// 注册view命令
		transceiver.register("view.task", () => task_tree.parseData(data.task.task));
		transceiver.register("view.todo", () => todo_tree.parseData(data.list.todo, data.profile));
		transceiver.register("view.done", () => done_tree.parseData(data.list.done));
		transceiver.register("view.fail", () => fail_tree.parseData(data.list.fail));
		transceiver.register("view.hint", () => hint_bar.parseData(data.list.todo));
		transceiver.register("view.change", profile.changeTree, true);

		// 注册input命令
		transceiver.register("input.panel",()=> operation_inputer.start(data.profile.empty_list), true);
		transceiver.register("input.task", task_inputer.start);
		transceiver.register("input.list", list_inputer.start);
		transceiver.register("input.item", item_inputer.start);
		transceiver.register("input.entry", entry_inputer.start);

		// 注册task命令
		transceiver.register("task.load", task.load,true);
		transceiver.register("task.adjust", task.adjust);
		transceiver.register("task.terminate", task.terminate, true);
		transceiver.register("task.change", task.change, true);
		transceiver.register("task.change_all", task.changeAll, true);

		// 注册list命令
		transceiver.register("list.load", list.load, true);
		transceiver.register("list.alter", list.alter);
		transceiver.register("list.remove", list.remove, true);
		transceiver.register("list.empty", profile.changeEmpty, true);

		// 注册todo命令
		transceiver.register("todo.load", todo.load, true);
		transceiver.register("todo.edit", todo.edit);
		transceiver.register("todo.delete", todo.deleteItem, true);
		transceiver.register("todo.accomplish", todo.accomplish, true);
		transceiver.register("todo.shut", todo.shut, true);
		transceiver.register("todo.gaze", todo.gaze, true);
		transceiver.register("todo.undo", todo.gaze, true);

		// 注册entry命令
		transceiver.register("entry.add", entry.load, true);
		transceiver.register("entry.load", entry.load, true);
		transceiver.register("entry.edit", entry.edit);
		transceiver.register("entry.change", entry.change, true);
		transceiver.register("entry.delete", entry.deleteEntry, true);

		// 注册done命令
		transceiver.register("done.redo", done.redo, true);
		transceiver.register("done.clear", done.clear, true);

		// 注册fail命令
		transceiver.register("fail.restart", fail.restart, true);
		transceiver.register("fail.restart_all", fail.restartAll, true);
		transceiver.register("fail.delete", fail.deleteItem, true);
	}
}
