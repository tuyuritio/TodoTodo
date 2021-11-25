/**
 * 将时间字符串"YYYY/MM/DD-hh:mm"转换为Date对象
 * @param time 时间文本
 * @returns Date对象
 */
export function toDate(time: string) {
	let year = Number(time.substr(0, 4));
	let month = Number(time.substr(5, 2));
	let day = Number(time.substr(8, 2));
	let hour = Number(time.substr(11, 2));
	let minute = Number(time.substr(14, 2));

	return new Date(year, month - 1, day, hour, minute);
}

/**
 * 将"YYYY/MM/DD-hh:mm"转换为数字 | 将Date对象转换为数字
 * @param time Date文本 | Date对象
 * @returns Milliseconds
 */
export function toNumber(time: Date | string) {
	let time_object: Date = new Date();

	if (typeof time == "string") {
		let year = Number(time.substr(0, 4));
		let month = Number(time.substr(5, 2));
		let day = Number(time.substr(8, 2));
		let hour = Number(time.substr(11, 2));
		let minute = Number(time.substr(14, 2));

		time_object = new Date(year, month - 1, day, hour, minute);
	}

	if (time instanceof Date) {
		time_object = time;
	}

	return time_object.valueOf();
}

/**
 * 将Date对象转换为时间字符串"YYYY/MM/DD-hh:mm"
 * @param time Date对象
 * @returns 时间文本
 */
export function toString(time: Date): string {
	return time.getFullYear() + "/" + (time.getMonth() + 1).toString().padStart(2, "0") + "/" + time.getDate().toString().padStart(2, "0") + "-" + time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0");
}

/**
 * 判断时间是否在过去或未来24小时内
 * @param time 时间文本
 * @returns 是否在过去或未来24小时内
 */
export function isRecent(time: string) {
	let expected_time = new Date();
	expected_time.setHours(expected_time.getHours() + 24);

	return toNumber(time) < toNumber(expected_time);
}