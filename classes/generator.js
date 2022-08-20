import { exec } from "child_process";
import util from "util";
import { promises as fs, constants as rights, readFile } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prettier from "prettier";
import i18n from "#middlewares/i18n";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * This class handles the generation of the specified resources using
 * a template file.
 */
export default class Generator {
  constructor() {
    this.currentDir = process.cwd();
    this.hasIndex = false;
    this.hasEnv = false;
    this.hasPackageJson = false;
    this.models = [];
    this.controllers = [];
    this.routes = [];
    this.hasPrettier = false;
    this.hasDockerFile = false;
  }

  /******************************* HELPER METHODS  **********************************/

  /**
   * Check whether the user has enough rights in the cwd
   * @returns {{ error : Boolean, message: String }}
   */
  async checkRepo() {
    try {
      await fs.access(this.currentDir, rights.W_OK || rights.R_OK);
      return { message: i18n.__("check.repo.rights.success") };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  /**
   * This method retrieves the content of a directory
   * @param {String} dir directory path
   * @returns {{ files : Array, folders: Array }}
   */
  async getDirContent(dir = this.currentDir) {
    const folders = (await fs.readdir(dir, { withFileTypes: true }))
      .filter((file) => file.isDirectory())
      .map((result) => result.name);

    const files = (await fs.readdir(dir, { withFileTypes: true }))
      .filter((file) => !file.isDirectory())
      .map((result) => result.name);

    return { files, folders };
  }

  /**
   * This method checks the existence of a single file resource.
   * @param {Array} files list of cwd files
   * @param {String} resource resource to find
   * @returns {Boolean} true if the resource exists
   */
  checkFileResource(files, resource) {
    return files.includes(resource);
  }

  /**
   * This method returns the resources of a specific directory.
   * @param {Array} folders list of cwd folders
   * @param {String} resource resource to find
   * @returns {Array} of the folder resources
   */
  async checkDirResource(folders, resource) {
    if (folders.includes(resource)) {
      const { files } = await this.getDirContent(
        path.join(this.currentDir, "/", resource)
      );
      return files
        .filter((file) => file.endsWith(".js"))
        .map((file) => file.split(".")[0]);
    }
    return [];
  }

  async replaceTemplate(templateFile, target, toReplace, newValue) {
    /** Get Template file content */
    const templatePath = path.join(__dirname, "../templates", templateFile);
    const data = await fs.readFile(templateFile, "utf-8");
    /** Replace template keyword (toReplace) */
    const re = new RegExp(toReplace, "g");
    const newFileData = data.replace(re, newValue);
    /** Create the file */
    await fs.writeFile(target, newFileData, "utf-8");
  }

  /******************************* CORE METHODS  **********************************/

  /**
   * This method check the existing resources within the current repo
   * @returns {{ error : Boolean, message: String }}
   */
  async checkExistingResources() {
    try {
      const { files, folders } = await this.getDirContent();
      this.hasPackageJson = this.checkFileResource(files, "package.json");
      this.hasIndex = this.checkFileResource(files, "index.js");
      this.hasEnv = this.checkFileResource(files, ".env");
      this.hasDockerFile = this.checkFileResource(files, "Dockerfile");
      this.hasPrettier = this.checkFileResource(files, ".prettierrc");
      this.models = await this.checkDirResource(folders, "models");
      this.controllers = await this.checkDirResource(folders, "controllers");
      this.routes = await this.checkDirResource(folders, "routes");
      return { message: i18n.__("check.repo.resources.success") };
    } catch (error) {
      return { error: true, message: error.message };
    }
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

  /**
   * This function generate a Dockerfile based on the user's version of node
   */
  async generateDockerFile() {
    const execute = util.promisify(exec);
    try {
      const { stdout, stderr } = await execute("node --version");
      const nodeVersion = stdout.slice(1);
      const target = path.join(this.currentDir, "/", "DockerFile");
      await this.replaceTemplate(
        "Dockerfile",
        target,
        "{{version}}",
        nodeVersion
      );
      return { message: i18n.__("generate.dockerfile.success") };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
