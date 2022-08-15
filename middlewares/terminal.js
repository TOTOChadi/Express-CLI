import terminalKit from "terminal-kit";
import figlet from "figlet";

/**
 * This class uses the terminalKit package
 * to facilitate the use of the package common functionalities
 * for the use of this project
 */
export default class Terminal {
  constructor() {
    this.terminal = terminalKit.realTerminal;
  }

  /**
   * Clears the terminal screen
   */
  clear() {
    this.terminal.clear();
  }

  /**
   * Displays a string on the screen without resulting in a new line
   * @param {String} str string to be displayed
   */
  print(str) {
    this.terminal(str);
  }

  /**
   * Displays a string on the screen and results in a new line
   * @param {*} str string to be displayed
   * @param {*} nextln number of line breaks
   */
  println(str = "", nextln = 1) {
    this.print(str);
    this.terminal.nextLine(nextln);
  }

  /**
   * Displays a success / error style message
   * @param {Boolean} error
   * @param {String} str
   */
  printResult(error, str) {
    this.printStyleln((error ? " ✖ " : " ✔ ") + str, {
      color: error ? "red" : "green",
      nextln: 2,
    });
  }

  /**
   * Displays a figlet on the screen
   * @param {String} str figlet text to be displayed
   * @param {String} colorHex color of the figlet
   * @param {String} font font of the figlet (check figlet package fonts)
   * @param {Number} nextln number of line breaks
   */
  printFiglet(str, colorHex, font, nextln) {
    this.terminal
      .colorRgbHex(
        colorHex,
        figlet.textSync(str, {
          font: font,
          horizontalLayout: "default",
          verticalLayout: "default",
        })
      )
      .nextLine(nextln);
  }

  /**
   * Displays a text following a certain style (color,weight)
   * @param {String} str Text to be displayed
   * @param {{ color : String, isBold : Boolean }} styles Defines the style of the text
   */
  printStyle(str, styles) {
    styles.isBold
      ? this.terminal.bold.color(styles.color, str)
      : this.terminal.color(styles.color, str);
  }

  /**
   * Displays a text following a certain style (color,weight)
   * @param {String} str Text to be displayed
   * @param {{ color : String, isBold : Boolean , nextln : Number }} styles Defines the style of the text
   */
  printStyleln(str, styles) {
    this.printStyle(str, styles);
    this.terminal.nextLine(styles.nextln);
  }

  /**
   * Displays an interactive menu on a single column
   * @param {Object} menuItems Items to be displayed
   * @param {Function} callback callback function
   */
  printColumnMenu(menuItems, callback) {
    const formattedItems = Object.values(menuItems).map((item) =>
      "‣ ".concat(item)
    );
    this.terminal.singleColumnMenu(formattedItems, callback);
  }

  saveCursor() {
    this.terminal.saveCursor();
  }

  eraseDisplayBelow() {
    this.terminal.restoreCursor();
    this.terminal.eraseDisplayBelow();
  }

  async question(str, defaultValue = "", options = {}) {
    this.printStyle("‣ ".concat(str), { isBold: true });
    const name = await this.terminal.inputField(options).promise;
    this.terminal.nextLine(1);
    return name ? name : defaultValue;
  }

  async yesNoQuestion(question) {
    this.print(question);
    const isOk = await this.terminal.yesOrNo({
      yes: ["y", "ENTER"],
      no: ["n"],
    }).promise;
    this.println("");
    return isOk;
  }

  async askMultipleQuestions(questions, options = {}) {
    let data = {};
    for (let question of questions) {
      data[question.target] = await this.question(
        question.message,
        question.alt,
        options
      );
      if (!data[question.target]) delete data[question.target];
    }
    this.terminal.nextLine(1);
    return data;
  }
}
