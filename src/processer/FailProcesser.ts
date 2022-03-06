/* 模块调用 */
import { Transceiver, Message, Time } from "../Tool";
import { Data } from "../DataCenter";

export namespace FailProcesser {
	/**
	 * 重启事项
	 * @param item 事项对象
	 */
	export function Restart(item: any): void {
		let item_data = Data.Copy(Data.List.fail[item.id]);
		item_data.time = Time.Parse(new Date());
		item_data.cycle = "secular";
		item_data.gaze = false;
		if (!(item_data.type in Data.Profile.list)) item_data.type = "__untitled";
		Data.List.todo[item.id] = item_data;

		delete Data.List.fail[item.id];

		Transceiver.Send("view.todo");
		Transceiver.Send("view.fail");
	}

	/**
	 * 重启所有事项
	 */
	export async function RestartAll(): Promise<void> {
		if (await Message.Show("information", "确认重启全部失效事项吗？", "确认", "取消") == "确认") {
			for (let id in Data.List.fail) Restart({ id: id });
		}
	}

	/**
	 * 删除事项
	 * @param item 事项对象
	 */
	export async function Delete(item: any): Promise<void> {
		if (await Message.Show("information", "确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消") == "确定") {
			delete Data.List.fail[item.id];
			Transceiver.Send("view.fail");
		}
	}
}
