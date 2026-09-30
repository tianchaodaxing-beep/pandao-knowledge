(function () {
  "use strict";
  const U = Pandao,
    B = Business;
  const app = U.mount({
    title: "企业资料检索工具",
    icon: "⌕",
    category: "资料与知识",
    description: "导入文字资料，按关键词检索相关段落，查看文件名、行号与原文。",
    repo: "https://github.com/tianchaodaxing-beep/pandao-knowledge",
  });
  const examples = [
    {
      name: "演示-售后流程.md",
      text: "# 售后流程\n\n客户申请退货后，客服核对订单与商品状态。退款金额以实际付款记录为依据。\n\n收到退货后，仓库记录商品数量、外观和配件。客服确认记录后处理退款。\n\n退货问题应在售后台账中记录，包括订单、原因、处理日期与结果。",
    },
    {
      name: "演示-采购流程.md",
      text: "# 采购流程\n\n补货前核对现有库存、在途库存与近期销量。采购周期以供应方实际交付记录为依据。\n\n报价需要包含单价、包装数量、起订量、运输费用和有效期。\n\n供应方变更材料或交付日期时，采购人员需要更新记录并通知相关人员。",
    },
  ];
  let docs = examples.map((d) => ({ ...d })),
    results = [];
  const p = U.panel("资料库");
  const list = U.h("ul", { class: "file-list" });
  p.append(
    U.fileInput(
      "添加文字资料（可多选）",
      async (files) => {
        let staged = docs.slice();
        for (const f of files) {
          if (!/\.(txt|md|csv|json)$/i.test(f.name))
            throw Error("支持 TXT、Markdown、CSV 和 JSON 文字文件");
          if (f.size > 2 * 1024 * 1024)
            throw Error(f.name + "超过2 MB，请拆分文件");
          const text = await f.text();
          staged = staged.filter((d) => d.name !== f.name);
          staged.push({ name: f.name, text });
        }
        if (staged.length > 100) throw Error("资料库最多100个文件");
        if (staged.reduce((s, d) => s + d.text.length, 0) > 5 * 1024 * 1024)
          throw Error("资料总量超过5 MB，请移除部分文件");
        docs = staged;
        results = [];
        drawList();
        render();
        U.source("本机资料库：" + docs.length + "个文件");
        U.notice("资料已添加");
      },
      true,
      ".txt,.md,.csv,.json",
    ),
    list,
    U.actions(
      U.button("清空资料", () => {
        docs = [];
        results = [];
        drawList();
        render();
        U.source("资料库为空");
      }),
      U.button("读取演示资料", () => {
        docs = examples.map((d) => ({ ...d }));
        drawList();
        search();
        U.source("演示数据");
      }),
      U.button("导出资料包", () =>
        U.download(
          "资料库.json",
          JSON.stringify(
            { format: "pandao-knowledge-v1", documents: docs },
            null,
            2,
          ),
          "application/json",
        ),
      ),
    ),
  );
  const importPack = U.fileInput(
    "恢复资料包",
    async (file) => {
      if (file.size > 6 * 1024 * 1024) throw Error("资料包超过6 MB");
      let data;
      try {
        data = JSON.parse(await file.text());
      } catch (error) {
        if (error instanceof SyntaxError)
          throw Error("资料包不是有效JSON，请选择本工具导出的资料包");
        throw error;
      }
      if (
        !data ||
        data.format !== "pandao-knowledge-v1" ||
        !Array.isArray(data.documents) ||
        data.documents.length > 100 ||
        data.documents.some(
          (d) =>
            !d ||
            typeof d.name !== "string" ||
            !d.name.trim() ||
            typeof d.text !== "string",
        )
      )
        throw Error("资料包格式无效");
      if (
        new Set(data.documents.map((d) => d.name)).size !==
        data.documents.length
      )
        throw Error("资料包含重复文件名");
      if (
        data.documents.reduce((s, d) => s + d.text.length, 0) >
        5 * 1024 * 1024
      )
        throw Error("资料总量超过5 MB");
      docs = data.documents;
      results = [];
      drawList();
      render();
      U.source("资料包：" + file.name);
    },
    false,
    ".json",
  );
  p.append(importPack);
  app.input.append(p);
  const q = U.panel("检索"),
    query = U.field("关键词或问题", "query", "退货退款流程"),
    count = U.field("结果数量", "limit", 10, "number");
  q.append(
    query.wrap,
    count.wrap,
    U.actions(U.button("检索资料", U.run(search), true)),
  );
  query.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      U.run(search)();
    }
  });
  app.input.append(q);
  const out = U.panel("检索结果");
  app.output.append(out);
  function drawList() {
    U.clear(list);
    for (const [i, d] of docs.entries())
      list.append(
        U.h("li", {}, [
          d.name + " · " + d.text.length + "字 ",
          U.button("移除", () => {
            docs.splice(i, 1);
            drawList();
            results = [];
            render();
          }),
        ]),
      );
    if (!docs.length)
      list.append(U.h("li", { text: "请选择文字资料或读取演示资料。" }));
  }
  function search() {
    if (!docs.length) throw Error("请先添加资料");
    const limit = B.num(count.input.value, "结果数量", 1, 50);
    results = B.search(docs, query.input.value, Math.floor(limit));
    render();
  }
  function highlighted(text) {
    const parts =
      String(query.input.value)
        .normalize("NFKC")
        .toLowerCase()
        .match(/[a-z0-9]+|[\u4e00-\u9fff]{2,}|[\uac00-\ud7af]+/g) || [];
    const tokens = [
      ...new Set([...parts, ...B.tokenize(query.input.value)]),
    ].sort((a, b) => b.length - a.length);
    const frag = document.createDocumentFragment();
    if (!tokens.length) {
      frag.append(text);
      return frag;
    }
    const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp("(" + escaped.join("|") + ")", "gi");
    for (const part of text.split(re)) {
      if (tokens.includes(part.toLowerCase()))
        frag.append(U.h("mark", { text: part }));
      else frag.append(part);
    }
    return frag;
  }
  function render() {
    U.clear(out).append(
      U.h("div", { class: "panel-heading" }, [
        U.h("h2", { text: "检索结果" }),
        U.h("span", { class: "tag", text: results.length + "条" }),
      ]),
    );
    if (!results.length)
      out.append(
        U.h("p", {
          class: "empty",
          text: "没有匹配内容。请换用资料中的关键词。",
        }),
      );
    for (const r of results)
      out.append(
        U.h("article", { class: "result-card" }, [
          U.h("div", {
            class: "meta",
            text: r.name + " · 第" + r.start + "至" + r.end + "行",
          }),
          U.h("div", { class: "excerpt" }, highlighted(r.text)),
          U.actions(
            U.button("下载原文文件", () => {
              const doc = docs.find((d) => d.name === r.name);
              U.download(doc.name, doc.text);
            }),
          ),
        ]),
      );
    if (results.length)
      out.append(
        U.actions(
          U.button("导出检索结果", () =>
            U.exportRows(
              "资料检索.xlsx",
              results.map((r) => ({
                文件: r.name,
                起始行: r.start,
                结束行: r.end,
                原文: r.text,
              })),
            ),
          ),
        ),
      );
  }
  drawList();
  search();
  U.source("演示数据");
})();
