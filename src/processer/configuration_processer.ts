/* 模块调用 */
import { data } from "../data_center";
import { command, message } from "../tool";

export namespace configuration_processer {
	/**
	 * 获取数据
	 * @param type 类型
	 * @param reference 是否引用 - **默认:** false
	 * @returns 数据
	 */
	export function get(type?: "path" | "add_action" | "item_delete_remind" | "list_delete_remind" | "shut_ahead" | "empty_list", reference: boolean = false) {
		let result: any;

		switch (type) {
			case "path": result = data.configuration.path; break;
			case "add_action": result = data.configuration.add_action; break;
			case "item_delete_remind": result = data.configuration.item_delete_remind; break;
			case "list_delete_remind": result = data.configuration.list_remove_remind; break;
			case "shut_ahead": result = data.configuration.shut_ahead; break;
			case "empty_list": result = data.configuration.empty_list; break;
			default:
				result = {
					path: data.configuration.path,
					add_action: data.configuration.add_action,
					item_delete_remind: data.configuration.item_delete_remind,
					list_delete_remind: data.configuration.list_remove_remind,
					shut_ahead: data.configuration.shut_ahead,
					empty_list: data.configuration.empty_list
				};
				break;
		}

		return reference ? result : data.copy(result);
	}

	/**
	 * 获取预警间隔时间
	 * @returns 预警间隔时间
	 */
	export function getRemindGap(): number {
		let time_text: string = data.configuration.shut_ahead;

		let hour = time_text.split(":")[0];
		let minute = time_text.split(":")[1];

		let ahead_time: number = Number(hour) * 60 + Number(minute);
		ahead_time = ahead_time ? ahead_time : 60;

		return ahead_time * 60;
	}

	/**
	 * 路径设置
	 */
	export async function setPath(): Promise<void> {
		if (await message.show("error", "自定义文件目录路径无效，请检查！", "前往设置") == "前往设置") {
			command.execute("workbench.action.openSettings", "todotodo.path");
		}
	}

	/**
	 * 重新加载窗口
	 */
	export async function reload(): Promise<void> {
		if (await message.show("information", "该设置将在重新加载窗口后生效，是否立即重启？", "立即重新加载") == "立即重新加载") {
			command.execute("workbench.action.reloadWindow");
		}
	}
}
