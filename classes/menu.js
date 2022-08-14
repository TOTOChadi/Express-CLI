import path from "path";
import * as url from "url";
import { readFile } from "fs/promises";
import i18n from "#middlewares/i18n";
import Terminal from "#middlewares/terminal";
import Generator from "#classes/generator";
import FileParser from "#classes/fileparser";

import { INIT_PROJECT_QUESTIONS } from "#constants/index";

/**
 * This class handles the display of the appropriate wording
 * by leveraging the Terminal middleware for colors,formatting...
 */
export default class Menu {
  constructor() {
    this.terminal = new Terminal();
    this.generator = new Generator();
    this.fileparser = new FileParser();
  }

  /******************************* HELPER METHODS  **********************************/

  /**
   * This method uses a prefix to find the appropriate menu items
   * we're looking for by looking for the given prefix in the i18n locales file.
   * @param {String} menu Prefix to look for in locales/en.json
   * @returns {Object} where the key is the object id thats going to be used for the generator
   * and the value is the text to be displayed on the menu screen
   */
  async getMenuItems(menu) {
    const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
    const menuItemsPath = path.join(__dirname, "../locales/en.json");
    const menuData = JSON.parse(await readFile(menuItemsPath, "utf-8"));
    const menuKeys = Object.keys(menuData);
    let menuItems = {};
    for (let item of menuKeys) {
      if (item.startsWith(menu)) menuItems[item] = i18n.__(item);
    }
    return menuItems;
  }

  /**
   * This method returns the ID of the selected menu value
   * @param {Object} menuItems List of menu items to filter
   * @param {String} selectedValue Value that was selected on a menu
   * @returns {String} ID of the selectedValue
   */
  getSelectedID(menuItems, selectedValue) {
    return Object.keys(menuItems).find(
      (key) => menuItems[key] === selectedValue.slice(2) // removes the bulletpoint character
    );
  }

  /**
   * This method triggers the event related to the menu option selected
   * @param {String} selectedID ID of the selected option
   */
  async triggerEvent(selectedID) {
    this.terminal.eraseDisplayBelow();
    switch (selectedID) {
      case "mainMenu.init.project":
        await this.initializeProjectMenu();
        break;
      case "mainMenu.add.resource":
        break;
      case "mainMenu.add.dockerFile":
        break;
      case "mainMenu.add.linter":
        break;
      case "mainMenu.add.authentification":
        break;
      case "mainMenu.add.CI":
        break;
      case "resource.add.model":
        break;
      case "resource.add.controller":
        break;
      case "resource.add.route":
        break;
      case "resource.add.all":
        break;
      case "resource.add.all":
        break;
      case "linter.add.eslint":
        break;
    }
  }

  /**
   * Displays the repository check messages
   * @param {*} title
   * @param {*} callback
   */
  async checkRepoMenu(title, callback) {
    this.terminal.printStyleln(title, {
      color: "cyan",
      isBold: true,
    });
    let { error, message } = await callback();
    this.terminal.printResult(error, message);
    if (error) process.exit();
  }

  /******************************* STARTUP METHODS  **********************************/

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

    await this.checkRepoMenu(
      i18n.__("intro.check.repo.rights"),
      async () => await this.fileparser.checkRepo()
    );

    await this.checkRepoMenu(
      i18n.__("intro.check.repo.resources"),
      async () => await this.fileparser.checkExistingResources()
    );

    this.terminal.saveCursor();

    this.mainMenu();
  }

  /**
   * Displays the main menu
   */
  async mainMenu() {
    this.terminal.printStyleln(i18n.__("select.option"), { isBold: true });
    const menuItems = await this.getMenuItems("mainMenu");
    this.terminal.printColumnMenu(menuItems, async (error, response) => {
      const selectedValue = response.selectedText;
      const selectedID = this.getSelectedID(menuItems, selectedValue);
      await this.triggerEvent(selectedID);
      process.exit();
    });
  }

  /******************************* START AN EXPRESSJS PROJECT METHODS  **********************************/

  /**
   * This function displays the menu for starting a new
   * ExpressJs project
   */
  async initializeProjectMenu() {
    this.terminal.printStyleln(i18n.__("init.project.text"), {
      color: "cyan",
      isBold: true,
    });
    let data = await this.terminal.askMultipleQuestions(INIT_PROJECT_QUESTIONS);
    const { error, message } = await this.generator.generatePackageJson(data);
    this.terminal.printResult(error, message);
  }
}
