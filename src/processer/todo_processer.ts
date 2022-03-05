/* 模块调用 */
import { code, transceiver, date, message } from "../tool";
import { data } from "../data_center";

export namespace todo_processer {
	/**
	 * 准备编辑事项
	 * @param item 事项对象
	 */
	export function load(item?: any): void {
		let maximum_priority: number = 0;

		for (let id in data.list.todo) {
			let item_data = data.list.todo[id];
			if (item_data.priority > maximum_priority) maximum_priority = item_data.priority;
		}

		if (item) {
			transceiver.send("input.item", data.profile.list, maximum_priority, item.id, data.list.todo[item.id]);
		} else {
			transceiver.send("input.item", data.profile.list, maximum_priority);
		}
	}

	/**
	 * 编辑事项
	 * @param id 事项ID
	 * @param item 事项数据
	 */
	export function edit(id: string, item: any): void {
		data.list.todo[id] = item;

		transceiver.send("view.todo");
		transceiver.send("view.hint");
	}

	/**
	 * 删除事项
	 * @param item 事项对象
	 */
	export async function deleteItem(item: any): Promise<void> {
		if (await message.show("information", "确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消") == "确认") {
			delete data.list.todo[item.id];
			transceiver.send("view.todo");
			transceiver.send("view.hint");
		}
	}

	/**
	 * 完成事项
	 * @param item 事项对象
	 */
	export function accomplish(item: any): void {
		let item_data = data.copy(data.list.todo[item.id]);

		if (item_data.cycle == "daily" || item_data.cycle == "weekly") {
			newCycle(item_data);
		}

		item_data.time = date.parse(new Date());
		delete item_data.cycle;
		delete item_data.gaze;
		data.list.done[item.id] = item_data;

		delete data.list.todo[item.id];

		transceiver.send("view.todo");
		transceiver.send("view.done");
		transceiver.send("view.hint");
	}

	/**
	 * 关闭事项
	 * @param item 事项对象
	 */
	export function shut(item: any): void {
		let item_data = data.copy(data.list.todo[item.id]);

		if (item_data.cycle == "daily" || item_data.cycle == "weekly") {
			newCycle(item_data);
		}

		item_data.time = date.parse(new Date());
		delete item_data.cycle;
		delete item_data.gaze;
		data.list.fail[item.id] = item_data;

		delete data.list.todo[item.id];

		transceiver.send("view.todo");
		transceiver.send("view.fail");
		transceiver.send("view.hint");
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
}

export namespace entry_processer {
	/**
	 * 准备编辑条目
	 * @param element 条目对象
	 */
	export function load(element: any) {
		if (element.root) {
			transceiver.send("input.entry", element.root, element.id, data.list.todo[element.root].entry[element.id]);
		} else {
			transceiver.send("input.entry", element.id);
		}
	}

	/**
	 * 编辑条目
	 * @param root 事项ID
	 * @param id 条目ID
	 * @param entry 条目数据
	 */
	export function edit(root: string, id: string, entry: any): void {
		data.list.todo[root].entry[id] = {
			label: entry.label,
			content: entry.content,
			done: false
		}
		transceiver.send("view.todo");
	}

	/**
	 * 删除条目
	 * @param entry 条目对象
	 */
	export function deleteEntry(entry: any) {
		delete data.list.todo[entry.root].entry[entry.id];
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
}
