const vscode = require('vscode');
const fs = require('fs');
// 读取并解析代码片段文件
async function loadSnippets(filePath){
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const snippets = JSON.parse(data);
        resolve(snippets);
      } catch (err) {
        reject(err);
      }
    });
  });
}

// 注册代码片段到VS Code
async function registerSnippets(
  context,
  snippets,
  language
) {
  for (const [name, snippet] of Object.entries(snippets)) {
    const disposable = vscode.languages.registerCompletionItemProvider(
      { scheme: "file", language },
      {
        provideCompletionItems() {
          const completionItem = new vscode.CompletionItem(
            snippet["prefix"],
            vscode.CompletionItemKind.Snippet
          );
          completionItem.insertText = new vscode.SnippetString(
            snippet["body"].join("\n")
          );
          completionItem.detail = snippet["description"];
          return [completionItem];
        },
      },
      snippet["prefix"]
    );

    context.subscriptions.push(disposable);
  }
}
module.exports = {loadSnippets,registerSnippets}