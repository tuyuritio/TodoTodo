/* 模块调用 */
import { data } from "../data_center";
import { transceiver, message, date } from "../tool";

export namespace done_processer {
	/**
	 * 重做事项
	 * @param item 事项对象
	 */
	export function redo(item: any): void {
		let original_data = data.copy(data.list.done[item.id]);
		{
			delete data.list.done[item.id];

			let item_data = original_data;
			item_data.cycle = "secular";
			item_data.gaze = false;
			item_data.time = date.parse(new Date());

			data.list.todo[item.id] = item_data;

			if (!(item_data.type in data.profile.list_priority)) {
				transceiver.send("list.create", item_data.type);
			}
		}
		transceiver.send("view.todo");
		transceiver.send("view.done");
		transceiver.send("view.hint");
		transceiver.send("page.close");
	}

	/**
	 * 清空已办事项
	 */
	export async function clear(): Promise<void> {
		let if_clear: boolean = false;
		if (await message.show("information", "确认清空已办事项吗？", "确认", "取消") == "确认") if_clear = true;

		if (if_clear) {
			data.list.done = {};
			transceiver.send("view.done");
			transceiver.send("page.close");
		}
	}
}
