/* 模块调用 */
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as log from "../log_set";
import { configurations } from "../command_manage";

/* 全局变量 */
let is_reminded = false;										// 是否已提醒异常路径
let old_data

/**
 * 获取JSON文件目录路径
 * @param is_list 是否为清单目录
 * @returns JSON文件目录路径
 */
function toData(is_list: boolean = true): string {
	let list_path = configurations.configuration.path;

	if (!list_path) {
		list_path = path.join(__dirname, "..", "..", "TodoTodoData");
	} else if (!fs.existsSync(list_path)) {
		if (!is_reminded) {
			is_reminded = true;
			vscode.window.showErrorMessage("自定义清单文件目录路径无效，请检查！\n（现已使用默认路径，请及时更换！）");
		}
		list_path = path.join(__dirname, "..", "..", "TodoTodoData");
	}

	if (is_list) {
		if (!fs.existsSync(path.join(list_path, "ListData"))) {
			fs.mkdirSync(path.join(list_path, "ListData"));
		}

		if (!fs.existsSync(path.join(list_path, "ListData", "默认清单.json"))) {
			let default_list = { type: "默认清单", priority: 1, list: [{ label: "样例事项", priority: 0, time: "2999/01/01/-00:00", place: "在这里记录目标地点", mail: "在这里记录目标邮箱", particulars: "在这里记录事项细节" }] };
			writeJSON(path.join(list_path, "ListData", "默认清单.json"), default_list);
		}

		list_path = path.join(list_path, "ListData");
	} else {
		if (!fs.existsSync(path.join(list_path, "log.json"))) {
			writeJSON(path.join(list_path, "log.json"), []);
		}

		if (!fs.existsSync(path.join(list_path, "recent.json"))) {
			writeJSON(path.join(list_path, "recent.json"), []);
		}

		if (!fs.existsSync(path.join(list_path, "done.json"))) {
			writeJSON(path.join(list_path, "done.json"), []);
		}

		if (!fs.existsSync(path.join(list_path, "fail.json"))) {
			writeJSON(path.join(list_path, "fail.json"), []);
		}
	}

	return list_path;
}

/**
 * 获取JSON文件内容 | 获取JSON文件路径
 * @param type 内容类型 - 可选值为 **"recent"** 、 **"log"** 、 **"done"** 、 **"fail"**
 * @param is_path 是否获取内容 - true则获取路径；false则获取内容。- **默认：** false
 * @returns JSON文件内容 | JSON文件路径
 */
export function getJSON(type: string, is_path: boolean = false): any {
	let file_path = path.join(toData(false), type + ".json");

	if (is_path) {
		return file_path;
	} else {
		return JSON.parse(fs.readFileSync(file_path, "utf8"));
	}
}

/**
 * 写入JSON数据
 * @param file_path JSON文件路径
 * @param data JSON文件数据
 */
export function writeJSON(file_path: string, data: any): void {
	fs.writeFileSync(file_path, JSON.stringify(data, null, "\t"));
}

/**
 * 获取清单内容 | 获取清单路径 | 获取清单内容列表
 * @param list 清单名称 - 若不存在则会创建清单文件
 * @param is_path 是否获取路径 - true则获取路径；false则获取内容。- **默认：** false
 * @returns 清单内容 | 清单内容列表 | 清单路径
 */
export function getList(list?: string, is_path: boolean = false): any {
	let directory_path = toData();

	if (list) {
		directory_path = path.join(directory_path, list + ".json");
		if (!is_path) {
			if (!fs.existsSync(directory_path)) {
				let structure = { type: list, priority: 0, list: [] };
				writeJSON(directory_path, structure);

				log.add(undefined, { type: list }, log.did.add);
			}

			{	// 兼容0.2.3及更早版本，写入清单priority属性
				let data = JSON.parse(fs.readFileSync(directory_path, "utf8"));
				if (!data.priority) {
					data.priority = 0;
				}
				writeList(list, data);
			}
			return JSON.parse(fs.readFileSync(directory_path, "utf8"));
		} else {
			return directory_path;
		}
	} else {
		let lists = [];
		let count: number = 0;

		let files = fs.readdirSync(directory_path);
		for (let file of files) {
			let file_path = path.join(directory_path, file);
			if (path.extname(file_path) == ".json") {
				lists[count++] = JSON.parse(fs.readFileSync(file_path, "utf8"));
			}
		}

		return lists;
	}
}

/**
 * 向清单中写入覆盖数据
 * @param list 清单名称
 * @param data 被写入数据
 */
export function writeList(list: string, data: any): void {
	writeJSON(getList(list, true), data);
}

/**
 * 删除清单文件
 * @param list 清单名称
 */
export function removeList(list: string): void {
	fs.unlinkSync(path.join(toData(), list + ".json"));
}

/**
 * 获取Web资源 | 获取web资源路径
 * @param type 资源类型 - 可选值为 **"HTML"** 、 **"CSS"** 、 **"JS"**
 * @param name JS文件名称 - 可选值为 **"script"** 、 **"item"** 、 **"element"** 、 **"window"** 、 **"event"**
 * @param is_path 是否获取路径 - true则获取路径；false则获取资源。- **默认：** false
 * @returns JSON文件内容
 */
export function getWeb(type?: string, name?: string, is_path: boolean = false): string {
	let directory_path = __dirname;
	while (!fs.existsSync(path.join(directory_path, "resources"))) {
		directory_path = path.join(directory_path, "..");
	}
	directory_path = path.join(directory_path, "resources", "webview");

	switch (type) {
		case "HTML":
			if (is_path) {
				return path.join(directory_path, "index.html");
			} else {
				return fs.readFileSync(path.join(directory_path, "index.html"), "utf8");
			}

		case "CSS":
			if (is_path) {
				return path.join(directory_path, "style.css");
			} else {
				return fs.readFileSync(path.join(directory_path, "stype.css"), "utf8");
			}
		case "JS":

			if (is_path) {
				return path.join(directory_path, name + ".js");
			} else {
				return fs.readFileSync(path.join(directory_path, name + ".js"), "utf8");
			}
		default:
			return directory_path;
	}
}

/**
 * 获取图标路径
 * @param icon_name 图标名称
 * @param is_gif 是否获取gif - true则获取gif；false则获取svg。- **默认：** false
 * @returns 图标路径
 */
export function getIconPath(icon_name: string, is_gif: boolean = false): string {
	let directory_path = __dirname;
	while (!fs.existsSync(path.join(directory_path, "resources"))) {
		directory_path = path.join(directory_path, "..");
	}

	let file_type = is_gif ? ".gif" : ".svg";
	return path.join(directory_path, "resources", "icon", icon_name + file_type);
}

/**
 * 读取package.json
 * @returns package.json数据
 */
export function getPackage(): any {
	return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf8"));
}

/**
 * 写入package.json
 * @param data package.json数据
 */
export function setPackage(data: any): void {
	writeJSON(path.join(__dirname, "..", "..", "package.json"), data);
}

/**
 * 重命名清单
 * @param list 清单名称
 * @param new_name 新名称
 */
export function renameList(list: string, new_name: string): void {
	fs.renameSync(getList(list, true), getList(new_name, true));

	let data = getList(new_name);
	data.type = new_name;
	writeList(new_name, data);
}

