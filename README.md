# pg-code-snippet README

A vue snippet plugin for vscode.

## 使用方法

| 关键字             | 模版               | 关键字   | 模版                                             |
| ------------------ | ------------------ | -------- | ------------------------------------------------ |
| vue-sfc            | 选项式vue          | log      | console.log('$1')                                |
| vue-composition    | 组合式vue          | import   | import {$1} from '$0'                            |
| gl-layout-1        | 左侧树右侧列表布局 | function | const $1 = ($2) => {$0}                          |
| gl-drawer          | 抽屉               | if       | if ($1) {$2}                                     |
| gl-table           | 表格               | elseif   | else if ($1) {$2}                                |
| gl-form            | 表单               | else     | else {$2}                                        |
| gl-tree            | 树                 | map      | $1.map((item, idx) => {$2 return $3})           |
| gl-card            | 卡片               | forEach  | $1.forEach((item, idx) => {$2})                  |
| gl-page            | 分页               | find     | const $1 = $2.find(item => $3)                   |
| gl-upload          | 上传               | switch   | switch($1) {case $2:return $3 case $4:return $5} |
| gl-dialog          | 弹窗               | const    | const $1 = $2                                    |
| gl-dynamicForm     | 动态表单           | let      | let $1 = $2                                      |
| gl-dynamicFormItem | 动态表单项         |          |                                                  |
