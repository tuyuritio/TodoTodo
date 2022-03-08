export namespace Data {
	/**
	 * 复制数据对象
	 * @param data 被复制的数据对象
	 * @returns 数据对象的值
	 */
	export function Copy(data: any): any {
		return data != undefined ? JSON.parse(JSON.stringify(data)) : undefined;
	}

	export namespace Configuration {
		export let path: string;
		export let shut_ahead: string;
	}

	export namespace Profile {
		export let data_version: string;
		export let list: any;
		export let tree_type: boolean;
		export let empty_list: boolean;
	}

	export namespace Task {
		export let task: any;
	}

	export namespace List {
		export let todo: any;
		export let done: any;
		export let fail: any;
	}
}
