/* 模块调用 */
import { data } from "../data_center";

export namespace profile_processer {
	/**
	 * 获取数据
	 * @param type 类型
	 * @param reference 是否引用 - **默认:** false
	 * @returns 数据
	 */
	export function get(type?: "list_priority" | "tree_type", reference: boolean = false) {
		let result: any;

		switch (type) {
			case "list_priority": result = data.profile.list_priority; break;
			case "tree_type": result = data.profile.tree_type; break;
			default:
				result = {
					list_priority: data.profile.list_priority,
					tree_type: data.profile.tree_type
				};
				break;
		}

		return reference ? result : data.copy(result);
	}

	/**
	 * 更改TodoTree视图
	 */
	export function changeTree(): void {
		data.profile.tree_type = !data.profile.tree_type;
	}
}
