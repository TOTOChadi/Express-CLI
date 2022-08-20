import { exec } from "child_process";
import util from "util";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prettier from "prettier";
import i18n from "#middlewares/i18n";
import FileParser from "#classes/fileparser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * This class handles the generation of the specified resources using
 * a template file.
 */
export default class Generator extends FileParser {
  constructor() {
    super();
  }

  async replaceTemplate(templateFile, target, toReplace, newValue) {
    /** Get Template file content */
    const templatePath = path.join(__dirname, "../templates", templateFile);
    const data = await fs.readFile(templatePath, "utf-8");
    /** Replace template keyword (toReplace) */
    const re = new RegExp(toReplace, "g");
    const newFileData = data.replace(re, newValue);
    /** Create the file */
    await fs.writeFile(target, newFileData, "utf-8");
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
      return {
        message: i18n.__("generate.resource.success", {
          resource: "Package.json",
        }),
      };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  /**
   * This method generate a Dockerfile based on the user's version of node
   */
  async generateDockerFile() {
    const execute = util.promisify(exec);
    try {
      const { stdout, stderr } = await execute("node --version");
      const nodeVersion = stdout.slice(1);
      const target = path.join(this.currentDir, "/", "DockerFile");
      await this.replaceTemplate(
        "DockerFile",
        target,
        "{{version}}",
        nodeVersion
      );
      return {
        message: i18n.__("generate.resource.success", {
          resource: "DockerFile",
        }),
      };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  /**
   * This method generates a linter based on its type (eslint/prettier)
   * @param {*} linter
   * @returns
   */
  async generateLinter(linter) {
    try {
      const templatePath = path.join(__dirname, "../templates", linter);
      const target = path.join(this.currentDir, "/", linter);
      await fs.copyFile(templatePath, target);
      return {
        message: i18n.__("generate.resource.success", { resource: linter }),
      };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
