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
		export let shut_ahead: string;
		export let empty_list: boolean;
		export let hint_position: string;
	}

	export namespace profile {
		export let list: any;
		export let tree_type: boolean;
		export let empty_list: boolean;
	}

	export namespace task {
		export let task: any;
	}

	export namespace list {
		export let todo: any;
		export let done: any;
		export let fail: any;
	}
}
