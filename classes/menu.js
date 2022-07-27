import path from "path";
import { readFile } from "fs/promises";
import i18n from "middlewares/i18n";
import Generator from "classes/generator";
import Terminal from "middlewares/terminal";

/**
 * This class handles the display of the appropriate wording
 * by leveraging the terminal-kit package for colors,formatting...
 */
export default class Menu {
  constructor() {
    this.terminal = new Terminal();
    this.generator = new Generator();
  }

  /**
   * This method uses a prefix to find the appropriate menu items
   * we're looking for by looking for the given prefix in the i18n locales file.
   * @param {String} menu Prefix to look for in locales/en.json
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
    this.terminal.printFiglet("Express CLI", "#da2c38", "ANSI Shadow", 1);
    this.terminal.println(i18n.__("intro.description"));
    this.terminal.printStyleln(i18n.__("intro.check.repo"), {
      color: "cyan",
      isBold: true,
    });
    const { error, message } = await this.generator.checkRepo();
    this.terminal.printStyleln(message, {
      color: error ? "red" : "green",
      nextln: 2,
    });
    if (error) process.exit();
    this.mainMenu();
  }

  mainMenu() {}
}
