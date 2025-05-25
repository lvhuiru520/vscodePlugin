import { exec } from "child_process";
import * as vscode from "vscode";
import * as os from "os";
export function activate(context: vscode.ExtensionContext) {
  const openInIDEACommand = vscode.commands.registerCommand(
    "any-command.openInIDEA",
    () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace is open.");
        return;
      }

      const folderPath = workspaceFolders[0].uri.fsPath;

      exec(`idea "${folderPath}"`, (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage(`Failed to open IDEA: ${stderr}`);
          return;
        }
      });
    }
  );
  const openInTerminal = vscode.commands.registerCommand(
    "any-command.openInTerminal",
    () => {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showErrorMessage("No workspace is open.");
        return;
      }

      const folderPath = folders[0].uri.fsPath;

      let terminalCommand = "";
      const platform = os.platform();

      if (platform === "darwin") {
        // macOS 使用 Terminal.app
        terminalCommand = `open -a Terminal "${folderPath}"`;
      } else if (platform === "win32") {
        // Windows 使用 cmd.exe 或者 PowerShell
        terminalCommand = `start cmd.exe /K "cd /d ${folderPath}"`;
      } else {
        // Linux 使用默认终端（例如 gnome-terminal）
        terminalCommand = `gnome-terminal --working-directory="${folderPath}"`;
      }

      exec(terminalCommand, (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(
            `Failed to open terminal: ${stderr || error.message}`
          );
          return;
        }
      });
    }
  );
  const openInExplorer = vscode.commands.registerCommand(
    "any-command.openInExplorer",
    () => {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showErrorMessage("No workspace is open.");
        return;
      }

      const folderPath = folders[0].uri.fsPath;
      const platform = os.platform();

      let openCommand = "";

      if (platform === "darwin") {
        openCommand = `open "${folderPath}"`;
      } else if (platform === "win32") {
        openCommand = `explorer "${folderPath}"`;
      } else {
        openCommand = `xdg-open "${folderPath}"`;
      }

      exec(openCommand, (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(
            `Failed to open folder: ${stderr || error.message}`
          );
          return;
        }
      });
    }
  );
  const openGitGraph = vscode.commands.registerCommand(
    "any-command.openGitGraph",
    () => {
      vscode.commands.executeCommand("git-graph.view").then(
        () => vscode.window.showInformationMessage("Git Graph opened"),
        (err) =>
          vscode.window.showErrorMessage(`Failed to open Git Graph: ${err}`)
      );
    }
  );

  context.subscriptions.push(
    openInIDEACommand,
    openInTerminal,
    openGitGraph,
    openInExplorer
  );
}

export function deactivate() {}
