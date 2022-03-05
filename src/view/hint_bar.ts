/* 模块调用 */
import * as vscode from "vscode";
import { transceiver } from "../tool";

export namespace hint_bar {
	let view: vscode.StatusBarItem;

	/**
	 * 建立视图
	 */
	export function initialize(position: string) {
		view = vscode.window.createStatusBarItem(position == "left" ? vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right, Number.MAX_SAFE_INTEGER);
		view.command = {
			command: "todotodo.view.change",
			title: "切换视图"
		}
		transceiver.send("view.hint");
	}

	/**
	 * 解析数据并刷新视图
	 * @param todo_data 原始数据
	 */
	export function parseData(todo_data: any) {
		view.text = Object.keys(todo_data).length ? "剩余待办：" + Object.keys(todo_data).length + "件" : "已完成所有事项！";
		view.show();
	}
}
