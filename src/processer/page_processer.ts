/* 模块调用 */
import { data } from "../data_center";

export namespace page_processer {
	/**
	 * 获取数据
	 * @returns 数据
	 */
	export function get(): { html: string; css: any; js: any; icon: any; } {
		return { html: data.page.html, css: data.page.css, js: data.page.js, icon: data.page.icon };
	}
}
