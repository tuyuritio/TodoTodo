/* 模块调用 */
import { Transceiver, Message, Time } from "../Tool";
import { Data } from "../DataCenter";

export namespace DoneProcesser {
	/**
	 * 重做事项
	 * @param item 事项对象
	 */
	export function Redo(item: any): void {
		let item_data = item ? Data.Copy(Data.List.done[item.id]) : undefined;

		if (item_data) {
			item_data.time = Time.Parse(new Date());
			item_data.cycle = -1;
			item_data.gaze = false;
			if (!(item_data.type in Data.List.type)) item_data.type = "__untitled";
			Data.List.todo[item.id] = item_data;

			delete Data.List.done[item.id];

			Transceiver.Send("view.todo");
			Transceiver.Send("view.done");
			Transceiver.Send("file.write");
		}
	}

	/**
	 * 清空已办事项
	 */
	export async function Clear(): Promise<void> {
		if (await Message.Show("information", "确认清空已办事项吗？", "确认", "取消") == "确认") {
			Data.List.done = {};
			Transceiver.Send("view.done");
			Transceiver.Send("file.write");
		}
	}
}
