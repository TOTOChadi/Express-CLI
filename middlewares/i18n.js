import path from "path";
import * as url from "url";
import { I18n } from "i18n";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const i18n = new I18n({
  locales: ["en"],
  defaultLocale: "en",
  directory: path.join(__dirname, "..", "locales"),
});

export default i18n;
