/* 模块调用 */
import * as vscode from "vscode";
import * as FileSystem from "fs";
import * as PathSystem from "path";
import * as events from "events";

export namespace Action {
	/**
	 * 循环执行函数
	 * @param Callback 回调函数
	 * @param seconds 循环间隔描述
	 */
	export function Cycle(Callback: (...argument: any[]) => void, seconds: number = 1): void {
		Callback();
		setInterval(Callback, seconds * 1000);
	}
}

export namespace Code {
	/**
	 * 生成指定长度的随机码
	 * @param length 字符长度
	 * @returns 随机码
	 */
	export function Generate(length: number): string {
		const character_table: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefgijklmnopqrstuvwxyz";

		let code_text = "";
		for (let index = 0; index < length; index++) {
			code_text += character_table.charAt(Math.floor((Math.random() * character_table.length)));
		}

		return code_text;
	}
}

export namespace Message {
	/**
	 * 弹出信息
	 * @param type 信息类型
	 * @param text 信息内容
	 */
	export function Show(type: "error" | "warning" | "information", text: string, ...items: string[]): Thenable<string | undefined> {
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

export namespace Command {
	/**
	 * 执行VSCode命令
	 * @param command 命令文本
	 * @param argument 参数序列
	 */
	export function Execute(command: string, ...argument: any[]): void {
		vscode.commands.executeCommand(command, ...argument);
	}
}

export namespace Inputer {
	/**
	 * 生成输入框
	 * @param title 标题
	 * @param value 覆盖值
	 * @param placeholder 占位符
	 * @param prompt 提示
	 * @param total_step 总步骤
	 * @param step 当前步骤
	 * @returns 输入框
	 */
	export function Text(title: string, value: string, placeholder: string, prompt?: string, total_step?: number, step?: number): vscode.InputBox {
		const box = vscode.window.createInputBox();
		box.title = title;
		box.totalSteps = total_step;
		box.step = step;
		box.value = value;
		box.placeholder = placeholder;
		box.prompt = prompt;
		box.onDidHide(() => box.dispose());
		box.onDidChangeValue(() => box.validationMessage = undefined);
		return box;
	}

	/**
	 * 生成选择框
	 * @param title 标题
	 * @param value 覆盖值
	 * @param placeholder 占位符
	 * @param total_step 总步骤
	 * @param step 当前步骤
	 * @param match 匹配描述 - **默认:** false
	 * @returns 选择框
	 */
	export function Pick(title: string, value: string, placeholder: string, total_step?: number, step?: number, match: boolean = false): vscode.QuickPick<PickItem> {
		const box = vscode.window.createQuickPick<PickItem>();
		box.title = title;
		box.totalSteps = total_step;
		box.step = step;
		box.value = value;
		box.placeholder = placeholder;
		box.matchOnDescription = match;
		box.onDidHide(() => box.dispose());
		return box;
	}

	export class PickItem implements vscode.QuickPickItem {
		label: string;
		detail?: string;
		description?: string;
		information?: string;

		constructor(label: string, information?: string, description?: string, detail?: string) {
			this.label = label;
			this.detail = detail;
			this.description = description;
			this.information = information;
		}
	}
}

export namespace Transceiver {
	let extension_context: vscode.ExtensionContext;			// 扩展上下文
	let listener: events.EventEmitter;						// 事件监听器

	/**
	 * 新建监听器，建立上下文
	 * @param context 扩展上下文
	 */
	export function Initialize(context: vscode.ExtensionContext): void {
		extension_context = context;
		listener = new events.EventEmitter();
	}

	/**
	 * 注册事件
	 * @param command 命令
	 * @param Callback 回调函数
	 * @param outside 是否外部命令 - **默认:** false
	 */
	export function Register(command: string, Callback: (...argument: any[]) => any, outside: boolean = false): void {
		listener.addListener(command, Callback);

		if (outside) extension_context.subscriptions.push(vscode.commands.registerCommand("todotodo." + command, (...argument) => Send(command, ...argument)));
	}

	/**
	 * 触发事件
	 * @param command 命令
	 * @param argument 参数序列
	 */
	export function Send(command: string, ...argument: any[]): void {
		if (listener.eventNames().includes(command)) {
			listener.emit(command, ...argument);
		} else {
			vscode.window.showErrorMessage("命令\"" + command + "\"未注册。");
		}
	}

	/**
	 * 销毁事件
	 * @param command 命令
	 * @param callback 回调函数
	 */
	export function Dispose(command: string, callback: (...argument: any[]) => any): void {
		listener.removeListener(command, callback);
	}
}

export namespace Time {
	/* 全局变量 */
	type unit = "year" | "month" | "date" | "hour" | "minute" | "second" | "millisecond";

	/**
	 * 将时间文本转换为时间整型 | 将Date对象转换为时间整型
	 * @param time 时间文本 | Date对象
	 * @returns 时间整型
	 */
	export function Parse(time: string | Date): number {
		return new Date(time).getTime();
	}

	/**
	 * 将Date对象转换为时间文本 | 将时间整型转换为时间文本
	 * @param time Date对象 | 时间整型
	 * @param time_unit 时间精确单位 - **默认:** "minute"
	 * @returns 时间文本
	 */
	export function Textualize(time: Date | number, time_unit: unit = "minute"): string {
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
	export function In24(time: string): boolean {
		let expected_time = new Date();
		expected_time.setHours(expected_time.getHours() + 24);
		return Parse(time) < Parse(expected_time);
	}

	/**
	 * 生成时段文本
	 * @param start 开始日期
	 * @param duration 持续日数
	 * @returns 时段文本
	 */
	export function Period(start: string, duration: number): string {
		let date = new Date(start);
		date.setDate(date.getDate() + duration);
		return start + " ~ " + Time.Textualize(date, "date");
	};
}

export namespace Path {
	/**
	 * 连接路径序列
	 * @param paths 路径序列
	 * @returns 
	 */
	export function Link(...paths: string[]): string {
		return PathSystem.join(...paths);
	}

	/**
	 * 读取文件
	 * @param path 文件路径
	 * @returns 文件内容
	 */
	export function ReadFile(path: string): string {
		return FileSystem.readFileSync(path, "utf8");
	}

	/**
	 * 创建目录
	 * @param path 目录路径
	 */
	export function MakeDirectory(path: string): void {
		FileSystem.mkdirSync(path);
	}

	/**
	 * 读取目录
	 * @param path 目录路径
	 * @returns 文件名序列
	 */
	export function ReadDirectory(path: string): string[] {
		return FileSystem.readdirSync(path);
	}

	/**
	 * 读取JSON数据
	 * @param path JSON文件路径
	 */
	export function ReadJSON(path: string): any {
		return JSON.parse(FileSystem.readFileSync(path, "utf8"));
	}

	/**
	 * 写入JSON数据
	 * @param file_path JSON文件路径
	 * @param data JSON文件数据
	 */
	export function WriteJSON(file_path: string, data: any): void {
		FileSystem.writeFileSync(file_path, JSON.stringify(data, null, "\t"));
	}

	/**
	 * 判断文件或目录是否存在
	 * @param path 文件或目录路径
	 * @returns 是否存在
	 */
	export function Exist(path: string): boolean {
		return FileSystem.existsSync(path);
	}

	/**
	 * 删除文件
	 * @param path 文件路径
	 */
	export function RemoveFile(path: string): void {
		FileSystem.unlinkSync(path);
	}

	/**
	 * 移除目录
	 * @param path 目录路径
	 */
	export function RemoveDirectory(path: string): void {
		FileSystem.rmdirSync(path);
	}

	/**
	 * 重命名文件
	 * @param old_path 旧路径
	 * @param new_path 新路径
	 */
	export function Rename(old_path: string, new_path: string): void {
		FileSystem.renameSync(old_path, new_path);
	}
}
