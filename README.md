# TodoTodo - 待办事项

## 简介:book:

作为新生代农民工:farmer:，一款内置于VSCode的Todo工具:wrench:或许能改善一点生活质量。

这款插件能在侧边栏显示待办事项:label:，尽量减少对日常编码工作:computer:的影响。

## 功能:book:

- 通过不同的清单:page_with_curl:来规划事项:label:。
- 通过主页:page_facing_up:编辑清单:page_with_curl:。
- 通过主页:page_facing_up:新建或编辑事项:label:。
- 通过主页:page_facing_up:显示日志:file_cabinet:，对事项:label:的操作一目了然。
- 带截止时间事项:label:的逾期提醒:watch:。
- 设置正在办理的事项:label:，在达到截止时间时自动完成:heavy_check_mark:。
- 提供了部分个性化设置:gear:，根据自身体验设置相应功能:v:。

## Todo结构:book:

- **List - 类别清单**:page_with_curl:
  - 事项排序
    1. 是否长期
      - 长期事项优先
    2. 时间
       - 升序 - Todo事项
       - 降序 - Done事项
    3. 优先层级
       - 高优先层级优先
- **Item - 基本事项**:label:
  - 事项标题:pen:
  - 优先层级:top:
  - [周期:date:]
  - [时间:clock12:]
    - 截止时间:alarm_clock: - Todo事项
    - 完成时间:heavy_check_mark: - Done事项
  - [目标地点:round_pushpin:]
  - [目标邮箱:email:]
  - [事项细节:memo:]

> 默认清单将在设置中置顶，但在侧边栏中以优先层级排列。

**:warning:建议修改清单路径，默认路径将在更新时被清除！:warning:**

## 更多信息:book:

- :git:项目开始时间: **2021.11.01-03:08**

> :house:Gitee地址：[https://gitee.com/tatsukana/todo-todo](https://gitee.com/tatsukana/todo-todo)
> <br>
> :mailbox_with_mail:如有其它需求或者BUG希望大家在ISSUE中提出！