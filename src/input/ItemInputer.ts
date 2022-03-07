/* 模块调用 */
import { Code, Time, Inputer, Transceiver } from "../Tool";

export namespace ItemInputer {
	let title: string;
	let total_option: number = 4;

	let type_list: any;
	let maximum_priority: number;

	let item_id: string;
	let item_label: string;
	let item_type: string;
	let item_priority: number | string;
	let item_cycle: string;
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
			item_priority = "";
			item_cycle = "";
			item_time = 0;
			item_entry = {};
		}

		EditLabel();
	}

	/**
	 * 编辑事项名称
	 */
	function EditLabel(): void {
		let box = Inputer.Text(title, item_label, "事项名称", "请输入事项名称", total_option, 1);

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
		let box = Inputer.Pick(title, item_type != "" ? type_list[item_type].label : "", "事项类别", total_option, 2);

		let list: Inputer.PickItem[] = [];
		for (let id in type_list) {
			let index: number = list.length;
			let list_data = type_list[id];
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
		let box = Inputer.Pick(title, String(item_priority), "优先层级", total_option, 3);

		let priorities: Inputer.PickItem[] = [];
		for (let index = 0; index <= maximum_priority + 1; index++) {
			priorities.push(new Inputer.PickItem(String(index)));
		}
		box.items = priorities;

		box.onDidChangeSelection(item => {
			item_priority = Number(item[0].label);
			EditCycle();
		});

		box.show();
	}

	/**
	 * 编辑事项周期
	 */
	function EditCycle(): void {
		let cycles: any = { secular: "长期", once: "单次", daily: "每日", weekly: "每周" }

		let box = Inputer.Pick(title, item_time ? cycles[item_cycle] : "", "事项周期", total_option, 4);
		box.items = [new Inputer.PickItem("长期"), new Inputer.PickItem("单次"), new Inputer.PickItem("每日"), new Inputer.PickItem("每周")];

		box.onDidChangeSelection(item => {
			let time: Date = new Date();

			switch (item[0].label) {
				case "长期":
					item_cycle = "secular";
					item_time = Time.Parse(time);
					box.hide();
					Consolidate();
					break;

				case "单次":
					item_cycle = "once";
					EditDate();
					break;

				case "每日":
					item_cycle = "daily";
					edit_date = Time.Textualize(time, "date");
					EditTime();
					break;

				case "每周":
					item_cycle = "weekly";
					EditWeekday();
					break;
			}
		});

		box.show();
	}

	/**
	 * 编辑截止周次
	 */
	function EditWeekday(): void {
		let weekday: string[] = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

		let box = Inputer.Pick(title, weekday[new Date(item_time).getDay()], "截止周次", total_option, 4, true);
		box.items = [
			new Inputer.PickItem("周日", undefined, "7"),
			new Inputer.PickItem("周一", undefined, "1"),
			new Inputer.PickItem("周二", undefined, "2"),
			new Inputer.PickItem("周三", undefined, "3"),
			new Inputer.PickItem("周四", undefined, "4"),
			new Inputer.PickItem("周五", undefined, "5"),
			new Inputer.PickItem("周六", undefined, "6")
		];

		box.onDidChangeSelection(item => {
			let time: Date = new Date();
			time.setDate(time.getDate() - time.getDay() + weekday.indexOf(item[0].label));
			if (time < new Date()) time.setDate(time.getDate() + 7);

			edit_date = Time.Textualize(time, "date");
			EditTime();
		});

		box.show();
	}

	/**
	 * 编辑截止日期
	 */
	function EditDate(): void {
		let box = Inputer.Text(title, Time.Textualize(item_time, "date"), "截止日期", "请输入截止日期(格式: YYYY/MM/DD)", total_option, 4);

		box.onDidAccept(() => {
			edit_date = box.value;
			let check: string[] = edit_date.split("/");

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
		let box = Inputer.Text(title, Time.Textualize(item_time).substring(11, 16), "截止时间", "请输入截止时间(格式: HH:MM)", total_option, 4);

		box.onDidAccept(() => {
			edit_time = box.value;
			let check = edit_time.split(":");

			if (check.length == 2 && Number(check[0]) != NaN && Number(check[1]) != NaN && Time.Parse(edit_date + "-" + edit_time)) {
				let time: Date = new Date(edit_date + "-" + edit_time);

				if (item_cycle == "daily" && time < new Date()) {
					time.setDate(time.getDate() + 1);
					edit_date = Time.Textualize(time, "date");
				}

				if (time > new Date()) {
					item_time = Time.Parse(edit_date + "-" + edit_time);
					box.hide();
					Consolidate();
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
