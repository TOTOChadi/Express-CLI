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
  println(str, nextln = 1) {
    this.print(str);
    this.terminal.nextLine(nextln);
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
}
