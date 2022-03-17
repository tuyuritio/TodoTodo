/* 模块调用 */
import { Inputer, Transceiver } from "../Tool";

export namespace OperationInputer {
	/**
	 * 显示清单操作面板
	 * @param empty_list 是否显示空清单
	 */
	export function Start(todo_data: any, empty_list: boolean, tree_type: boolean) {
		const quantity = Object.keys(todo_data).length;
		const box = Inputer.Pick("清单操作面板", "", quantity ? "剩余待办 : " + quantity + "件" : "已完成所有事项！");

		let operation: Inputer.PickItem[] = [];
		operation.push(new Inputer.PickItem("新增事项", "todo.load"));
		operation.push(new Inputer.PickItem("创建清单", "list.load"));
		operation.push(new Inputer.PickItem("建立任务", "task.load"));

		if (tree_type) {
			if (empty_list) {
				operation.push(new Inputer.PickItem("隐藏空清单", "list.empty"));
			} else {
				operation.push(new Inputer.PickItem("显示空清单", "list.empty"));
			}

			operation.push(new Inputer.PickItem("以列表显示待办事项", "view.change"));
		} else {
			operation.push(new Inputer.PickItem("以清单划分待办事项", "view.change"));
		}

		box.items = operation;

		box.onDidChangeSelection(item => {
			Transceiver.Send(String(item[0].information));
			box.hide();
		});

		box.show();
	}
}
