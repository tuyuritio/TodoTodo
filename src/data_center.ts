export namespace data {
	/**
	 * 复制数据对象
	 * @param data 被复制的数据对象
	 * @returns 数据对象的值
	 */
	export function copy(data: any): any {
		return data != undefined ? JSON.parse(JSON.stringify(data)) : undefined;
	}

	export namespace configuration {
		export let path: string;
		export let add_action: string;
		export let item_delete_remind: boolean;
		export let list_remove_remind: boolean;
		export let shut_ahead: string;
		export let empty_list: boolean;
	}

	export namespace profile {
		export let list_priority: any;
		export let tree_type: boolean;
	}

	export namespace task {
		export let task: any;
	}

	export namespace list {
		export let todo: any;
		export let done: any;
		export let fail: any;
	}

	export namespace page {
		export let html: string;
		export let css: any;
		export let js: any;
		export let icon: any;
	}
}
