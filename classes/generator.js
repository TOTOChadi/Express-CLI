import { promises as fs } from "fs";
import path from "path";
import prettier from "prettier";
import i18n from "#middlewares/i18n";

/**
 * This class handles the generation of the specified resources using
 * a template file.
 */
export default class Generator {
  constructor() {
    this.currentDir = process.cwd();
  }

  /**
   * This method generates a package.json file based on the user input
   * @param {Object} infos package.json basic infos
   * @returns {{ error : Boolean, message: String }}
   */
  async generatePackageJson(infos) {
    const targetDir = path.join(this.currentDir, "/", "package.json");
    try {
      await fs.writeFile(
        targetDir,
        prettier.format(JSON.stringify(infos), { parser: "json" }),
        "utf-8"
      );
      return { message: i18n.__("generate.package.json.success") };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
