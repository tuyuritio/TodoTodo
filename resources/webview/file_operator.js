"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIconPath = exports.getWeb = exports.removeNew = exports.newItem = exports.removeList = exports.getList = exports.writeJSON = exports.getJSON = void 0;
/* 模块调用 */
const path = require("path");
const fs = require("fs");
/**
 * 获取JSON文件总目录路径
 * @returns JSON文件总目录路径
 */
function toData() {
    let directory_path = __dirname;
    while (!fs.existsSync(path.join(directory_path, "resources"))) {
        directory_path = path.join(directory_path, "..");
    }
    directory_path = path.join(directory_path, "resources", "data");
    return directory_path;
}
/**
 * 获取JSON文件内容 | 获取JSON文件路径
 * @param type 内容类型 - 可选值为 **"recent"**
 * @param is_path 是否获取内容 - true则获取路径；false则获取内容。- **默认：** false
 * @returns JSON文件内容 | JSON文件路径
 */
function getJSON(type, is_path = false) {
    let file_path = path.join(toData(), type + ".json");
    if (is_path) {
        return file_path;
    }
    else {
        return JSON.parse(fs.readFileSync(file_path, "utf8"));
    }
}
exports.getJSON = getJSON;
/**
 * 写入JSON数据
 * @param file_path JSON文件路径
 * @param data JSON文件数据
 */
function writeJSON(file_path, data) {
    fs.writeFileSync(file_path, JSON.stringify(data, null, "\t"));
}
exports.writeJSON = writeJSON;
/**
 * 获取清单内容 | 获取清单内容列表 | 获取清单路径
 * 若不存在则创建清单文件
 * @param list 清单名称
 * @param is_path 是否获取路径 - true则获取路径；false则获取内容。- **默认：** false
 * @returns 清单内容 | 清单内容列表 | 清单路径
 */
function getList(list, is_path = false) {
    let directory_path = path.join(toData(), "todo_list");
    if (list) {
        directory_path = path.join(directory_path, list + ".json");
        if (fs.existsSync(directory_path)) {
            if (!is_path) {
                return JSON.parse(fs.readFileSync(directory_path, "utf8"));
            }
        }
        else {
            let structure = { "type": list, "list": [] };
            writeJSON(directory_path, structure);
        }
        return directory_path;
    }
    else {
        let lists = [];
        let count = 0;
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
exports.getList = getList;
/**
 * 删除清单文件
 * @param list 清单名称
 */
function removeList(list) {
    fs.unlinkSync(path.join(toData(), "todo_list", list + ".json"));
}
exports.removeList = removeList;
/**
 * 获取新事项文件目录路径
 * @returns 新事项文件目录路径
 */
function newItem() {
    let file_path = path.join(toData(), "new_item.json");
    let initial_data = { "index": 0, "label": "事项标题", "type": "事项类别", "time": "yyyy/mm/dd-hh:mm:ss", "priority": 0, "status": "todo" };
    writeJSON(file_path, initial_data);
    return file_path;
}
exports.newItem = newItem;
/**
 * 删除新事项文件
 */
function removeNew() {
    fs.unlinkSync(path.join(toData(), "new_item.json"));
}
exports.removeNew = removeNew;
/**
 * 获取Web资源 | 获取web资源路径
 * @param type 资源类型 - 可选值为 **"HTML"** 、 **"CSS"** 、 **"JS"**
 * @param is_path 是否获取路径 - true则获取路径；false则获取资源。- **默认：** false
 * @returns JSON文件内容
 */
function getWeb(type, is_path = false) {
    let directory_path = __dirname;
    while (!fs.existsSync(path.join(directory_path, "resources"))) {
        directory_path = path.join(directory_path, "..");
    }
    directory_path = path.join(directory_path, "resources", "webview");
    switch (type) {
        case "HTML":
            if (is_path) {
                return path.join(directory_path, "index.html");
            }
            else {
                return fs.readFileSync(path.join(directory_path, "index.html"), "utf8");
            }
        case "CSS":
            if (is_path) {
                return path.join(directory_path, "style.css");
            }
            else {
                return fs.readFileSync(path.join(directory_path, "stype.css"), "utf8");
            }
        case "JS":
            if (is_path) {
                return path.join(directory_path, "script.js");
            }
            else {
                return fs.readFileSync(path.join(directory_path, "script.js"), "utf8");
            }
        default:
            return directory_path;
    }
}
exports.getWeb = getWeb;
/**
 * 获取图标路径
 * @param icon_name 图标名称
 * @returns 图标路径
 */
function getIconPath(icon_name) {
    return path.join(__dirname, "..", "resources", "icon", icon_name + ".svg");
}
exports.getIconPath = getIconPath;
//# sourceMappingURL=file_operator.js.map