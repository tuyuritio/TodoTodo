<!-- 模板
### 版本号 - 更新日期
- **新增:** 
- **修改:** 
- **移除:** 
-->

### 3.6.1 - 2022.04.10
- **修改:** 失效事项转为已办时失效事项未删除的bug

### 3.6.0 - 2022.04.08
- **新增:** 跳过事项
- **新增:** 逾期事项转换为已办事项
- **修改:** 周期显示-2的bug
- **修改:** 优化输入框显示逻辑

### 3.5.4 - 2022.03.19
- **修改:** 已有事项编辑时填充事项周期性质
- **修改:** 长期事项修改时间显示错误
- **修改:** 修改后自动保存本地文件
- **修改:** 连续点击报错的bug

### 3.5.0 - 2022.03.18
- **新增:** 补签任务
- **修改:** 重构Task结构
- **修改:** 默认路径无法保存的bug
- **修改:** 命令面板"创建清单"与"建立任务"交换
- **修改:** "历史打卡"->"打卡记录"

### 3.4.0 - 2022.03.10
- **新增:** 数据兼容模块
- **新增:** 自定义事项周期
- **修改:** 优化数据读取
- **修改:** List数据独立
- **修改:** 部分变量声明为const
- **修改:** "截止周次"->"截止星期"
- **移除:** 3.2.0兼容性调整
- **移除:** 长期事项以最后修改时间排序
- **移除:** 事项周期选择
- **移除:** "暂未打卡"显示

### 3.3.1 - 2022.03.08
- **修改:** 启动方式改为立即启动

### 3.3.0 - 2022.03.07
- **新增:** 清单显示剩余待办件数
- **新增:** 3.2.0兼容性调整
- **修改:** 追加事项取消专注
- **修改:** 以列表显示事项时隐藏空清单设置
- **修改:** 归档任务悬浮文本
- **修改:** 启动方式改为加载启动或视图启动
- **修改:** 未开始打卡时检测错误的bug
- **移除:** 条目标题
- **移除:** 重启所有失效事项
- **移除:** 变更全部任务状态
- **移除:** 新建待办事项按钮

### 3.2.0 - 2022.03.06
- **新增:** 已办事项悬浮显示条目
- **新增:** 未办事项悬浮显示条目
- **新增:** 通过整型匹配周次
- **新增:** 归档任务
- **新增:** 打卡天数显示
- **新增:** 打卡历史悬浮显示
- **修改:** 上传文件
- **修改:** 删除事项图标改为警告
- **修改:** 移除清单图标改为警告
- **修改:** 无法删除失效事项的bug
- **移除:** 2.1.0兼容性调整
- **移除:** 无效快捷键

### 3.1.0 - 2022.03.06
- **新增:** 命令面板更改待办视图
- **新增:** 命令面板占位显示剩余待办件数
- **修改:** README文档
- **修改:** 启动方式改为立即启动
- **修改:** 无法调整任务的bug
- **修改:** 任务视图显示bug
- **修改:** 追加事项错误的bug
- **修改:** 搜索关键词
- **修改:** 采用个人编码规范
- **移除:** 建立任务图标
- **移除:** 状态栏剩余待办显示
- **移除:** 显示空清单的设置
- **移除:** 冗余代码

### 3.0.0 - 2022.03.05
- **新增:** 任务输入编辑器
- **新增:** 清单输入编辑器
- **新增:** 事项输入编辑器
- **新增:** 条目输入编辑器
- **新增:** 条目处理器
- **新增:** 空清单显示切换
- **新增:** 清单ID
- **新增:** 剩余待办显示位置的设置
- **新增:** 暂存清单
- **新增:** 2.1.0兼容性调整
- **修改:** "添加事项"->"新建事项"
- **修改:** "移除条目"->"删除条目"
- **修改:** 清空已办事项图标失效的bug
- **修改:** 优化代码结构
- **修改:** 规范文件存储结构
- **移除:** 事项主页
- **移除:** 删除事项提示的设置
- **移除:** 删除清单提示的设置
- **移除:** 新建事项后事项编辑器动作的设置
- **移除:** 冗余代码

### 2.1.0 - 2022.03.04
- **新增:** 完成部分Tree操作后将关闭主页
- **新增:** 读取数据
- **新增:** 主页将在侧边展开
- **新增:** 长期事项新增最后修改时间
- **新增:** 长期事项以最后修改时间排序
- **新增:** 2.0.1兼容性调整
- **修改:** 读取数据与保存数据快捷键可在所有视图使用
- **修改:** 条目更改失败的bug
- **修改:** 修改版本上传文件
- **修改:** 删除事项无提示的bug
- **修改:** 删除事项提示无法设置的bug
- **修改:** 优化刷新逻辑
- **修改:** 无法更改待办视图的bug
- **修改:** 修改路径后直接刷新数据
- **修改:** 无法操作条目的bug
- **修改:** 事项事项采用整型存储
- **移除:** 显示主页
- **移除:** 刷新视图
- **移除:** 重启窗口的提示
- **移除:** 主页事项状态显示
- **移除:** 1.0.3兼容性调整

### 2.0.1 - 2022.02.21
- **修改:** 版本上传文件缺失

### 2.0.0 - 2022.02.21
- **新增:** 1.0.3的兼容性调整
- **新增:** 每日打卡任务
- **新增:** 快捷键可作用于Task面板
- **新增:** 专注事项的功能设置
- **新增:** 搜索关键词
- **新增:** 删除失效事项
- **修改:** 全局重构，采用事件驱动结构
- **修改:** 优化命令结构
- **修改:** 优化文件存储方式
- **修改:** 优化Page页面显示
- **修改:** "正在办理事项"->"专注事项"
- **修改:** "新建事项"->"添加事项"
- **修改:** "新建清单"->"创建清单"
- **修改:** "编辑清单"->"修改清单"
- **修改:** "删除清单"->"移除清单"
- **修改:** "暂时没有待办事项，芜湖起飞！"->"当前暂无待办事项。"
- **修改:** "暂时没有已办事项，加油冲冲冲！"->"当前暂无已办事项。"
- **修改:** "暂时没有失效事项，不错加油！"->"当前暂无失效事项。"
- **修改:** 事项逾期预警时间格式"\*\*h\*\*m\*\*s"->"HH:MM"
- **移除:** 设置"正在办理事项的提示方式"
- **移除:** Todo清单空清单提示文本设置
- **移除:** Done清单空清单提示文本设置
- **移除:** Fail清单空清单提示文本设置
- **移除:** 0.14.8的兼容性调整
- **移除:** Page页面日志显示
- **移除:** 默认清单
- **移除:** 删除清单的方法设置
- **移除:** 以24小时为间隔的事项检测
- **移除:** 错误路径使用默认路径替代

### 1.0.3 - 2022.01.25
- **修改:** 删减冗余代码
- **修改:** 追加事项无法从重启和重做的bug

### 1.0.1 - 2022.01.21
- **修改:** 视图同步报错的bug

### 1.0.0 - 2022.01.21
- **新增:** 逾期预警
- **新增:** 逾期预警自定义时间设置
- **新增:** 事项编辑面板的删除按键
- **新增:** profile_center
- **新增:** 单击状态栏改变TodoTree显示方式
- **新增:** TodoTree中Ctrl+S保存数据
- **新增:** TodoTree中F5刷新
- **新增:** 0.14.8的兼容性调整
- **修改:** 刷新视图后，原有数据未完成覆盖的bug
- **修改:** 默认条目名称的删改逻辑
- **修改:** 直接删除条目后没有日志的bug
- **修改:** 直接删除完所有条目后事项仍在展开状态的bug
- **修改:** 变动事项后仍在Page编辑状态的bug
- **修改:** 优化快捷键操作
- **修改:** 重启失效事项无效的bug
- **修改:** Tree操作会强制打开Page的bug
- **修改:** 文件路径仅读取一次
- **修改:** 强制刷新失效的bug
- **修改:** README文档
- **修改:** 增强代码可读性
- **修改:** 优化运行速度
- **移除:** 作用于主页的强制刷新
- **移除:** 样例事项

### 0.14.8 - 2021.12.17
- **修改:** 清单优先级失效的bug
- **修改:** 日志面板布局自适应

### 0.14.6 - 2021.12.17
- **修改:** 已办事项重做后日志无法正常显示的bug
- **修改:** 失效事项重启后日志无法正常显示的bug
- **修改:** 失效事项重启后直接逾期的bug

### 0.14.3 - 2021.12.17
- **修改:** 长期事项失效后不显示失效时间的bug

### 0.14.2 - 2021.12.16
- **修改:** 已办事项时间标题显示为"完成时间"
- **修改:** 失效事项显示"失效时间"

### 0.14.0 - 2021.12.16
- **新增:** 日志对条目的支持
- **修改:** 条目类别重复的bug
- **修改:** 日志面板加宽100px
- **移除:** 预置条目类别

### 0.13.0 - 2021.12.15
- **新增:** 条目类别预选
- **修改:** 无法追加周期事项的bug
- **修改:** 优化快捷键操作

### 0.12.0 - 2021.12.15
- **新增:** 事项条目
  - 可修改状态
  - 可删除
- **新增:** done和fail事件禁用编辑
- **修改:** 优化清单列表视图
- **修改:** Ctrl+Enter会新建两个事项的bug
- **修改:** 日志面板的最小宽度和缩放控制
- **修改:** 整理Webview文件路径
- **修改:** 事项信息直接显示在编辑面板中
- **移除:** 日志色彩高亮的设置
- **移除:** 事项信息面板
- **移除:** 目标地点
- **移除:** 目标邮箱
- **移除:** 事项详情
- **移除:** 启动时的欢迎文本
- **移除:** 右键编辑事项
- **移除:** 右侧时间的设置

### 0.11.0 - 2021.12.05
- **新增:** 清单编辑器Enter键提交
- **新增:** 编辑器Shift+Delete清楚当前输入框内容
- **修改:** 手动刷新后无法编辑事项和清单的bug
- **修改:** 逾期事项未自动检测的bug
- **移除:** 所有控制台输出

### 0.10.0 - 2021.12.02
- **新增:** Ctrl+Shift+N新建事项
- **修改:** Page无法加载的bug

### 0.9.0 - 2021.12.01
- **新增:** 文件路径错误后可从提示弹窗跳转到路径设置
- **新增:** 文件路径更改后可从提示弹窗重新加载窗口
- **新增:** 空清单视图文本更改后可从提示弹窗重新加载窗口
- **修改:** 源码文件目录重构
- **移除:** v0.4.3的兼容性调整
- **移除:** 设置中有关重新加载窗口提示的说明

### 0.8.19 - 2021.12.01
- **修改:** 新建事项时无法新建清单的bug

### 0.8.18 - 2021.12.01
- **修改:** 优化日志视图布局

### 0.8.17 - 2021.12.01
- **修改:** 事项排序时数据冲突的bug

### 0.8.16 - 2021.12.01
- **修改:** 周期事项完成和失效后影响其它事项的bug
- **修改:** 重构data_center，避免了毫无意义的private和getter&setter方法
- **修改:** 逾期事项不会自动失效的bug

### 0.8.13 - 2021.12.01
- **修改:** 周期事项完成和失效后追加时出现的bug

### 0.8.12 - 2021.11.30
- **修改:** 隐藏日志滚动条
- **修改:** 更新日志更新条目类型加粗

### 0.8.10 - 2021.11.30
- **修改:** 编辑事项时输入法Enter键提交的bug

### 0.8.9 - 2021.11.30
- **修改:** 清单优先级排序错误的bug
- **修改:** 清单名称无法修改的bug

### 0.8.7 - 2021.11.30
- **修改:** 优化Page聚焦事件
- **修改:** 移除README的Emoji

### 0.8.5 - 2021.11.30
- **修改:** 加载时任务栏进程不显示的bug

### 0.8.4 - 2021.11.30
- **修改:** 优化Page布局
- **修改:** 优化README文档
- **修改:** 更新日志的项目启动时间精确至秒
- **修改:** 项目启动时间纠正为2021.11.01-03:08:16

### 0.8.0 - 2021.11.30
- **新增:** 使用Esc键关闭编辑器
- **新增:** 保存数据功能
- **修改:** 清单名称中含有非法字符导致无法写入的bug
- **修改:** 将所有的keypress监听改为keydown监听
- **修改:** 手动刷新视图改为仅读取数据

### 0.7.0 - 2021.11.30
- **新增:** 设置正在办理事项的效果
- **新增:** 设置禁用正在办理功能
- **新增:** 补充0.1.0以前的版本更新日志
- **修改:** 日志显示方式改为滚动条置底
- **修改:** 事项细节输入框无法Ctrl+Enter提交的bug

### 0.6.0 - 2021.11.29
- **新增:** 从本地导入清单输入后，可以通过手动刷新重新加载数据
- **新增:** 手动刷新可刷新主页
- **新增:** 全新带色彩标注的日志系统
- **新增:** 设置是否在启动时在日志中显示欢迎文本
- **新增:** 设置是否显示日志色彩高亮
- **修改:** 空路径报错的bug
- **移除:** v0.2.3的兼容性适配

### 0.5.2 - 2021.11.29
- **修改:** v0.4.3的兼容性适配
- **修改:** 早期版本编号错误"v0.4.1"->"0.4.3"

### 0.5.0 - 2021.11.29
- **新增:** 扩展停用文本"扩展 \"TodoTodo\" 已关闭"
- **修改:** 从文件读取方式改为内存读取方式，极大提升插件响应速度（小于之前的1/100）
- **修改:** Todo事项文件夹"ListData"->"TodoData"
- **移除:** 日志系统

### 0.4.3 - 2021.11.28
- **修改:** 输入时直接新建事项的bug
- **修改:** 将日志操作移动至专有文件
- **修改:** 小键盘区Enter键无效的bug

### 0.4.0 - 2021.11.28
- **新增:** 选中类别后聚焦到事项名称输入框
- **新增:** 选中"其它"类别后聚焦到事项类别输入框
- **新增:** 事项编辑器中，使用Enter键聚焦到下一个输入框

### 0.3.17 - 2021.11.28
- **修改:** 新建事项后无法继续新建的bug
- **修改:** 清单列表"可用操作"居中

### 0.3.15 - 2021.11.28
- **修改:** 无法新建事项的bug
- **修改:** 编辑事项时覆盖类别错误的bug
- **修改:** 编辑事项时刷新后覆盖数据丢失的bug
- **修改:** 已打开主页后，在其它页面中无法通过侧边栏命令直接跳转到主页的bug
- **修改:** JavaScript文件分离
- **修改:** 事项信息周期事项时间显示错误的bug
- **修改:** 将主页通信接收事件移交由command_manage管理，禁止普通文件调用command命令
- **修改:** 重构page，由POP模式改为OOP模式，方便事件管理

### 0.3.7 - 2021.11.27
- **修改:** 编辑事项时无法获取类别的bug
- **修改:** 编辑事项后不会关闭编辑面板的bug
- **修改:** 新建事项后不保留类别和优先级的bug
- **修改:** 扩展激活文本"Extension \"TodoTodo\" is now active."->"扩展 \"TodoTodo\" 已激活！"
- **修改:** 清单列表改用table模式
- **修改:** 默认清单名称"普通"->"默认清单"
- **修改:** 清单路径仅在激活扩展时获取一次

### 0.3.0 - 2021.11.27
- **新增:** 单击事项显示事项信息
- **新增:** v0.2.3及更早版本的本地清单文件的兼容性调整
- **新增:** 可编辑清单信息
- **新增:** 清单优先层级排序
- **新增:** 通过清单编辑器删除清单
- **新增:** 正在办理的事项在到达截止时间时自动完成
- **修改:** 显示截止时间提醒无效的bug
- **修改:** 设置项"是否在事项右侧显示截止时间"->"在事项右侧显示截止时间"
- **修改:** 无法新建每日事项的bug

### 0.2.3 - 2021.11.26
- **修改:** 设置不显示截止时间提醒后警示图标不显示的bug
- **修改:** 删除冗余代码
- **修改:** 创建默认ListData目录失败的bug

### 0.2.0 - 2021.11.26
- **新增:** 扩展市场搜索关键字: todo、todolist
- **新增:** 自定义空清单视图提示文本
- **新增:** 异常路径使用默认路径并提示
- **新增:** 新建事项后可以选择是否保留已填数据或关闭编辑器
- **新增:** 可以选择启动当前事项，并闪烁提示
- **新增:** 设置是否显示截止时间提醒
- **修改:** 重构command_manage，由OOP模式改为POP模式，使用namespace，增强代码可读性，为模块间的强制调用提供方便
- **修改:** 更改设置后命令无法注册的bug
- **修改:** 图标路径安全性
- **修改:** 未打开Page前无法删除清单的bug
- **修改:** 新建类别后类别选项实时显示重复的bug
- **修改:** 优先级显示重复的bug
- **修改:** Page视图改为row向排列
- **修改:** Page视图日志行高增加
- **修改:** 名义修改旧版本号
  - 0.0.6 -> 0.1.5
  - 0.0.5 -> 0.1.4
  - 0.0.1 -> 0.1.0

### 0.1.5 - 2021.11.25
- **修改:** 创建默认ListData目录失败的bug

### 0.1.4 - 2021.11.25
- **修改:** 日志倒序输出
- **修改:** 状态栏"剩余待办事项"->"剩余待办"
- **修改:** Todo事项优先级排序失效的bug
- **修改:** 创建ListData目录失败的bug

### 0.1.0 - 2021.11.24
- **修改:** 将Done事项、Fail事项分离出独立文件，Todo事项在文件夹中处理

### 0.1.0-alpha.4.1 - 2021.11.24
- **修改:** 优化刷新操作

### 0.1.0-alpha.4.0 - 2021.11.24
- **新增:** 编辑后关闭编辑面板
- **新增:** 新建类别后刷新Page

### 0.1.0-alpha.3.3 - 2021.11.24
- **修改:** 新增周期事项无法正确输入时间的bug
- **修改:** 每周事项编辑的默认值
- **修改:** 无法新增每周事项的bug

### 0.1.0-alpha.3.0 - 2021.11.24
- **新增:** 自定义清单文件路径（暂不支持部分异常路径处理）

### 0.1.0-alpha.2.0 - 2021.11.24
- **移除:** 残余测试数据

### 0.1.0-alpha.1.0 - 2021.11.24
- **新增:** 扩展图标

### 0.0.1 - 2021.11.24
- **新增:** 正式发布扩展

### 0.0.0 - 2021.11.01-03:08:16
- **新增:** 项目启动