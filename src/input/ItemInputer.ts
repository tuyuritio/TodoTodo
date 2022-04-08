/* 模块调用 */
import { Code, Time, Inputer, Transceiver } from "../Tool";

export namespace ItemInputer {
	let title: string;
	let total_option_1: number = 4;
	let total_option_2: number = 7;

	let type_list: any;
	let maximum_priority: number;

	let item_id: string;
	let item_label: string;
	let item_type: string;
	let item_priority: number;
	let item_cycle: number;
	let item_time: number;
	let item_entry: any;

	let edit_date: string;
	let edit_time: string;

	/**
	 * 显示事项编辑器
	 * @param lists 清单列表
	 * @param priority 事项最大优先层级
	 * @param id 事项ID
	 * @param item 事项数据
	 */
	export function Start(lists: any, priority: number, id?: string, item?: any) {
		type_list = lists;
		maximum_priority = priority;

		if (id) {
			title = "编辑事项";
			item_id = id;
			item_label = item.label;
			item_type = item.type;
			item_priority = item.priority;
			item_cycle = item.cycle;
			item_time = item.time;
			item_entry = item.entry;
		} else {
			title = "新建事项";
			item_id = Code.Generate(8);
			item_label = "";
			item_type = "";
			item_priority = -1;
			item_cycle = -2;
			item_time = -1;
			item_entry = {};
		}

		EditLabel();
	}

	/**
	 * 编辑事项名称
	 */
	function EditLabel(): void {
		const box = Inputer.Text(title, item_label, "事项名称", "请输入事项名称", total_option_1, 1);

		box.onDidAccept(() => {
			item_label = box.value;

			if (item_label.replace(/\s/g, "") != "") {
				EditType();
			} else {
				box.validationMessage = "事项名称不能为空！";
			}
		});

		box.show();
	}

	/**
	 * 编辑事项类别
	 */
	function EditType(): void {
		const box = Inputer.Pick(title, item_type != "" ? type_list[item_type].label : "", "事项类别", total_option_1, 2);

		let list: Inputer.PickItem[] = [];
		for (const id in type_list) {
			let index: number = list.length;
			const list_data = type_list[id];
			while (index > 0 && list_data.priority > type_list[String(list[index - 1].information)].priority) {
				list[index] = list[index - 1];
				index--;
			}
			list[index] = new Inputer.PickItem(type_list[id].label, id);
		}
		box.items = list;

		box.onDidChangeSelection(item => {
			item_type = String(item[0].information);
			EditPriority();
		});

		box.show();
	}

	/**
	 * 编辑优先层级
	 */
	function EditPriority(): void {
		const box = Inputer.Pick(title, String(item_priority + 1 ? item_priority : ""), "优先层级", total_option_1, 3);

		let priorities: Inputer.PickItem[] = [];
		for (let index = 0; index <= maximum_priority + 1; index++) {
			priorities.push(new Inputer.PickItem(String(index)));
		}
		box.items = priorities;

		box.onDidChangeSelection(item => {
			item_priority = Number(item[0].label);
			ChooseProperty();
		});

		box.show();
	}

	/**
	 * 选择事项性质
	 */
	function ChooseProperty(): void {
		let property: string;
		switch (item_cycle) {
			case -2:
				property = "";
				break;

			case -1:
				property = "长期事项";
				break;

			case 0:
				property = "单次事项";
				break;

			default:
				property = "周期事项";
				break;
		}

		const box = Inputer.Pick(title, property, "事项性质", total_option_1, 4);

		box.items = [new Inputer.PickItem("长期事项"), new Inputer.PickItem("单次事项"), new Inputer.PickItem("周期事项")];

		box.onDidChangeSelection((item) => {
			switch (item[0].label) {
				case "长期事项":
					item_cycle = -1;
					item_time = Time.Parse(new Date());

					box.hide();
					Consolidate();
					break;

				case "单次事项":
					item_cycle = 0;

				case "周期事项":
					EditDate();
					break;
			}
		});

		box.show();
	}

	/**
	 * 编辑截止日期
	 */
	function EditDate(): void {
		if (item_time == -1) item_time = Time.Parse(new Date());
		const box = Inputer.Text(title, Time.Textualize(item_time, "date"), "截止日期(格式 : YYYY/MM/DD)", "请输入截止日期", total_option_2, 5);

		box.onDidAccept(() => {
			edit_date = box.value;
			const check: string[] = edit_date.split("/");

			if (check.length == 3 && Number(check[0]) && Number(check[1]) && Number(check[2]) && Time.Parse(edit_date)) {
				let time: Date = new Date(edit_date);
				time.setDate(time.getDate() + 1);

				if (time > new Date()) {
					EditTime();
				} else {
					box.validationMessage = "日期已过！";
				}
			} else {
				box.validationMessage = "日期格式错误！";
			}
		});

		box.show();
	}

	/**
	 * 编辑截止时间
	 */
	function EditTime(): void {
		const box = Inputer.Text(title, Time.Textualize(item_time).substring(11, 16), "截止时间(格式 : HH:MM)", "请输入截止时间", total_option_2, 6);

		box.onDidAccept(() => {
			edit_time = box.value;
			const check = edit_time.split(":");

			if (check.length == 2 && Number(check[0]) != NaN && Number(check[1]) != NaN && Time.Parse(edit_date + "-" + edit_time)) {
				let time: Date = new Date(edit_date + "-" + edit_time);

				if (time > new Date()) {
					item_time = Time.Parse(edit_date + "-" + edit_time);

					if (item_cycle) {
						EditCycle();
					} else {
						box.hide();
						Consolidate();
					}
				} else {
					box.validationMessage = "时间已过！";
				}
			} else {
				box.validationMessage = "时间格式错误！";
			}
		});

		box.show();
	}

	/**
	 * 编辑事项周期
	 */
	function EditCycle(): void {
		const box = Inputer.Text(title, item_cycle + 2 ? String(item_cycle) : "", "单位 : 日", "请输入周期", total_option_2, 7);

		box.onDidAccept(() => {
			item_cycle = Number(box.value);

			if (item_cycle > 0) {
				box.hide();
				Consolidate();
			} else {
				box.validationMessage = "周期必须大于0！";
			}
		});

		box.show();
	}

	/**
	 * 整合输入数据
	 */
	function Consolidate(): void {
		let data = {
			label: item_label,
			type: item_type,
			priority: item_priority,
			cycle: item_cycle,
			time: item_time,
			entry: item_entry,
			gaze: false
		}

		Transceiver.Send("todo.edit", item_id, data);
	}
}
