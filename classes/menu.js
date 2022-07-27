import path from "path";
import { readFile } from "fs/promises";
import terminalKit from "terminal-kit";
import figlet from "figlet";
import i18n from "middlewares/i18n";
import Generator from "classes/generator";

// @Todo : Move TerminalKit to a middleware

/**
 * This class handles the display of the appropriate wording
 * by leveraging the terminal-kit package for colors,formatting...
 */
export default class Menu {
  constructor() {
    this.terminal = terminalKit.realTerminal;
    this.generator = new Generator();
  }

  /**
   * This method uses a prefix to find the appropriate menu items
   * we're looking for by looking for the given prefix in the i18n locales file.
   * @param {String} menu - Prefix to look for in locales/en.json
   * @returns
   */
  async getMenuItems(menu) {
    const menuItemsPath = path.join(__dirname, "../locales/en.json");
    const menuData = JSON.parse(await readFile(menuItemsPath, "utf-8"));
    const menuKeys = Object.keys(menuData);
    let menuItems = [];
    for (let item of menuKeys) {
      if (item.startsWith(menu)) menuItems.push(i18n.__(item));
    }
    return menuItems;
  }

  /**
   * This method launches the app by displaying a header and a small description
   * then proceeds to checking if the folder we're running the script for has
   * writing rights for our app to work if it does it imports through the generator class
   * any resources the user might have created and then proceeds to displaying the main menu
   */
  async start() {
    this.terminal.clear();
    this.terminal
      .colorRgbHex(
        "#da2c38",
        figlet.textSync("Express CLI", {
          font: "ANSI Shadow",
          horizontalLayout: "default",
          verticalLayout: "default",
        })
      )
      .nextLine(1);
    this.terminal(i18n.__("intro.description")).nextLine(1);
    this.terminal.bold.cyan(i18n.__("intro.check.repo")).right(1);
    const { error, message } = await this.generator.checkRepo();
    this.terminal.color(error ? "red" : "green", message).nextLine(1);
    if (error) process.exit();
    this.mainMenu();
  }

  mainMenu() {}
}
