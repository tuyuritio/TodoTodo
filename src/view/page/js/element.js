/**
 * 获取元素
 * @param {string} id 元素ID
 * @returns 元素对象
 */
function $(id) {
	return document.getElementById(id);
}

/**
 * 获取指定标签的元素对象集合
 * @param {keyof HTMLElementTagNameMap} tag 
 * @returns 元素对象集合
 */
function $tag(tag) {
	return document.getElementsByTagName(tag);
}

/**
 * 获取指定类的元素对象集合
 * @param {string} class_name 
 * @returns 元素对象集合
 */
function $class(class_name) {
	return document.getElementsByClassName(class_name);
}

/**
 * 创建元素
 * @param {keyof HTMLElementTagNameMap} tag 
 * @returns 元素对象
 */
function $$(tag) {
	return document.createElement(tag);
}

/**
 * 删除元素
 * @param {HTMLElement} element 元素对象
 */
function $R(element) {
	element.parentElement.removeChild(element);
}

/**
 * 为父元素添加子元素
 * @param {HTMLElement} element 父元素
 * @param {HTMLElement} child 子元素
 */
function $I(element, child) {
	if (child) element.appendChild(child);
}
