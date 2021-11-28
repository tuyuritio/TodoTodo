/**
 * 清空日志
 */
function clearAllLog() {
	while (log_list.firstElementChild) {
		log_list.removeChild(log_list.firstElementChild);
	}
}

/**
 * 显示日志
 * @param log_data 日志数据
 */
function showLog(log_data) {
	for (let index = 0; index < log_data.length; index++) {
		let log = log_data[index];

		let new_log = document.createElement("li");

		let time_information = document.createElement("span");
		time_information.setAttribute("class", "time_information");
		time_information.innerHTML = log.time + " :";
		new_log.appendChild(time_information);

		let log_information = document.createElement("span");

		if (log.list) {
			let log_list_label = document.createElement("span");
			log_list_label.innerHTML = "清单:";
			log_information.appendChild(log_list_label);

			let log_list_content = document.createElement("span");
			log_list_content.innerHTML = log.list;
			log_information.appendChild(log_list_content);

			if (log.item) {
				let log_item_label = document.createElement("span");
				log_item_label.innerHTML = "事项:";
				log_information.appendChild(log_item_label);

				let log_item_content = document.createElement("span");
				log_item_content.innerHTML = log.item;
				log_information.appendChild(log_item_content);
			}

			let connect = document.createElement("span");
			connect.innerHTML = "-";
			log_information.appendChild(connect);
		}


		let log_type = document.createElement("span");
		switch (log.action) {
			case "add":
				log_type.innerHTML = "已建立";
				log_information.appendChild(log_type);
				new_log.appendChild(log_information);
				break;

			case "delete":
				log_type.innerHTML = "已删除";
				log_information.appendChild(log_type);
				new_log.appendChild(log_information);
				break;

			case "append":
				log_type.innerHTML = "已追加";
				log_information.appendChild(log_type);
				new_log.appendChild(log_information);
				break;

			case "edit":
				log_type.innerHTML = "已编辑";
				log_information.appendChild(log_type);
				new_log.appendChild(log_information);

				let edits = document.createElement("ul");
				let new_property = Object.keys(log.new);
				let old_property = Object.keys(log.old);

				for (let i = 0; i < new_property.length; i++) {
					let property = new_property[i];

					let edit = document.createElement("li");
					{
						let edit_type = document.createElement("span");
						edit_type.className = "edit_type";
						if (old_property.includes(property)) {
							edit_type.innerHTML = "=";
						} else {
							edit_type.innerHTML = "+";
						}
						edit.appendChild(edit_type);

						let edit_content = document.createElement("span");
						switch (property) {
							case "label":
								edit_content.innerHTML = "事项名称:";
								break;

							case "type":
								edit_content.innerHTML = "事项类别:";
								break;

							case "priority":
								edit_content.innerHTML = "优先层级:";
								break;

							case "cycle":
								edit_content.innerHTML = "事项周期:";
								break;

							case "time":
								edit_content.innerHTML = "截止时间:";
								break;

							case "place":
								edit_content.innerHTML = "目标地点:";
								break;

							case "mail":
								edit_content.innerHTML = "目标邮件:";
								break;

							case "particulars":
								edit_content.innerHTML = "事项细节:";
								break;
						}
						edit.appendChild(edit_content);

						if (edit_type.innerHTML == "=") {
							let old_data = document.createElement("span");
							old_data.innerHTML = log.old[property];

							let change = document.createElement("span");
							change.innerHTML = "=>";

							edit.appendChild(old_data);
							edit.appendChild(change);
						}

						let new_data = document.createElement("span");
						new_data.innerHTML = log.new[property];
						edit.appendChild(new_data);
					}
					edits.appendChild(edit);
				}

				for (let i = 0; i < old_property.length; i++) {
					let property = old_property[i];

					if (!new_property.includes(property)) {
						let edit = document.createElement("li");
						{
							let edit_type = document.createElement("span");
							edit_type.className = "edit_type";
							edit_type.innerHTML = "-";
							edit.appendChild(edit_type);

							let edit_content = document.createElement("span");
							switch (property) {
								case "label":
									edit_content.innerHTML = "事项名称:";
									break;

								case "type":
									edit_content.innerHTML = "事项类别:";
									break;

								case "priority":
									edit_content.innerHTML = "优先层级:";
									break;

								case "cycle":
									edit_content.innerHTML = "事项周期:";
									break;

								case "time":
									edit_content.innerHTML = "截止时间:";
									break;

								case "place":
									edit_content.innerHTML = "目标地点:";
									break;

								case "mail":
									edit_content.innerHTML = "目标邮件:";
									break;

								case "particulars":
									edit_content.innerHTML = "事项细节:";
									break;
							}
							edit.appendChild(edit_content);

							let old_data = document.createElement("span");
							old_data.innerHTML = log.old[property];
							edit.appendChild(old_data);
						}
						edits.appendChild(edit);
					}
				}

				new_log.appendChild(edits);

				break;

			case "accomplish":
				log_type.innerHTML = "已完成";
				log_information.appendChild(log_type);
				new_log.appendChild(log_information);
				break;

			case "shut":
				log_type.innerHTML = "已失效";
				log_information.appendChild(log_type);
				new_log.appendChild(log_information);
				break;

			case "redo":
				log_type.innerHTML = "已重做";
				log_information.appendChild(log_type);
				new_log.appendChild(log_information);
				break;

			case "restart":
				log_type.innerHTML = "已重启";
				log_information.appendChild(log_type);
				new_log.appendChild(log_information);
				break;

			case "clear":
				log_information.innerHTML = "已清理所有已办事项";
				new_log.appendChild(log_information);
				break;

			case "welcome":
				log_information.innerHTML = "欢迎使用TodoTodo！";
				new_log.appendChild(log_information);
				break;
		}


		log_list.appendChild(new_log);
	}
}

// : . ->
// => --> ==>
// 清单: 默认清单 -> 事项: 测试事项 - 已删除
// 清单: 默认清单 - 已删除
/*
清单: 默认清单 -> 事项: 测试事项 - 已编辑
	= 事项类别: 测试清单 => 默认清单
	= 优先层级: 0 => 1
	- 目标地点: 一个地方
	+ 目标邮箱: aa@gmail.com
*/
