const fs = require("fs");
const path = require("path");

const RemoveFiles = async (files, single = false) => {
  try {
    if (single) {
      const filename = files.split("/").pop();
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        filename
      ); // Construct the full path to the file
      await fs.promises.unlink(filePath);
      return;
    }
    await Promise.all(
      files.map(async (file) => {
        const filename = file.split("/").pop();
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "uploads",
          filename
        ); // Construct the full path to the file
        await fs.promises.unlink(filePath);
      })
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = RemoveFiles;
