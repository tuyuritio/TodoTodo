/* 模块调用 */
import { code, transceiver, date, message } from "../tool";
import { data } from "../data_center";

export namespace todo_processer {
	/**
	 * 编辑事项
	 * @param item 事项对象
	 */
	export function edit(item: any): void {
		let id = item.id;
		delete item.id;
		item.gaze = false;
		data.list.todo[id] = item;

		if (!(item.type in data.profile.list_priority)) {
			transceiver.send("list.create", item.type);
		}

		transceiver.send("view.todo");
		transceiver.send("view.hint");
		transceiver.send("view.page");
	}

	/**
	 * 删除事项
	 * @param item 事项对象
	 * @param if_remind 是否确认删除
	 */
	export async function deleteItem(item: any, if_remind: boolean): Promise<void> {
		let if_delete: boolean = true;
		if (if_remind && await message.show("information", "确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消") == "取消") {
			if_delete = false;
		}

		if (if_delete) {
			delete data.list.todo[item.id];
			transceiver.send("view.todo");
			transceiver.send("view.hint");
			transceiver.send("page.close");
		}
	}

	/**
	 * 完成事项
	 * @param item 事项对象
	 */
	export function accomplish(item: any): void {
		let original_data = data.copy(data.list.todo[item.id]);
		{
			delete data.list.todo[item.id];

			let item_data = data.copy(original_data);
			item_data.time = date.parse(new Date());
			item_data.cycle = "once";
			delete item_data.gaze;

			data.list.done[item.id] = item_data;
		}

		if (original_data.cycle == "daily" || original_data.cycle == "weekly") {
			newCycle(original_data);
		}

		transceiver.send("view.todo");
		transceiver.send("view.done");
		transceiver.send("view.hint");
		transceiver.send("page.close");
	}

	/**
	 * 关闭事项
	 * @param item 事项对象
	 */
	export function shut(item: any): void {
		let original_data = data.copy(data.list.todo[item.id]);
		{
			delete data.list.todo[item.id];

			let item_data = data.copy(original_data);
			item_data.time = date.parse(new Date());
			item_data.cycle = "once";
			delete item_data.gaze;

			data.list.fail[item.id] = item_data;
		}

		if (original_data.cycle == "daily" || original_data.cycle == "weekly") {
			newCycle(original_data);
		}

		transceiver.send("view.todo");
		transceiver.send("view.fail");
		transceiver.send("view.hint");
		transceiver.send("page.close");
	}

	/**
	 * 新建下一个周期的循环事项
	 * @param cycle_item 循环事项对象
	 */
	export function newCycle(cycle_item: any): any {
		let current_time: Date = new Date();
		let cycle_time: Date = new Date(cycle_item.time);

		switch (cycle_item.cycle) {
			case "daily":
				do {
					cycle_time.setDate(cycle_time.getDate() + 1);
				} while (date.parse(cycle_time) < date.parse(current_time));
				break;

			case "weekly":
				do {
					cycle_time.setDate(cycle_time.getDate() + 7);
				} while (date.parse(cycle_time) < date.parse(current_time));
				break;
		}
		cycle_item.time = date.textualize(cycle_time);

		for (let id in cycle_item.entry) {
			cycle_item.entry[id].done = false;
			cycle_item.entry[code.generate(8)] = cycle_item.entry[id];
			delete cycle_item.entry[id];
		}

		data.list.todo[code.generate(8)] = cycle_item;

		return cycle_item;
	}

	/**
	 * 专注事项
	 * @param item 事项对象
	 */
	export function gaze(item: any): void {
		let item_data = data.list.todo[item.id];
		item_data.gaze = !item_data.gaze;

		transceiver.send("view.todo");
	}

	/**
	 * 变更条目状态
	 * @param entry 条目对象
	 */
	export function change(entry: any): void {
		let entry_data = data.list.todo[entry.root].entry[entry.id];

		entry_data.done = !entry_data.done;

		transceiver.send("view.todo");
	}

	/**
	 * 直接移除条目
	 * @param entry 条目对象
	 */
	export function remove(entry: any): void {
		delete data.list.todo[entry.root].entry[entry.id];
		transceiver.send("view.todo");
		transceiver.send("page.close");
	}
}
