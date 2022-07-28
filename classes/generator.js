import fs from "fs";
import util from "util";
import prettier from "prettier";
import i18n from "#middlewares/i18n";

/**
 * This class handles the generation of the specified resources using
 * a template file.
 */
export default class Generator {
  constructor() {
    this.currentDir = process.cwd();
    this.hasIndex = false;
    this.hasPackageJson = false;
    this.models = [];
    this.controllers = [];
    this.routes = [];
    this.hasLinter = false;
    this.hasDockerFile = false;
  }

  /**
   * Check whether the user has enough rights in the cwd
   * @returns {Object}
   */
  async checkRepo() {
    const access = util.promisify(fs.access);
    try {
      await access(this.currentDir, fs.constants.W_OK);
      return { message: i18n.__("check.repo.success.rights") };
    } catch (error) {
      return { error: true, message: i18n.__("check.repo.error.rights") };
    }
  }

  // TODO
  checkExistingResources() {}

  /**
   * This method generates a package.json file based on the user input
   * @param {Object} infos
   * @returns
   */
  async generatePackageJson(infos) {
    const writefile = util.promisify(fs.writeFile);
    const data = prettier.format(JSON.stringify(infos), {
      parser: "json",
    });
    try {
      await writefile(this.currentDir + "/package.json", data, "utf-8");
      return { message: i18n.__("generate.package.json.success") };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
