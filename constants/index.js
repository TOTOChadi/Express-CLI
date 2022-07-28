import path from "path";
import i18n from "#middlewares/i18n";

const INIT_PROJECT_QUESTIONS = [
  {
    message: i18n.__("init.project.name", {
      name: path.basename(process.cwd()),
    }),
    alt: path.basename(process.cwd()),
    target: "name",
  },
  {
    message: i18n.__("init.project.version", {
      version: "1.0.0",
    }),
    alt: "1.0.0",
    target: "version",
  },
  {
    message: i18n.__("init.project.author"),
    target: "author",
  },
  {
    message: i18n.__("init.project.description"),
    target: "description",
  },
  {
    message: i18n.__("init.project.licence", { licence: "MIT" }),
    alt: "MIT",
    target: "licence",
  },
];

export { INIT_PROJECT_QUESTIONS };
