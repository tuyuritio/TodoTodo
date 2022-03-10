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
		item_data.cycle = -1;
		item_data.gaze = false;
		if (!(item_data.type in Data.List.type)) item_data.type = "__untitled";
		Data.List.todo[item.id] = item_data;

		delete Data.List.fail[item.id];

		Transceiver.Send("view.todo");
		Transceiver.Send("view.fail");
	}

	/**
	 * 删除事项
	 * @param item 事项对象
	 */
	export async function Delete(item: any): Promise<void> {
		if (await Message.Show("warning", "确认删除事项 \"" + item.label + "\" 吗？", "确认", "取消") == "确认") {
			delete Data.List.fail[item.id];
			Transceiver.Send("view.fail");
		}
	}
}
