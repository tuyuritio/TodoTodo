/* 模块调用 */
import { data } from "../data_center";
import { transceiver, message } from "../tool";

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
			delete item_data.time;

			data.list.todo[item.id] = item_data;
		}
		transceiver.send("refresh", "item", "done");
	}

	/**
	 * 清空已办事项
	 */
	export async function clear(): Promise<void> {
		let if_clear: boolean = false;
		if (await message.show("information", "确认清空已办事项吗？", "确认", "取消") == "确认") if_clear = true;

		if (if_clear) {
			data.list.done = {};
			transceiver.send("refresh", "item", "clear");
		}
	}
}
