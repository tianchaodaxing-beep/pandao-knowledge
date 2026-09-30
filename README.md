# 企业资料检索工具

简体中文 · [English](README.en.md)

检索本机资料，显示原文、文件名和行号。

浏览器本机运行，无需注册，也无需配置付费接口。演示资料均为虚构示例。

[在线使用](https://tianchaodaxing-beep.github.io/pandao-knowledge/) · [下载版本](https://github.com/tianchaodaxing-beep/pandao-knowledge/releases/latest) · [全部工具](https://github.com/tianchaodaxing-beep/pandao-open-tools)

![界面预览](docs/preview.png)

## 开始使用

从版本页面下载工具压缩包，解压后双击 `index.html`。Windows 也可以双击 `启动工具.cmd`。需要保留整个目录，不能只复制HTML文件。

1. 导入TXT、Markdown、CSV或JSON文字资料，可以多选。
2. 输入关键词或问题，检索相关原文。
3. 导出检索结果，或导出资料包并在下次恢复。

## 文件与数据

表格支持 `.xlsx`、`.xls`、`.csv`、`.tsv`；只读取第一个工作表。单表最多20,000行、10 MB。文字文件的支持范围以工具说明为准。

输入资料在浏览器本机处理，不会通过本工具上传到服务器；点击外部反馈链接时会打开GitHub。导出文件由使用者保管。当前版本不自动保存输入，关闭前请导出需要的结果。

## 使用范围

提供文字检索，不生成语言模型答案。不读取PDF和Word，不进行文字识别。资料保留在当前页面内存，关闭前请按需导出资料包。

## 开发与许可

使用 Node.js 20 或更新版本运行 `npm test`。运行网页无需安装Node.js或其他依赖。

本项目采用MIT许可证，允许商业使用、修改和分发，需保留许可声明。第三方表格库采用独立许可证，详见 THIRD_PARTY_NOTICES.md。

## 反馈与定制需求

请通过[项目问题区](https://github.com/tianchaodaxing-beep/pandao-knowledge/issues)描述使用场景、遇到的问题或希望增加的功能。公开反馈请使用演示资料，避免提交客户资料和账号凭据。

## 界面语言

保留中文使用方式，英文说明见 README.en.md。有网页的工具可点击页面上的 English 切换语言，点击“中文”返回。语言切换不会改写已有输入。
