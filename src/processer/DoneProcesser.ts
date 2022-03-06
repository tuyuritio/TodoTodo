/* 模块调用 */
import { Transceiver, Message, Time } from "../Tool";
import { Data } from "../DataCenter";

export namespace DoneProcesser {
	/**
	 * 重做事项
	 * @param item 事项对象
	 */
	export function Redo(item: any): void {
		let item_data = Data.Copy(Data.List.done[item.id]);
		item_data.time = Time.Parse(new Date());
		item_data.cycle = "secular";
		item_data.gaze = false;
		if (!(item_data.type in Data.Profile.list)) item_data.type = "__untitled";
		Data.List.todo[item.id] = item_data;

		delete Data.List.done[item.id];

		Transceiver.Send("view.todo");
		Transceiver.Send("view.done");
	}

	/**
	 * 清空已办事项
	 */
	export async function Clear(): Promise<void> {
		let if_clear: boolean = false;
		if (await Message.Show("information", "确认清空已办事项吗？", "确认", "取消") == "确认") if_clear = true;

		if (if_clear) {
			Data.List.done = {};
			Transceiver.Send("view.done");
		}
	}
}
