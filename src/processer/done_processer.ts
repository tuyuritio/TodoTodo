/* 模块调用 */
import { transceiver, message, date } from "../tool";
import { data } from "../data_center";

export namespace done_processer {
	/**
	 * 重做事项
	 * @param item 事项对象
	 */
	export function redo(item: any): void {
		let item_data = data.copy(data.list.done[item.id]);
		item_data.time = date.parse(new Date());
		item_data.cycle = "secular";
		item_data.gaze = false;
		if (!(item_data.type in data.profile.list)) item_data.type = "__untitled";
		data.list.todo[item.id] = item_data;

		delete data.list.done[item.id];

		transceiver.send("view.todo");
		transceiver.send("view.done");
		transceiver.send("view.hint");
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
		}
	}
}
