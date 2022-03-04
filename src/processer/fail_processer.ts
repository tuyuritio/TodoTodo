/* 模块调用 */
import { transceiver, message, date } from "../tool";
import { data } from "../data_center";

export namespace fail_processer {
	/**
	 * 重启事项
	 * @param item 事项对象
	 */
	export function restart(item: any): void {
		let original_data = data.copy(data.list.fail[item.id]);
		{
			delete data.list.fail[item.id];

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
		transceiver.send("view.fail");
		transceiver.send("view.hint");
		transceiver.send("page.close");
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
	 * @param if_remind 是否确认删除
	 */
	export async function deleteItem(item: any, if_remind: boolean): Promise<void> {				// 跟delete重名了，我也很无奈
		let if_delete: boolean = true;
		if (if_remind && await message.show("information", "确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消") == "取消") {
			if_delete = false;
		}

		if (if_delete) {
			delete data.list.fail[item.id];
			transceiver.send("view.fail");
			transceiver.send("page.close");
		}
	}
}
