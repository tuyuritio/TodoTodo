/* 模块调用 */
import * as vscode from "vscode";
import * as file_system from "fs";
import * as path_system from "path";
import * as events from "events";

export namespace action {
	/**
	 * 循环执行函数
	 * @param callback 需要循环执行的函数
	 * @param seconds 循环间隔的秒数
	 */
	export function cycle(callback: (...argument: any[]) => void, seconds: number = 1): void {
		callback();
		setInterval(callback, seconds * 1000);
	}
}

export namespace code {
	/**
	 * 生成指定长度的随机码
	 * @param length 字符长度
	 * @returns 随机码
	 */
	export function generate(length: number): string {
		let character_table: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefgijklmnopqrstuvwxyz";

		let code_text = "";
		for (let index = 0; index < length; index++) {
			code_text += character_table.charAt(Math.floor((Math.random() * character_table.length)));
		}

		return code_text;
	}
}

export namespace message {
	/**
	 * 弹出信息
	 * @param text 信息内容
	 * @param type 信息类型
	 */
	export function show(type: "error" | "warning" | "information", text: string, ...items: string[]): Thenable<string | undefined> {
		switch (type) {
			case "error":
				return vscode.window.showErrorMessage(text, ...items);

			case "warning":
				return vscode.window.showWarningMessage(text, ...items);

			case "information":
				return vscode.window.showInformationMessage(text, ...items);
		}
	}
}

export namespace command {
	/**
	 * 执行VSCode命令
	 * @param command 命令文本
	 * @param argument 参数
	 */
	export function execute(command: string, ...argument: any[]) {
		vscode.commands.executeCommand(command, ...argument);
	}
}

export namespace transceiver {
	let extension_context: vscode.ExtensionContext;			// 扩展上下文
	let listener: events.EventEmitter;						// 事件监听器

	/**
	 * 新建监听器，建立上下文
	 * @param context 扩展上下文
	 */
	export function initialize(context: vscode.ExtensionContext): void {
		extension_context = context;
		listener = new events.EventEmitter();
	}

	/**
	 * 注册事件
	 * @param command 命令
	 * @param callback 函数
	 * @param outside 是否外部命令 - **默认:** false
	 */
	export function register(command: string, callback: (...argument: any[]) => any, outside: boolean = false): void {
		listener.addListener(command, callback);

		if (outside) extension_context.subscriptions.push(vscode.commands.registerCommand("todotodo." + command, (...argument) => send(command, ...argument)));
	}

	/**
	 * 触发事件
	 * @param command 命令
	 * @param argument 参数序列
	 */
	export function send(command: string, ...argument: any[]): void {
		if (listener.eventNames().includes(command)) {
			listener.emit(command, ...argument);
		} else {
			vscode.window.showErrorMessage("命令\"" + command + "\"未注册。");
		}
	}
}

export namespace date {
	/* 全局变量 */
	type unit = "year" | "month" | "date" | "hour" | "minute" | "second" | "millisecond";

	/**
	 * 将"YYYY/MM/DD-hh:mm"转换为时间整型 | 将Date对象转换为时间整型
	 * @param time 时间文本 | Date对象
	 * @returns 时间整型
	 */
	export function parse(time: string | Date) {
		return new Date(time).getTime();
	}

	/**
	 * 将Date对象转换为时间文本 | 将时间整型转换为时间文本
	 * @param time Date对象 | 时间整型
	 * @param time_unit 时间精确单位 - **默认:** unit.minute
	 * @returns 时间文本
	 */
	export function textualize(time: Date | number, time_unit: unit = "minute"): string {
		if (typeof time == "number") time = new Date(time);

		let time_text: string = "";

		switch (time_unit) {
			case "millisecond":
				time_text = "." + time.getMilliseconds() + time_text;

			case "second":
				time_text = ":" + time.getSeconds().toString().padStart(2, "0") + time_text;

			case "minute":
				time_text = ":" + time.getMinutes().toString().padStart(2, "0") + time_text;

			case "hour":
				time_text = "-" + time.getHours().toString().padStart(2, "0") + time_text;

			case "date":
				time_text = "/" + time.getDate().toString().padStart(2, "0") + time_text;

			case "month":
				time_text = "/" + (time.getMonth() + 1).toString().padStart(2, "0") + time_text;

			case "year":
				time_text = time.getFullYear() + time_text;
				break;

			default:
				time_text = time.getFullYear() + "/" + (time.getMonth() + 1).toString().padStart(2, "0") + "/" + time.getDate().toString().padStart(2, "0") + "-" + time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0");
				break;
		}

		return time_text;
	}

	/**
	 * 判断时间是否在过去或未来24小时内
	 * @param time 时间文本
	 * @returns 是否在过去或未来24小时内
	 */
	export function isRecent(time: string): boolean {
		let expected_time = new Date();
		expected_time.setHours(expected_time.getHours() + 24);

		return parse(time) < parse(expected_time);
	}
}

export namespace path {
	/**
	 * 连接路径序列
	 * @param paths 路径序列
	 * @returns 
	 */
	export function link(...paths: string[]): string {
		return path_system.join(...paths);
	}

	/**
	 * 读取文件
	 * @param path 文件路径
	 * @returns 文件内容
	 */
	export function readFile(path: string): string {
		return file_system.readFileSync(path, "utf8");
	}

	/**
	 * 创建目录
	 * @param path 目录路径
	 */
	export function makeDirectory(path: string): void {
		file_system.mkdirSync(path);
	}

	/**
	 * 读取目录
	 * @param path 目录路径
	 * @returns 文件名序列
	 */
	export function readDirectory(path: string): string[] {
		return file_system.readdirSync(path);
	}

	/**
	 * 读取JSON数据
	 * @param file_path JSON文件路径
	 */
	export function readJSON(path: string): any {
		return JSON.parse(file_system.readFileSync(path, "utf8"));
	}

	/**
	 * 写入JSON数据
	 * @param file_path JSON文件路径
	 * @param data JSON文件数据
	 */
	export function writeJSON(file_path: string, data: any): void {
		file_system.writeFileSync(file_path, JSON.stringify(data, null, "\t"));
	}

	/**
	 * 判断文件或目录是否存在
	 * @param path 文件或目录路径
	 * @returns 是否存在
	 */
	export function exist(path: string): boolean {
		return file_system.existsSync(path);
	}

	/**
	 * 删除文件
	 * @param path 文件路径
	 */
	export function removeFile(path: string): void {
		file_system.unlinkSync(path);
	}

	/**
	 * 移除目录
	 * @param path 目录路径
	 */
	export function removeDirectory(path: string): void {
		file_system.rmdirSync(path);
	}

	/**
	 * 重命名文件
	 * @param old_path 旧路径
	 * @param new_path 新路径
	 */
	export function rename(old_path: string, new_path: string) {
		file_system.renameSync(old_path, new_path);
	}
}
