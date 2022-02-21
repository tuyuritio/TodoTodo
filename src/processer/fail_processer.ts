/* 模块调用 */
import { data } from "../data_center";
import { transceiver, message } from "../tool";

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
			delete item_data.time;

			data.list.todo[item.if_delete] = item_data;
		}
		transceiver.send("refresh", "item", "fail");
	}

	/**
	 * 重启所有事项
	 * @returns 是否重启
	 */
	export async function restartAll(): Promise<void> {
		let if_restart: boolean = false;
		if (await message.show("information", "确认重启全部失效事项吗？", "确认", "取消") == "确认") if_restart = true;

		if (if_restart) {
			fail_processer.restartAll();
			for (let id in data.list.fail) restart({ id: id });

			transceiver.send("refresh", "item", "remake");
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
			transceiver.send("refresh", "item", "delete");
		}
	}
}
