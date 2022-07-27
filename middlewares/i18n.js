import path from "path";
import { I18n } from "i18n";

const i18n = new I18n({
  locales: ["en"],
  defaultLocale: "en",
  directory: path.join(__dirname, "..", "locales"),
});

export default i18n;
