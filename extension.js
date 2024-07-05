const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const axios = require("axios");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Your extension "check-and-install-dependency" is now active!');

  // 获取当前工作区路径
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const workspacePath = workspaceFolders[0].uri.fsPath;
    const packageJsonPath = path.join(workspacePath, "package.json");

    // 检查 package.json 文件是否存在
    if (fs.existsSync(packageJsonPath)) {
      fs.readFile(packageJsonPath, "utf8", (err, data) => {
        if (err) {
          vscode.window.showErrorMessage("读取 package.json 文件失败");
          return;
        }

        // 解析 package.json 文件内容
        const packageJson = JSON.parse(data);
        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        // 检查是否包含特定依赖项
        const dependencyToCheck = "@pangu/components-compound"; // 替换为你要检查的依赖项
        if (
          dependencies[dependencyToCheck] ||
          devDependencies[dependencyToCheck]
        ) {
          vscode.window.showInformationMessage(
            `项目中已包含依赖项: ${dependencyToCheck}`
          );
        } else {
          // 如果没有，则安装依赖项
          vscode.window.showInformationMessage(
            `项目中不包含依赖项: ${dependencyToCheck}，正在安装...`
          );
          installDependency(workspacePath, dependencyToCheck);
        }
      });
    } else {
      vscode.window.showWarningMessage("当前工作区没有 package.json 文件");
    }
  } else {
    vscode.window.showWarningMessage("没有打开任何工作区");
  }

  console.log('Your extension "check-intranet" is now active!');

  // 当扩展激活时立即进行内网检测
  checkIntranet();

  // 注册一个命令以手动触发内网检测
  let disposable = vscode.commands.registerCommand(
    "extension.checkIntranet",
    () => {
      checkIntranet();
    }
  );
  context.subscriptions.push(disposable);
}

function deactivate() {}

function installDependency(workspacePath, dependency) {
  const installCommand = `pnpm install ${dependency}`;
  exec(installCommand, { cwd: workspacePath }, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage(
        `安装依赖项 ${dependency} 失败: ${error.message}`
      );
      return;
    }
    if (stderr) {
      vscode.window.showErrorMessage(
        `安装依赖项 ${dependency} 出现错误: ${stderr}`
      );
      return;
    }
    vscode.window.showInformationMessage(`成功安装依赖项: ${dependency}`);
  });
}
function checkIntranet() {
    const intranetTestUrl = "http://192.168.12.86:65535/"; // 替换为你要检查的内部服务器URL

    axios.get(intranetTestUrl)
        .then(response => {
            if (response.status === 200) {
                vscode.window.showInformationMessage('在公司内网内。');
            } else {
                vscode.window.showWarningMessage('无法确认内网状态。');
            }
        })
        .catch(error => {
            vscode.window.showWarningMessage('不在公司内网内。');
        });
}

module.exports = {
  activate,
  deactivate,
};
