const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { loadSnippets, registerSnippets } = require("./snippetManager");
const { Telemetry } = require("@vscode/extension-telemetry");
// 你的扩展 ID、应用版本和遥测密钥（从应用中心获取）
const extensionId = "TatsuyaSun.pg-code-snippet";
const extensionVersion = "0.0.23";
const key = "dae630ec-a876-4137-ad5a-d2735b86b061";
const reporter = new Telemetry(extensionId, extensionVersion, key);
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // 获取当前工作区路径
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const workspacePath = workspaceFolders[0].uri.fsPath;
    const packageJsonPath = path.join(workspacePath, "package.json");

    // 检查 package.json 文件是否存在
    if (fs.existsSync(packageJsonPath)) {
      fs.readFile(packageJsonPath, "utf8", async (err, data) => {
        if (err) {
          vscode.window.showErrorMessage("读取 package.json 文件失败");
          return;
        }

        // 解析 package.json 文件内容
        const packageJson = JSON.parse(data);
        const name = packageJson.name || "";
        if (name.indexOf("pangu-") === 0) {
          // 检查是否包含特定依赖项
          const dependencyToCheck = "@pangu/components-compound"; // 替换为你要检查的依赖项
          // vscode.window.showInformationMessage(
          //   `正在安装${dependencyToCheck}...`
          // );
          const dependencies = packageJson.dependencies || {};
          const devDependencies = packageJson.devDependencies || {};
          if (
            dependencies[dependencyToCheck] ||
            devDependencies[dependencyToCheck]
          ) {
            // vscode.window.showInformationMessage(
            //   `项目中已包含依赖项: ${dependencyToCheck}`
            // );
          }
          installDependency(workspacePath, dependencyToCheck, context);
          // }
        }
      });
    } else {
      //vscode.window.showWarningMessage("当前工作区没有 package.json 文件");
    }
  } else {
    //vscode.window.showWarningMessage("没有打开任何工作区");
  }
}

function deactivate() {
  if (reporter) {
    reporter.dispose();
  }
}

function installDependency(workspacePath, dependency, context) {
  const installCommand = `pnpm install ${dependency}`;
  exec(
    installCommand,
    { cwd: workspacePath },
    async (error, stdout, stderr) => {
      if (error) {
        // 代码片段失效
        vscode.window.showErrorMessage(
          `安装依赖项 ${dependency} 失败: ${error.message}`
        );
        return;
      }
      if (stderr) {
        // 代码片段失效
        vscode.window.showErrorMessage(
          `安装依赖项 ${dependency} 出现错误: ${stderr}`
        );
        return;
      }
      // 加载外部代码片段文件
      const snippetFilePath = path.join(
        context.extensionPath,
        "snippets",
        "snippets.json"
      );
      try {
        const snippets = await loadSnippets(snippetFilePath);
        registerSnippets(context, snippets, "javascript");
        registerSnippets(context, snippets, "js");
        registerSnippets(context, snippets, "vue");
        registerSnippets(context, snippets, "html");
        vscode.window.showInformationMessage("加载代码片段成功.");
        context.subscriptions.push(reporter);
        let disposable = vscode.commands.registerCommand(
          "extension.useSnippet1",
          () => {
            // 统计代码片段被使用的次数
            reporter.sendTelemetryEvent("snippetUsed");
          }
        );
        context.subscriptions.push(disposable);
      } catch (error) {
        vscode.window.showErrorMessage(`加载代码片段失败.`);
      }
      vscode.window.showInformationMessage(`成功安装依赖项: ${dependency}`);
    }
  );
}

module.exports = {
  activate,
  deactivate,
};
