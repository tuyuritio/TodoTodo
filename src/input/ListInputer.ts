/* 模块调用 */
import { Code, Inputer, Transceiver } from "../Tool";

export namespace ListInputer {
	let title: string;
	let total_option: number = 2;

	let maximum_priority: number;

	let list_id: string
	let list_label: string;
	let list_priority: number | string;

	/**
	 * 显示清单编辑器
	 * @param priority 清单最大优先层级
	 * @param id 清单ID
	 * @param list 清单数据
	 */
	export function Start(priority: number, id?: string, list?: any): void {
		maximum_priority = priority;

		if (id) {
			title = "修改清单";
			list_id = id;
			list_label = list.label;
			list_priority = list.priority;
		} else {
			title = "新建清单";
			list_id = Code.Generate(8);
			list_label = "";
			list_priority = "";
		}

		EditLabel();
	}

	/**
	 * 编辑清单名称
	 */
	function EditLabel(): void {
		const box = Inputer.Text(title, list_label, "清单名称", "请输入清单名称", total_option, 1);

		box.onDidAccept(() => {
			list_label = box.value;

			if (list_label.replace(/\s/g, "") != "") {
				EditPriority();
			} else {
				box.validationMessage = "清单名称不能为空！";
			}
		});

		box.show();
	}

	/**
	 * 编辑清单优先层级
	 */
	function EditPriority(): void {
		const box = Inputer.Pick(title, String(list_priority), "优先层级", total_option, 3);

		const priorities: Inputer.PickItem[] = [];
		for (let index = 0; index <= maximum_priority + 1; index++) {
			priorities.push(new Inputer.PickItem(String(index)));
		}
		box.items = priorities;

		box.onDidChangeSelection(item => {
			list_priority = Number(item[0].label);
			box.hide();
			Consolidate();
		});

		box.show();
	}

	/**
	 * 整合输入数据
	 */
	function Consolidate(): void {
		let data = {
			label: list_label,
			priority: list_priority
		}

		Transceiver.Send("list.alter", list_id, data);
	}
}
