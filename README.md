# TodoTodo - 待办事项

## 简介

在侧边栏显示待办事项。

> Gitee地址：[https://gitee.com/tatsukana/todo-todo](https://gitee.com/tatsukana/todo-todo)

## Todo结构

- **List - 类别清单**
  - 事项排序
    1. 是否长期
      - 长期事项优先
    2. 时间
       - 升序 - Todo事项
       - 降序 - Done事项
    3. 优先级
       - 高优先级优先
- **Item - 基本事项**
  - 事项标题
  - 事件级别
  - [目标地点]
  - [目标邮箱]
  - [事项细节]
  - [周期]
  - [时间]
    - 截止时间 - Todo事项
    - 完成时间 - Done事项

## 扩展设置

- `todotodo.delete.item.remind`: 在删除事项时显示确认对话框。
- `todotodo.delete.list.remind`: 在删除清单时显示确认对话框。
- `todotodo.delete.list.method`: 删除清单时，原有事项的处理方法。
- `todotodo.show.emptyList`: 是否显示空清单。
- `todotodo.listPath`: 清单文件目录路径（绝对路径）。

## 最近更新

### 0.0.1 - 2021.11.24
- 新增：发布扩展