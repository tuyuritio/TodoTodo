/* 模块调用 */
import * as path from 'path';
import * as fs from 'fs';

/**
 * 获取JSON文件总目录路径
 * @returns JSON文件总目录路径
 */
function toData(): string {
	let directory_path = __dirname;
	while (!fs.existsSync(path.join(directory_path, "resources"))) {
		directory_path = path.join(directory_path, "..");
	}
	return path.join(directory_path, "resources", "data");
}

/**
 * 获取JSON文件内容 | 获取JSON文件路径
 * @param type 内容类型 - 可选值为 **"recent"**
 * @param is_path 是否获取内容 - true则获取路径；false则获取内容。- **默认：** false
 * @returns JSON文件内容 | JSON文件路径
 */
export function getJSON(type: string, is_path: boolean = false): any {
	let file_path = path.join(toData(), type + ".json");

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
 * 获取清单内容 | 获取清单内容列表 | 获取清单路径
 * 若不存在则创建清单文件
 * @param list 清单名称
 * @param is_path 是否获取路径 - true则获取路径；false则获取内容。- **默认：** false
 * @returns 清单内容 | 清单内容列表 | 清单路径
 */
export function getList(list?: string, is_path: boolean = false): any {
	let directory_path = path.join(toData(), "todo_list");

	if (list) {
		directory_path = path.join(directory_path, list + ".json");
		if (fs.existsSync(directory_path)) {
			if (!is_path) {
				return JSON.parse(fs.readFileSync(directory_path, "utf8"));
			}
		} else {
			let structure = { "type": list, "list": [] };

			writeJSON(directory_path, structure);
		}

		return directory_path;
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
 * 删除清单文件
 * @param list 清单名称
 */
export function removeList(list: string) {
	fs.unlinkSync(path.join(toData(), "todo_list", list + ".json"));
}

/**
 * 获取新事项文件目录路径
 * @returns 新事项文件目录路径
 */
export function newItem(): string {
	let file_path = path.join(toData(), "new_item.json");
	let initial_data = { "index": 0, "label": "事项标题", "type": "事项类别", "time": "yyyy/mm/dd-hh:mm:ss", "priority": 0, "status": "todo" };

	writeJSON(file_path, initial_data);
	return file_path;
}

/**
 * 删除新事项文件
 */
export function removeNew(): void {
	fs.unlinkSync(path.join(toData(), "new_item.json"));
}

/**
 * 获取Web资源 | 获取web资源路径
 * @param type 资源类型 - 可选值为 **"HTML"** 、 **"CSS"** 、 **"JS"**
 * @param is_path 是否获取路径 - true则获取路径；false则获取资源。- **默认：** false
 * @returns JSON文件内容
 */
export function getWeb(type?: string, is_path: boolean = false): string {
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
				return path.join(directory_path, "script.js");
			} else {
				return fs.readFileSync(path.join(directory_path, "script.js"), "utf8");
			}
		default:
			return directory_path;
	}
}

/**
 * 获取图标路径
 * @param icon_name 图标名称
 * @returns 图标路径
 */
export function getIconPath(icon_name: string): string {
	let directory_path = __dirname;
	while (!fs.existsSync(path.join(directory_path, "resources"))) {
		directory_path = path.join(directory_path, "..");
	}
	return path.join(directory_path, "resources", "icon", icon_name + ".svg");
}
