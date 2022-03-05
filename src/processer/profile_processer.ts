/* 模块调用 */
import { transceiver } from "../tool";
import { data } from "../data_center";

export namespace profile_processer {
	/**
	 * 更改TodoTree视图
	 */
	export function changeTree(): void {
		data.profile.tree_type = !data.profile.tree_type;
		transceiver.send("view.todo");
	}

	/**
	 * 更改空清单显示
	 */
	export function changeEmpty(): void {
		data.profile.empty_list = !data.profile.empty_list;
		transceiver.send("view.todo");
	}
}
