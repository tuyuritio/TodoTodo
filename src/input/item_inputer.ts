/* 模块调用 */
import { code, date, inputer, transceiver } from "../tool";

export namespace item_inputer {
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
	export function start(lists: any, priority: number, id?: string, item?: any) {
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
			item_id = code.generate(8);
			item_label = "";
			item_type = "";
			item_priority = "";
			item_cycle = "";
			item_time = date.parse(new Date());			// 用于时间输入的默认填充
			item_entry = {};
		}

		editLabel();
	}

	/**
	 * 编辑事项名称
	 */
	function editLabel(): void {
		let box = inputer.text(title, item_label, "事项名称", "请输入事项名称", total_option, 1);

		box.onDidAccept(() => {
			item_label = box.value;

			if (item_label.replace(/\s/g, "") != "") {
				editType();
			} else {
				box.validationMessage = "事项名称不能为空！";
			}
		});

		box.show();
	}

	/**
	 * 编辑事项类别
	 */
	function editType(): void {
		let box = inputer.pick(title, item_type != "" ? type_list[item_type].label : "", "事项类别", total_option, 2);

		let list: inputer.PickItem[] = [];
		for (let id in type_list) {
			let index: number = list.length;
			let list_data = type_list[id];
			while (index > 0 && list_data.priority > type_list[String(list[index - 1].information)].priority) {
				list[index] = list[index - 1];
				index--;
			}
			list[index] = new inputer.PickItem(type_list[id].label, id);
		}
		box.items = list;

		box.onDidChangeSelection(item => {
			item_type = String(item[0].information);
			editPriority();
		});

		box.show();
	}

	/**
	 * 编辑优先层级
	 */
	function editPriority(): void {
		let box = inputer.pick(title, String(item_priority), "优先层级", total_option, 3);

		let priorities: inputer.PickItem[] = [];
		for (let index = 0; index <= maximum_priority + 1; index++) {
			priorities.push(new inputer.PickItem(String(index)));
		}
		box.items = priorities;

		box.onDidChangeSelection(item => {
			item_priority = Number(item[0].label);
			editCycle();
		});

		box.show();
	}

	/**
	 * 编辑事项周期
	 */
	function editCycle(): void {
		let cycles: any = { secular: "长期", once: "单次", daily: "每日", weekly: "每周" }

		let box = inputer.pick(title, cycles[item_cycle], "事项周期", total_option, 4);
		box.items = [new inputer.PickItem("长期"), new inputer.PickItem("单次"), new inputer.PickItem("每日"), new inputer.PickItem("每周")];

		box.onDidChangeSelection(item => {
			let time: Date = new Date();
			edit_date = date.textualize(time, "date");
			edit_time = date.textualize(time).substring(11, 16);

			switch (item[0].label) {
				case "长期":
					item_cycle = "secular";
					box.hide();
					consolidate();
					break;

				case "单次":
					item_cycle = "once";
					editDate();
					break;

				case "每日":
					item_cycle = "daily";
					editTime();
					break;

				case "每周":
					item_cycle = "weekly";
					editWeekday();
					break;
			}
		});

		box.show();
	}

	/**
	 * 编辑截止周次
	 */
	function editWeekday(): void {
		let weekday: string[] = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

		let box = inputer.pick(title, weekday[new Date(item_time).getDay()], "截止周次", total_option, 4);
		box.items = [new inputer.PickItem("周日"), new inputer.PickItem("周一"), new inputer.PickItem("周二"), new inputer.PickItem("周三"), new inputer.PickItem("周四"), new inputer.PickItem("周五"), new inputer.PickItem("周六")];

		box.onDidChangeSelection(item => {
			let time: Date = new Date();
			time.setDate(time.getDate() - time.getDay() + weekday.indexOf(item[0].label));
			if (time < new Date()) time.setDate(time.getDate() + 7);

			edit_date = date.textualize(time, "date");
			editTime();
		});

		box.show();
	}

	/**
	 * 编辑截止日期
	 */
	function editDate(): void {
		let box = inputer.text(title, date.textualize(item_time, "date"), "截止日期", "请输入截止日期(格式: YYYY/MM/DD)", total_option, 4);

		box.onDidAccept(() => {
			edit_date = box.value;
			let check: string[] = edit_date.split("/");

			if (check.length == 3 && Number(check[0]) && Number(check[1]) && Number(check[2]) && date.parse(edit_date)) {
				let time: Date = new Date(edit_date);
				time.setDate(time.getDate() + 1);

				if (time > new Date()) {
					editTime();
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
	function editTime(): void {
		let box = inputer.text(title, date.textualize(item_time).substring(11, 16), "截止时间", "请输入截止时间(格式: HH:MM)", total_option, 4);

		box.onDidAccept(() => {
			edit_time = box.value;
			let check = edit_time.split(":");

			if (check.length == 2 && Number(check[0]) != NaN && Number(check[1]) != NaN && date.parse(edit_date + "-" + edit_time)) {
				let time: Date = new Date(edit_date + "-" + edit_time);

				if (item_cycle == "daily" && time < new Date()) {
					time.setDate(time.getDate() + 1);
					edit_date = date.textualize(time, "date");
				}

				if (time > new Date()) {
					box.hide();
					consolidate();
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
	function consolidate(): void {
		let data = {
			label: item_label,
			type: item_type,
			priority: item_priority,
			cycle: item_cycle,
			time: date.parse(edit_date + "-" + edit_time),
			entry: item_entry,
			gaze: false
		}

		transceiver.send("todo.edit", item_id, data);
	}
}
