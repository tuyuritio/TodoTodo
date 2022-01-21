/* 模块声明 */
export class profile {
	static list_tree: boolean;

	constructor() {
		profile.list_tree = true;
	}

	/**
	 * 生成指定长度的随机码
	 * @param length 字符长度
	 * @returns 随机码
	 */
	static code(length: number): string {
		let character_table: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefgijklmnopqrstuvwxyz";

		let code_text = "";
		for (let index = 0; index < length; index++) {
			code_text += character_table.charAt(Math.floor((Math.random() * character_table.length)));
		}

		return code_text;
	}

	/**
	 * 循环执行函数
	 * @param action 需要循环执行的函数
	 * @param seconds 循环间隔的秒数
	 */
	static cycle(action: () => void, seconds: number = 1): void {
		action();
		setInterval(() => action(), seconds * 1000);
	}
}
