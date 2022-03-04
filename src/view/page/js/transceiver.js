/* 获取VSCodeAPI */
let vscode = acquireVsCodeApi();

// 接收扩展命令
window.addEventListener("message", (event) => {
	let command = event.data.command;
	let data = event.data.data;

	switch (command) {
		case "refresh":
			refresh(data);
			break;

		case "task":
			loadTaskEditor(data);
			break;

		case "list":
			loadListEditor();
			break;

		case "item":
			loadItemEditor(data);
			break;

		default:
			send("page.message", "Page命令\"" + command + "\"不存在。");
			break;
	}
});

/**
 * 发送扩展命令
 * @param {string} command 命令文本
 * @param {any} data 通信数据
 */
function send(command, data) {
	vscode.postMessage({ command: command, data: data });
}
