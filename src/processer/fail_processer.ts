/* 模块调用 */
import { transceiver, message, date } from "../tool";
import { data } from "../data_center";

export namespace fail_processer {
	/**
	 * 重启事项
	 * @param item 事项对象
	 */
	export function restart(item: any): void {
		let item_data = data.copy(data.list.fail[item.id]);
		item_data.time = date.parse(new Date());
		item_data.cycle = "secular";
		item_data.gaze = false;
		if (!(item_data.type in data.profile.list)) item_data.type = "__untitled";
		data.list.todo[item.id] = item_data;

		delete data.list.fail[item.id];

		transceiver.send("view.todo");
		transceiver.send("view.fail");
		transceiver.send("view.hint");
	}

	/**
	 * 重启所有事项
	 * @returns 是否重启
	 */
	export async function restartAll(): Promise<void> {
		if (await message.show("information", "确认重启全部失效事项吗？", "确认", "取消") == "确认") {
			for (let id in data.list.fail) restart({ id: id });
		}
	}

	/**
	 * 删除事项
	 * @param item 事项对象
	 */
	export async function deleteItem(item: any): Promise<void> {
		if (await message.show("information", "确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消") == "确定") {
			delete data.list.fail[item.id];
			transceiver.send("view.fail");
		}
	}
}
