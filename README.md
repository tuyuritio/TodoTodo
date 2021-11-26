# TodoTodo - 待办事项

## 简介

作为新生代农民工，一款内置于VSCode的Todo工具或许能改善一点生活质量。

这款插件能在侧边栏显示待办事项，尽量减少对日常编码工作的影响。

## 功能

- 通过Webview新建或编辑事项。
- 通过Webview新建或编辑清单。
- 带截止时间事项的逾期提醒。
- 设置正在办理的事项，在达到截止时间时自动完成。
- 通过不同的清单来规划事项。
- 通过Webview显示日志，对事项的操作一目了然。

## Todo结构

- **List - 类别清单**
  - 事项排序
    1. 是否长期
      - 长期事项优先
    2. 时间
       - 升序 - Todo事项
       - 降序 - Done事项
    3. 优先层级
       - 高优先层级优先
- **Item - 基本事项**
  - 事项标题
  - 优先层级
  - [周期]
  - [时间]
    - 截止时间 - Todo事项
    - 完成时间 - Done事项
  - [目标地点]
  - [目标邮箱]
  - [事项细节]

## 扩展设置

- `todotodo.delete.item.remind`: 在删除事项时显示确认对话框。
- `todotodo.delete.list.remind`: 在删除清单时显示确认对话框。
- `todotodo.delete.list.method`: 删除清单时，原有事项的处理方法。
- `todotodo.show.emptyList`: 是否显示空清单。
- `todotodo.listPath`: 清单文件目录路径（绝对路径）。

**:warning:建议修改清单路径，默认路径将在更新时被清除！:warning:**

## 更多信息

项目开始时间: **2021.11.01-03:18**

> Gitee地址：[https://gitee.com/tatsukana/todo-todo](https://gitee.com/tatsukana/todo-todo)
> <br>
> 如有其它需求或者BUG希望大家可以在ISSUE中提出！