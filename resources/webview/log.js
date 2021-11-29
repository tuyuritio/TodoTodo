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

		// 周期事项预处理
		if (log.old.cycle || log.new.cycle) {
			if (log.old.cycle == "daily") {
				log.old.time = "每日" + log.old.time.substr(11, 5);
			} else if (log.old.cycle == "weekly") {
				let week_days = "一二三四五六日";
				log.old.time = "每周" + week_days.charAt((toDate(log.old.time).getDay() + 6) % 7) + log.old.time.substr(11, 5);;
			}
			delete log.old.cycle;

			if (log.new.cycle == "daily") {
				log.new.time = "每日" + log.new.time.substr(11, 5);
			} else if (log.new.cycle == "weekly") {
				let week_days = "一二三四五六日";
				log.new.time = "每周" + week_days.charAt((toDate(log.new.time).getDay() + 6) % 7) + log.new.time.substr(11, 5);;
			}
			delete log.new.cycle;
		}

		// 日志记录
		let new_log = document.createElement("li");
		{
			// 日志时间
			let time_information = document.createElement("span");
			{
				time_information.className = "time_information";
				time_information.innerHTML = log.time + " :";
			}
			new_log.appendChild(time_information);

			// 日志基础信息
			let log_information = document.createElement("span");
			if (log.list) {
				let log_list_label = document.createElement("span");
				log_list_label.className = "log_label";
				let log_list_content = document.createElement("span");
				log_list_content.className = "log_content";
				{
					log_list_label.innerHTML = "清单:";
					log_list_content.innerHTML = log.list;
				}
				log_information.appendChild(log_list_label);
				log_information.appendChild(log_list_content);

				if (log.item) {
					let log_item_label = document.createElement("span");
					log_item_label.className = "log_label";
					let log_item_content = document.createElement("span");
					log_item_content.className = "log_content";
					{
						log_item_label.innerHTML = "事项:";
						log_item_content.innerHTML = log.item;
					}
					log_information.appendChild(log_item_label);
					log_information.appendChild(log_item_content);
				}

				let connect = document.createElement("span");
				connect.className = "connect";
				connect.innerHTML = "-";
				log_information.appendChild(connect);
			}

			// 操作类型
			let key_table = {
				add: "已建立",
				delete: "已删除",
				append: "已追加",
				edit: "已编辑",
				accomplish: "已完成",
				shut: "已失效",
				redo: "已重做",
				restart: "已重启",
			}
			if (log.action in key_table) {
				let log_type = document.createElement("span");
				if (log.action == "delete" || log.action == "shut") {
					log_type.className = "change_warning";
				} else if (log.action == "accomplish" || log.action == "add") {
					log_type.className = "change_highlight";
				} else {
					log_type.className = "change_common";
				}

				log_type.innerHTML = key_table[log.action];
				log_information.appendChild(log_type);
			} else {
				log_information.className = "log_text";
				if (log.action == "clear") {
					log_information.innerHTML = "已清理所有已办事项";
				} else if (log.action == "welcome") {
					log_information.innerHTML = "欢迎使用TodoTodo！";
				}
			}
			new_log.appendChild(log_information);

			if (log.action == "edit") {
				let edits = document.createElement("ul");
				let new_property = Object.keys(log.new);
				let old_property = Object.keys(log.old);

				// 遍历新数据
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
						edit_content.className = "edit_content";
						{
							let property_table = {
								label: "事项名称:",
								type: "事项类别:",
								priority: "优先层级:",
								cycle: "事项周期:",
								time: "截止时间:",
								place: "目标地点:",
								mail: "目标邮件:",
								particulars: "事项细节:"
							}
							edit_content.innerHTML = property_table[property];
						}
						edit.appendChild(edit_content);

						if (edit_type.innerHTML == "=") {
							let old_data = document.createElement("span");
							old_data.className = "log_data";
							let change = document.createElement("span");
							change.className = "log_change";
							{
								old_data.innerHTML = log.old[property];
								change.innerHTML = "=>";
							}
							edit.appendChild(old_data);
							edit.appendChild(change);
						}

						let new_data = document.createElement("span");
						new_data.className = "log_data";
						new_data.innerHTML = log.new[property];
						edit.appendChild(new_data);
					}
					edits.appendChild(edit);
				}

				// 遍历旧数据
				for (let i = 0; i < old_property.length; i++) {
					let property = old_property[i];

					// 相对新数据去重
					if (!new_property.includes(property)) {
						let edit = document.createElement("li");
						{
							let edit_type = document.createElement("span");
							edit_type.className = "edit_type";
							edit_type.innerHTML = "-";
							edit.appendChild(edit_type);

							let edit_content = document.createElement("span");
							edit_content.className = "edit_content";
							{
								let property_table = {
									label: "事项名称:",
									type: "事项类别",
									priority: "优先层级",
									cycle: "事项周期",
									time: "截止时间",
									place: "目标地点",
									mail: "目标邮件",
									particulars: "事项细节"
								}
								edit_content.innerHTML = property_table[property];
							}
							edit.appendChild(edit_content);

							let old_data = document.createElement("span");
							old_data.className = "log_data";
							old_data.innerHTML = log.old[property];
							edit.appendChild(old_data);
						}
						edits.appendChild(edit);
					}
				}
				new_log.appendChild(edits);
			}
		}
		log_list.appendChild(new_log);
	}

	log_list.scrollTop = log_list.scrollHeight;
}