import fs from "fs";
import util from "util";
import i18n from "middlewares/i18n";

/**
 * This class handles the generation of the specified resources using
 * a template file.
 */
export default class Generator {
  async checkRepo() {
    const currentDir = process.cwd();
    const access = util.promisify(fs.access);
    try {
      await access(currentDir, fs.constants.W_OK);
      return { message: i18n.__("check.repo.success.rights") };
    } catch (error) {
      return { error: true, message: i18n.__("check.repo.error.rights") };
    }
  }
}
