/* 模块调用 */
import { Transceiver } from "../Tool";
import { Data } from "../DataCenter";

export namespace ProfileProcesser {
	/**
	 * 更改TodoTree视图
	 */
	export function ChangeTree(): void {
		Data.Profile.tree_type = !Data.Profile.tree_type;
		Transceiver.Send("view.todo");
	}

	/**
	 * 更改空清单显示
	 */
	export function ChangeEmpty(): void {
		Data.Profile.empty_list = !Data.Profile.empty_list;
		Transceiver.Send("view.todo");
	}
}
