import { app, ipcMain, dialog, BrowserWindow, Menu } from "electron";
import path from "node:path";
import fs from "node:fs/promises";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  win.webContents.openDevTools({ mode: "detach" });
  win.webContents.on("console-message", (_e, level, message, line, source) => {
    console.log(`[renderer] [${level}] ${message} (${source}:${line})`);
  });
  win.webContents.on("did-fail-load", (_e, code, desc, url) => {
    console.log(`[did-fail-load] code: ${code}, desc: ${desc}, url: ${url}`);
  });
  win.webContents.on("render-process-gone", (_e, details) => {
    console.log("[render-process-gone]", details);
  });
  Menu.setApplicationMenu(null);
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../out/renderer/index.html"));
  }
}
app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "PDFs", extensions: ["pdf"] }]
    });
    if (canceled || filePaths.length === 0) return null;
    try {
      const buffer = await fs.readFile(filePaths[0]);
      return {
        path: filePaths[0],
        data: buffer,
        name: path.basename(filePaths[0])
      };
    } catch (error) {
      console.error("Error reading PDF file:", error);
      return null;
    }
  });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
