/* 模块调用 */
import * as vscode from "vscode";
import * as package_manage from "./package_manage";
import { view } from "../extension_manage";

/* 配置中心 */
export class configuration {
	static first_configuration: vscode.WorkspaceConfiguration = configuration.copy(vscode.workspace.getConfiguration("todotodo"));
	static new_configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("todotodo");

	static list_all_item_delete_remind = this.first_configuration.list.todo.item.delete.remind;
	static list_all_delete_remind = this.first_configuration.list.todo.delete.remind;
	static list_all_item_delete_method = this.first_configuration.list.todo.delete.method;
	static list_all_empty_show = this.first_configuration.list.todo.empty.show;
	static page_editor_add_after_action = this.first_configuration.page.editor.add.after.action;

	constructor() {
		// 监听配置变更
		vscode.workspace.onDidChangeConfiguration(() => {
			configuration.new_configuration = vscode.workspace.getConfiguration("todotodo");

			configuration.list_all_item_delete_remind = configuration.new_configuration.list.todo.item.delete.remind;
			configuration.list_all_delete_remind = configuration.new_configuration.list.todo.delete.remind;
			configuration.list_all_item_delete_method = configuration.new_configuration.list.todo.delete.method;
			configuration.list_all_empty_show = configuration.new_configuration.list.todo.empty.show;
			configuration.page_editor_add_after_action = configuration.new_configuration.page.editor.add.after.action;

			if (configuration.new_configuration.path != configuration.first_configuration.path) {
				vscode.window.showInformationMessage("该设置将在重新加载窗口后生效，是否立即重启？", "立即重新加载").then((action) => {
					if (action == "立即重新加载") {
						vscode.commands.executeCommand("workbench.action.reloadWindow");
					}
				});
			}

			if (configuration.new_configuration.list.todo.empty.text != configuration.first_configuration.list.todo.empty.text) {
				vscode.window.showInformationMessage("该设置将在重新加载窗口后生效，是否立即重启？", "立即重新加载").then((action) => {
					if (action == "立即重新加载") {
						vscode.commands.executeCommand("workbench.action.reloadWindow");
					}
				});
			}

			if (configuration.new_configuration.list.done.empty.text != configuration.first_configuration.list.done.empty.text) {
				vscode.window.showInformationMessage("该设置将在重新加载窗口后生效，是否立即重启？", "立即重新加载").then((action) => {
					if (action == "立即重新加载") {
						vscode.commands.executeCommand("workbench.action.reloadWindow");
					}
				});
			}

			if (configuration.new_configuration.list.fail.empty.text != configuration.first_configuration.list.fail.empty.text) {
				vscode.window.showInformationMessage("该设置将在重新加载窗口后生效，是否立即重启？", "立即重新加载").then((action) => {
					if (action == "立即重新加载") {
						vscode.commands.executeCommand("workbench.action.reloadWindow");
					}
				});
			}

			package_manage.setEmptyText();
			view.refresh("other");
		});
	}

	/**
	 * 复制数据对象
	 * @param object 被复制的数据对象
	 * @returns 数据对象的值
	 */
	static copy(data: any): any {
		return JSON.parse(JSON.stringify(data));
	}
}
