# Diff Details

Date : 2022-03-06 09:17:34

Directory h:\Project\Extension\todotodo

Total : 71 files,  145 codes, 55 comments, 31 blanks, all 231 lines

[summary](results.md) / [details](details.md) / [diff summary](diff.md) / diff details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.vscodeignore](/.vscodeignore) | Ignore | 16 | 0 | 0 | 16 |
| [CHANGELOG.md](/CHANGELOG.md) | Markdown | 319 | 6 | 53 | 378 |
| [README.md](/README.md) | Markdown | 43 | 0 | 13 | 56 |
| [package.json](/package.json) | JSON | 374 | 0 | 0 | 374 |
| [resources/icon/chevron-down.svg](/resources/icon/chevron-down.svg) | XML | 1 | 0 | 0 | 1 |
| [resources/icon/chevron-up.svg](/resources/icon/chevron-up.svg) | XML | 1 | 0 | 0 | 1 |
| [resources/icon/clear-all.svg](/resources/icon/clear-all.svg) | XML | 1 | 0 | 0 | 1 |
| [resources/icon/close.svg](/resources/icon/close.svg) | XML | 1 | 0 | 0 | 1 |
| [resources/icon/icon_item.svg](/resources/icon/icon_item.svg) | XML | 14 | 1 | 1 | 16 |
| [resources/icon/icon_page.svg](/resources/icon/icon_page.svg) | XML | 12 | 1 | 1 | 14 |
| [resources/icon/icon_platform.svg](/resources/icon/icon_platform.svg) | XML | 11 | 1 | 1 | 13 |
| [resources/icon/icon_task.svg](/resources/icon/icon_task.svg) | XML | 33 | 1 | 1 | 35 |
| [resources/icon/list-unordered.svg](/resources/icon/list-unordered.svg) | XML | 3 | 0 | 1 | 4 |
| [src/control_center.ts](/src/control_center.ts) | TypeScript | 85 | 20 | 15 | 120 |
| [src/data_center.ts](/src/data_center.ts) | TypeScript | 23 | 5 | 5 | 33 |
| [src/extension.ts](/src/extension.ts) | TypeScript | 8 | 3 | 3 | 14 |
| [src/input/entry_inputer.ts](/src/input/entry_inputer.ts) | TypeScript | 52 | 16 | 14 | 82 |
| [src/input/item_inputer.ts](/src/input/item_inputer.ts) | TypeScript | 181 | 32 | 46 | 259 |
| [src/input/list_inputer.ts](/src/input/list_inputer.ts) | TypeScript | 57 | 16 | 17 | 90 |
| [src/input/operation_inputer.ts](/src/input/operation_inputer.ts) | TypeScript | 27 | 5 | 8 | 40 |
| [src/input/task_inputer.ts](/src/input/task_inputer.ts) | TypeScript | 57 | 16 | 17 | 90 |
| [src/interface/file_interface.ts](/src/interface/file_interface.ts) | TypeScript | 173 | 15 | 25 | 213 |
| [src/interface/workspace_interface.ts](/src/interface/workspace_interface.ts) | TypeScript | 17 | 7 | 3 | 27 |
| [src/processer/done_processer.ts](/src/processer/done_processer.ts) | TypeScript | 23 | 8 | 6 | 37 |
| [src/processer/fail_processer.ts](/src/processer/fail_processer.ts) | TypeScript | 26 | 13 | 6 | 45 |
| [src/processer/list_processer.ts](/src/processer/list_processer.ts) | TypeScript | 55 | 19 | 12 | 86 |
| [src/processer/profile_processer.ts](/src/processer/profile_processer.ts) | TypeScript | 12 | 7 | 3 | 22 |
| [src/processer/task_processer.ts](/src/processer/task_processer.ts) | TypeScript | 98 | 28 | 25 | 151 |
| [src/processer/todo_processer.ts](/src/processer/todo_processer.ts) | TypeScript | 107 | 48 | 29 | 184 |
| [src/tool.ts](/src/tool.ts) | TypeScript | 163 | 120 | 44 | 327 |
| [src/view/tree/done_tree.ts](/src/view/tree/done_tree.ts) | TypeScript | 38 | 16 | 9 | 63 |
| [src/view/tree/fail_tree.ts](/src/view/tree/fail_tree.ts) | TypeScript | 38 | 16 | 9 | 63 |
| [src/view/tree/task_tree.ts](/src/view/tree/task_tree.ts) | TypeScript | 56 | 16 | 12 | 84 |
| [src/view/tree/todo_tree.ts](/src/view/tree/todo_tree.ts) | TypeScript | 155 | 23 | 26 | 204 |
| [todotodo.code-workspace](/todotodo.code-workspace) | JSON with Comments | 10 | 0 | 0 | 10 |
| [v:\Project\Extension\todotodo\.vscodeignore](/v:%5CProject%5CExtension%5Ctodotodo%5C.vscodeignore) | Ignore | -16 | 0 | 0 | -16 |
| [v:\Project\Extension\todotodo\CHANGELOG.md](/v:%5CProject%5CExtension%5Ctodotodo%5CCHANGELOG.md) | Markdown | -299 | -6 | -52 | -357 |
| [v:\Project\Extension\todotodo\README.md](/v:%5CProject%5CExtension%5Ctodotodo%5CREADME.md) | Markdown | -53 | 0 | -14 | -67 |
| [v:\Project\Extension\todotodo\package.json](/v:%5CProject%5CExtension%5Ctodotodo%5Cpackage.json) | JSON | -373 | 0 | -1 | -374 |
| [v:\Project\Extension\todotodo\resources\icon\chevron-down.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Cchevron-down.svg) | XML | -1 | 0 | 0 | -1 |
| [v:\Project\Extension\todotodo\resources\icon\chevron-up.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Cchevron-up.svg) | XML | -1 | 0 | 0 | -1 |
| [v:\Project\Extension\todotodo\resources\icon\clear-all.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Cclear-all.svg) | XML | -1 | 0 | 0 | -1 |
| [v:\Project\Extension\todotodo\resources\icon\close.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Cclose.svg) | XML | -1 | 0 | 0 | -1 |
| [v:\Project\Extension\todotodo\resources\icon\icon_item.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Cicon_item.svg) | XML | -14 | -1 | -1 | -16 |
| [v:\Project\Extension\todotodo\resources\icon\icon_page.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Cicon_page.svg) | XML | -12 | -1 | -1 | -14 |
| [v:\Project\Extension\todotodo\resources\icon\icon_platform.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Cicon_platform.svg) | XML | -11 | -1 | -1 | -13 |
| [v:\Project\Extension\todotodo\resources\icon\icon_task.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Cicon_task.svg) | XML | -33 | -1 | -1 | -35 |
| [v:\Project\Extension\todotodo\resources\icon\list-unordered.svg](/v:%5CProject%5CExtension%5Ctodotodo%5Cresources%5Cicon%5Clist-unordered.svg) | XML | -3 | 0 | -1 | -4 |
| [v:\Project\Extension\todotodo\src\control_center.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Ccontrol_center.ts) | TypeScript | -78 | -21 | -16 | -115 |
| [v:\Project\Extension\todotodo\src\data_center.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cdata_center.ts) | TypeScript | -22 | -5 | -5 | -32 |
| [v:\Project\Extension\todotodo\src\extension.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cextension.ts) | TypeScript | -8 | -3 | -3 | -14 |
| [v:\Project\Extension\todotodo\src\input\entry_inputer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cinput%5Centry_inputer.ts) | TypeScript | -52 | -16 | -14 | -82 |
| [v:\Project\Extension\todotodo\src\input\item_inputer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cinput%5Citem_inputer.ts) | TypeScript | -178 | -1 | -46 | -225 |
| [v:\Project\Extension\todotodo\src\input\list_inputer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cinput%5Clist_inputer.ts) | TypeScript | 0 | 0 | -1 | -1 |
| [v:\Project\Extension\todotodo\src\input\task_inputer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cinput%5Ctask_inputer.ts) | TypeScript | 0 | 0 | -1 | -1 |
| [v:\Project\Extension\todotodo\src\interface\file_interface.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cinterface%5Cfile_interface.ts) | TypeScript | -132 | -12 | -18 | -162 |
| [v:\Project\Extension\todotodo\src\interface\workspace_interface.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cinterface%5Cworkspace_interface.ts) | TypeScript | -17 | -7 | -3 | -27 |
| [v:\Project\Extension\todotodo\src\processer\configuration_processer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cprocesser%5Cconfiguration_processer.ts) | TypeScript | -17 | -8 | -6 | -31 |
| [v:\Project\Extension\todotodo\src\processer\done_processer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cprocesser%5Cdone_processer.ts) | TypeScript | -29 | -8 | -7 | -44 |
| [v:\Project\Extension\todotodo\src\processer\fail_processer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cprocesser%5Cfail_processer.ts) | TypeScript | -32 | -14 | -7 | -53 |
| [v:\Project\Extension\todotodo\src\processer\list_processer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cprocesser%5Clist_processer.ts) | TypeScript | -69 | -19 | -13 | -101 |
| [v:\Project\Extension\todotodo\src\processer\profile_processer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cprocesser%5Cprofile_processer.ts) | TypeScript | -8 | -4 | -2 | -14 |
| [v:\Project\Extension\todotodo\src\processer\task_processer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cprocesser%5Ctask_processer.ts) | TypeScript | -97 | -27 | -26 | -150 |
| [v:\Project\Extension\todotodo\src\processer\todo_processer.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cprocesser%5Ctodo_processer.ts) | TypeScript | -121 | -49 | -30 | -200 |
| [v:\Project\Extension\todotodo\src\tool.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Ctool.ts) | TypeScript | -161 | -120 | -44 | -325 |
| [v:\Project\Extension\todotodo\src\view\hint_bar.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cview%5Chint_bar.ts) | TypeScript | -15 | -8 | -4 | -27 |
| [v:\Project\Extension\todotodo\src\view\tree\done_tree.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cview%5Ctree%5Cdone_tree.ts) | TypeScript | -42 | -16 | -9 | -67 |
| [v:\Project\Extension\todotodo\src\view\tree\fail_tree.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cview%5Ctree%5Cfail_tree.ts) | TypeScript | -42 | -16 | -9 | -67 |
| [v:\Project\Extension\todotodo\src\view\tree\task_tree.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cview%5Ctree%5Ctask_tree.ts) | TypeScript | -54 | -16 | -12 | -82 |
| [v:\Project\Extension\todotodo\src\view\tree\todo_tree.ts](/v:%5CProject%5CExtension%5Ctodotodo%5Csrc%5Cview%5Ctree%5Ctodo_tree.ts) | TypeScript | -143 | -24 | -26 | -193 |
| [v:\Project\Extension\todotodo\todotodo.code-workspace](/v:%5CProject%5CExtension%5Ctodotodo%5Ctodotodo.code-workspace) | JSON with Comments | -10 | 0 | 0 | -10 |

[summary](results.md) / [details](details.md) / [diff summary](diff.md) / diff details