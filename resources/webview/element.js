/**
 * 获取标签对象
 * @param id 标签ID
 * @returns 标签对象
 */
function get(id) {
	return document.getElementById(id);
}

/**
 * 设置文档标签
 */
function setElements() {
	action_text = get("action_text");
	arrow_down = get("arrow_down");
	arrow_up = get("arrow_up");
	clear_log = get("clear_log");
	close_item_editor = get("close_item_editor");
	complete_button = get("complete_button");
	cycle = get("cycle");
	daily = get("daily");
	datetime = get("datetime");
	detail_panel = get("detail_panel");
	item_editor = get("item_editor");
	item_editor_title = get("item_editor_title");
	input_type = get("other_type");
	item_information = get("item_information");
	item_label = get("item_label");
	item_type = get("item_type");
	item_priority = get("item_priority");
	item_place = get("item_place");
	item_mail = get("item_mail");
	item_particulars = get("item_particulars");
	item_time = get("item_time");
	label = get("label");
	label_value = get("label_value");
	list_editor = get("list_editor");
	list_table = get("list_table");
	log_list = get("log_list");
	mail = get("mail");
	mail_value = get("mail_value");
	maximum = get("maximum");
	once = get("once");
	other = get("other");
	particulars_value = get("particulars_value");
	place = get("place");
	place_value = get("place_value");
	priority = get("priority");
	priority_value = get("priority_value");
	select_time = get("select_time");
	select_type = get("select_type");
	show_detail = get("show_detail");
	time_type = get("time_type");
	time_value = get("time_value");
	textarea = get("particulars");
	type_value = get("type_value");
	weekly = get("weekly");
}