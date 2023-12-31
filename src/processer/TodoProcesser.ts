/* 模块调用 */
import { Code, Transceiver, Time, Message } from "../Tool";
import { Data } from "../DataCenter";

export namespace TodoProcesser {
	/**
	 * 准备编辑事项
	 * @param item 事项对象
	 */
	export function Load(item?: any): void {
		let maximum_priority: number = 0;

		for (const id in Data.List.todo) {
			const item_data = Data.List.todo[id];
			if (item_data.priority > maximum_priority) maximum_priority = item_data.priority;
		}

		if (item) {
			Transceiver.Send("input.item", Data.List.type, maximum_priority, item.id, Data.List.todo[item.id]);
		} else {
			Transceiver.Send("input.item", Data.List.type, maximum_priority);
		}
	}

	/**
	 * 编辑事项
	 * @param id 事项ID
	 * @param item 事项数据
	 */
	export function Edit(id: string, item: any): void {
		Data.List.todo[id] = item;
		Transceiver.Send("view.todo");
		Transceiver.Send("file.write");
	}

	/**
	 * 删除事项
	 * @param item 事项对象
	 */
	export async function Delete(item: any): Promise<void> {
		if (await Message.Show("warning", "确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消") == "确认") {
			delete Data.List.todo[item.id];
			Transceiver.Send("view.todo");
			Transceiver.Send("file.write");
		}
	}

	/**
	 * 完成事项
	 * @param item 事项对象
	 */
	export function Accomplish(item: any): void {
		let item_data = item ? Data.Copy(Data.List.todo[item.id]) : undefined;

		if (item_data) {
			if (item_data.cycle > 0) Append(item_data);

			item_data.time = Time.Parse(new Date());
			delete item_data.cycle;
			delete item_data.gaze;
			Data.List.done[item.id] = item_data;

			delete Data.List.todo[item.id];

			Transceiver.Send("view.todo");
			Transceiver.Send("view.done");
			Transceiver.Send("file.write");
		}
	}

	/**
	 * 关闭事项
	 * @param item 事项对象
	 */
	export function Shut(item: any): void {
		let item_data = item ? Data.Copy(Data.List.todo[item.id]) : undefined;

		if (item_data) {
			if (item_data.cycle > 0) Append(item_data);

			item_data.time = Time.Parse(new Date());
			delete item_data.cycle;
			delete item_data.gaze;
			Data.List.fail[item.id] = item_data;

			delete Data.List.todo[item.id];

			Transceiver.Send("view.todo");
			Transceiver.Send("view.fail");
			Transceiver.Send("file.write");
		}
	}

	/**
	 * 追加循环事项
	 * @param cycle_item 循环事项对象
	 */
	export function Append(cycle_item: any): void {
		cycle_item = Data.Copy(cycle_item);

		const current_time: Date = new Date();
		let cycle_time: Date = new Date(cycle_item.time);

		do {
			cycle_time.setDate(cycle_time.getDate() + cycle_item.cycle);
		} while (Time.Parse(cycle_time) < Time.Parse(current_time));

		cycle_item.time = Time.Parse(cycle_time);
		cycle_item.gaze = false;

		for (const id in cycle_item.entry) {
			cycle_item.entry[id].done = false;
			cycle_item.entry[Code.Generate(8)] = cycle_item.entry[id];
			delete cycle_item.entry[id];
		}

		Data.List.todo[Code.Generate(8)] = cycle_item;
	}

	/**
	 * 跳过事项
	 * @param item 事项对象
	 */
	export async function Skip(item: any): Promise<void> {
		let item_data = item ? Data.Copy(Data.List.todo[item.id]) : undefined;

		if (item_data) {
			if (await Message.Show("information", "确认在本周期内跳过事项 \"" + item.label + "\" 吗？", "确认", "取消") == "确认") {
				delete Data.List.todo[item.id];
				if (item_data.cycle > 0) Append(item_data);

				Transceiver.Send("view.todo");
				Transceiver.Send("file.write");
			}
		}
	}

	/**
	 * 切换专注事项
	 * @param item 事项对象
	 */
	export function Gaze(item: any): void {
		let item_data = Data.List.todo[item.id];
		item_data.gaze = !item_data.gaze;

		Transceiver.Send("view.todo");
		Transceiver.Send("file.write");
	}
}

export namespace EntryProcesser {
	/**
	 * 准备编辑条目
	 * @param element 条目对象
	 */
	export function Load(element: any): void {
		if (element.root) {
			Transceiver.Send("input.entry", element.root, element.id, Data.List.todo[element.root].entry[element.id]);
		} else {
			Transceiver.Send("input.entry", element.id);
		}
	}

	/**
	 * 编辑条目
	 * @param root 事项ID
	 * @param id 条目ID
	 * @param entry 条目数据
	 */
	export function Edit(root: string, id: string, entry: any): void {
		Data.List.todo[root].entry[id] = {
			content: entry.content,
			done: entry.done
		}
		Transceiver.Send("view.todo");
		Transceiver.Send("file.write");
	}

	/**
	 * 删除条目
	 * @param entry 条目对象
	 */
	export function Delete(entry: any): void {
		delete Data.List.todo[entry.root].entry[entry.id];
		Transceiver.Send("view.todo");
		Transceiver.Send("file.write");
	}

	/**
	 * 变更条目状态
	 * @param entry 条目对象
	 */
	export function Change(entry: any): void {
		let entry_data = Data.List.todo[entry.root].entry[entry.id];
		entry_data.done = !entry_data.done;
		Transceiver.Send("view.todo");
		Transceiver.Send("file.write");
	}
}
