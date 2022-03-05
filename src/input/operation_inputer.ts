/* 模块调用 */
import { inputer, transceiver } from "../tool";

export namespace operation_inputer {
	/**
	 * 显示清单操作面板
	 * @param empty_list 是否显示空清单
	 */
	export function start(empty_list: boolean) {
		let box = inputer.pick("清单操作面板", "", "操作选项");

		let operation: inputer.PickItem[] = [];
		operation.push(new inputer.PickItem("新增事项", "todo.load"));
		operation.push(new inputer.PickItem("建立任务", "task.load"));
		operation.push(new inputer.PickItem("创建清单", "list.load"));

		if (empty_list) {
			operation.push(new inputer.PickItem("隐藏空清单", "list.empty"));
		} else {
			operation.push(new inputer.PickItem("显示空清单", "list.empty"));
		}
		box.items = operation;

		box.onDidChangeSelection(item => {
			transceiver.send(String(item[0].information));
			box.hide();
		});

		box.show();
	}
}
