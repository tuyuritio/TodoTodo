/* 模块调用 */
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { configuration } from "../general/configuration_center";

/* 全局变量 */
let is_reminded = false;						// 是否已提醒
let data_path: string;							// 文件基准路径

/**
 * 检查文件路径
 */
export function checkPath(): void {
	data_path = configuration.first_configuration.path;

	if (data_path.replace(" ", "") == "") {
		data_path = path.join(__dirname, "..", "..", "TodoTodoData");
	} else if (!fs.existsSync(data_path)) {
		if (!is_reminded) {
			vscode.window.showErrorMessage("自定义清单文件目录路径无效，请检查！\n（现已使用默认路径，请及时设置正确路径！）", "前往设置").then((action) => {
				if (action == "前往设置") {
					vscode.commands.executeCommand("workbench.action.openSettings", "todotodo.path");
				}
			});
		}
		data_path = path.join(__dirname, "..", "..", "TodoTodoData");
	}
	is_reminded = true;

	let file_path = path.join(data_path, "done.json")
	if (!fs.existsSync(file_path)) {
		writeJSON(file_path, []);
	}

	file_path = path.join(data_path, "fail.json");
	if (!fs.existsSync(file_path)) {
		writeJSON(file_path, []);
	}

	file_path = path.join(data_path, "log.json");
	if (!fs.existsSync(file_path)) {
		writeJSON(file_path, []);
	}

	file_path = path.join(data_path, "TodoData");
	if (!fs.existsSync(file_path)) {
		fs.mkdirSync(file_path);
	}

	file_path = path.join(file_path, "默认清单.json");
	if (!fs.existsSync(file_path)) {
		let default_list = { type: "默认清单", priority: 1, list: [] };
		writeJSON(file_path, default_list);
	}
}

/**
 * 写入JSON数据
 * @param file_path JSON文件路径
 * @param data JSON文件数据
 */
function writeJSON(file_path: string, data: any): void {
	fs.writeFileSync(file_path, JSON.stringify(data, null, "\t"));
}

/**
 * 获取JSON内容
 * @param content JSON文件类别 - 可选值为 **"todo"** 、 **"done"** 、 **"fail"** 、 "log"
 * @returns JSON内容
 */
export function readJSON(content: string): any {
	if (content == "todo") {
		let todo_data = [];
		let index: number = 0;
		let files = fs.readdirSync(path.join(data_path, "TodoData"));
		for (let file of files) {
			let file_path = path.join(data_path, "TodoData", file);
			todo_data[index++] = JSON.parse(fs.readFileSync(file_path, "utf8"));
		}

		return todo_data;
	} else {
		return JSON.parse(fs.readFileSync(path.join(data_path, content + ".json"), "utf8"));
	}
}

/**
 * 获取Web资源 | 获取web资源路径
 * @param type 资源类型 - 可选值为 **"HTML"** 、 **"CSS"** 、 **"JS"**
 * @param name 文件内容 - 当`type`为 **"CSS"** 时可选值为 **"style"** 、 **"item_editor"** 、 **"list_editor"** 、 **"log_panel"**
 * @param name 文件内容 - 当`type`为 **"JS"** 时可选值为 **"script"** 、 **"item"** 、 **"element"** 、 **"window"** 、 **"event"**
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
			directory_path = path.join(directory_path, "css");

			if (is_path) {
				return path.join(directory_path, name + ".css");
			} else {
				return fs.readFileSync(path.join(directory_path, name + ".css"), "utf8");
			}

		case "JS":
			directory_path = path.join(directory_path, "js");

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
 * 重命名清单
 * @param list 清单名称
 * @param new_name 新名称
 */
export function renameList(list: string, new_name: string): void {
	fs.renameSync(path.join(data_path, "TodoData", list + ".json"), path.join(data_path, "TodoData", new_name + ".json"));
}

/**
 * 删除清单文件
 * @param list 清单名称
 */
export function removeList(list: string): void {
	fs.unlinkSync(path.join(data_path, "TodoData", list + ".json"));
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
 * 写入数据
 * @param todo_data Todo数据
 * @param done_data Done数据
 * @param fail_data Fail数据
 */
export function writeData(todo_data: any, done_data: any, fail_data: any, log_data: any): void {
	writeJSON(path.join(data_path, "done.json"), done_data);
	writeJSON(path.join(data_path, "fail.json"), fail_data);
	writeJSON(path.join(data_path, "log.json"), log_data);

	let files = fs.readdirSync(path.join(data_path, "TodoData"));
	for (let file of files) {
		fs.unlinkSync(path.join(data_path, "TodoData", file));
	}

	for (let list in todo_data) {
		writeJSON(path.join(data_path, "TodoData", list + ".json"), todo_data[list]);
	}

	vscode.window.showInformationMessage("TodoTodo数据已保存！");
}
