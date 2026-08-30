/** @param {readonly string[]} filePaths */
export function findUnexpectedRecordFiles(filePaths) {
  return filePaths
    .filter((filePath) => {
      const fileName = filePath.split('/').at(-1);
      if (!fileName || fileName.startsWith('.')) return false;
      return fileName.toLowerCase() !== 'readme.md';
    })
    .sort();
}
