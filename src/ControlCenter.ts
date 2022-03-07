/* 模块调用 */
import { Transceiver, Action } from "./Tool";
import { FileInterface as File } from "./interface/FileInterface";
import { WorkspaceInterface as Workspace } from "./interface/WorkspaceInterface";
import { ProfileProcesser as Profile } from "./processer/ProfileProcesser";
import { TaskProcesser as Task } from "./processer/TaskProcesser";
import { ListProcesser as List } from "./processer/ListProcesser";
import { TodoProcesser as Todo, EntryProcesser as Entry } from "./processer/TodoProcesser";
import { DoneProcesser as Done } from "./processer/DoneProcesser";
import { FailProcesser as Fail } from "./processer/FailProcesser";
import { OperationInputer } from "./input/OperationInputer";
import { TaskInputer } from "./input/TaskInputer";
import { ListInputer } from "./input/ListInputer";
import { ItemInputer } from "./input/ItemInputer";
import { EntryInputer } from "./input/EntryInputer";
import { TaskTree } from "./tree/TaskTree";
import { TodoTree } from "./tree/TodoTree";
import { DoneTree } from "./tree/DoneTree";
import { FailTree } from "./tree/FailTree";
import { Data } from "./DataCenter";

export namespace Controller {
	/**
	 * 初始化控制器
	 * @param context 扩展上下文
	 */
	export function Initialize(context: any): void {
		Transceiver.Initialize(context);							// 初始化收发器
		Communicator.Initialize();									// 初始化通信器

		Workspace.Load();											// 加载工作区数据
		File.Read();												// 读取本地数据

		TaskTree.Initialize();										// 建立Task视图
		TodoTree.Initialize();										// 建立Todo视图
		DoneTree.Initialize();										// 建立Done视图
		FailTree.Initialize();										// 建立Fail视图

		Workspace.Update();											// 检测工作区数据
		Action.Cycle(List.ShutOverdue);								// 检测逾期事项
		Action.Cycle(Task.CheckAll);								// 检测每日任务
	}

	/**
	 * 终止扩展并保存数据
	 */
	export function Terminate(): void {
		File.Write();
	}
}

namespace Communicator {
	/**
	 * 初始化通信器
	 */
	export function Initialize(): void {
		// 注册file命令
		Transceiver.Register("file.write", File.Write, true);
		Transceiver.Register("file.read", () => {
			File.Read();
			Transceiver.Send("view.task");
			Transceiver.Send("view.todo");
			Transceiver.Send("view.fail");
			Transceiver.Send("view.done");
		}, true);

		// 注册view命令
		Transceiver.Register("view.task", () => TaskTree.ParseData(Data.Task.task));
		Transceiver.Register("view.todo", () => TodoTree.ParseData(Data.List.todo, Data.Profile));
		Transceiver.Register("view.done", () => DoneTree.ParseData(Data.List.done));
		Transceiver.Register("view.fail", () => FailTree.ParseData(Data.List.fail));
		Transceiver.Register("view.change", Profile.ChangeTree);

		// 注册input命令
		Transceiver.Register("input.panel", () => OperationInputer.Start(Data.List.todo, Data.Profile.empty_list, Data.Profile.tree_type), true);
		Transceiver.Register("input.task", TaskInputer.Start);
		Transceiver.Register("input.list", ListInputer.Start);
		Transceiver.Register("input.item", ItemInputer.Start);
		Transceiver.Register("input.entry", EntryInputer.Start);

		// 注册task命令
		Transceiver.Register("task.load", Task.Load, true);
		Transceiver.Register("task.adjust", Task.Adjust);
		Transceiver.Register("task.terminate", Task.Terminate, true);
		Transceiver.Register("task.change", Task.Change, true);
		Transceiver.Register("task.archive", Task.Archive, true);

		// 注册list命令
		Transceiver.Register("list.load", List.Load, true);
		Transceiver.Register("list.alter", List.Alter);
		Transceiver.Register("list.remove", List.Remove, true);
		Transceiver.Register("list.empty", Profile.ChangeEmpty);

		// 注册todo命令
		Transceiver.Register("todo.load", Todo.Load, true);
		Transceiver.Register("todo.edit", Todo.Edit);
		Transceiver.Register("todo.delete", Todo.Delete, true);
		Transceiver.Register("todo.accomplish", Todo.Accomplish, true);
		Transceiver.Register("todo.shut", Todo.Shut, true);
		Transceiver.Register("todo.gaze", Todo.Gaze, true);
		Transceiver.Register("todo.undo", Todo.Gaze, true);

		// 注册entry命令
		Transceiver.Register("entry.add", Entry.Load, true);
		Transceiver.Register("entry.load", Entry.Load, true);
		Transceiver.Register("entry.edit", Entry.Edit);
		Transceiver.Register("entry.change", Entry.Change, true);
		Transceiver.Register("entry.delete", Entry.Delete, true);

		// 注册done命令
		Transceiver.Register("done.redo", Done.Redo, true);
		Transceiver.Register("done.clear", Done.Clear, true);

		// 注册fail命令
		Transceiver.Register("fail.restart", Fail.Restart, true);
		Transceiver.Register("fail.delete", Fail.Delete, true);
	}
}
