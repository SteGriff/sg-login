import { promises as fs } from "fs";
import path from "path";

const cache = {};

const readTemplate = async (filePath) => {
  if (cache[filePath])
    return cache[filePath];

  const content = await fs.readFile(filePath, "utf8");
  cache[filePath] = content;
  return content;
};

const dereference = (obj) => JSON.parse(JSON.stringify(obj));

const sanitize = (options) => {
  let sanitizedOptions = dereference(options);
  delete sanitizedOptions.settings;
  delete sanitizedOptions._locals;
  delete sanitizedOptions.cache;
  return JSON.stringify(sanitizedOptions);
}

export const sste = async (filePath, options, callback) => {
  try {
    const mainTemplatePath = path.join(path.dirname(filePath), "main.htm");
    const [mainTemplate, contentTemplate] = await Promise.all([
      readTemplate(mainTemplatePath),
      readTemplate(filePath),
    ]);

    const contentPlaceholder = "<content />";
    const dataPlaceholder = "_STE_DATA";
    const sanitizedOptions = sanitize(options);
    let rendered = mainTemplate
      .replace(contentPlaceholder, contentTemplate)
      .replaceAll(dataPlaceholder, sanitizedOptions);

    callback(null, rendered);
  } catch (err) {
    callback(err);
  }
};
