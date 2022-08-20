import path from "path";
import { promises as fs, constants as rights } from "fs";
import i18n from "#middlewares/i18n";
import { info } from "console";

export default class FileParser {
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

  getResourceInfo(resourceName) {
    let info;
    switch (resourceName) {
      case "package.json":
        info = {
          doesExist: this.hasPackageJson,
          taskMessage: i18n.__("init.project.text"),
        };
        break;
      case "DockerFile":
        info = {
          doesExist: this.hasDockerFile,
          taskMessage: i18n.__("generate.dockerfile.message"),
        };
        break;
    }

    return { name: resourceName, ...info };
  }
}
