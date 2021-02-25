module.exports = {
  '*.{js,jsx,ts,tsx,json,css,scss,md}': ['prettier --write'],
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  'src/**/*.{ts,tsx}': [
    // https://github.com/okonet/lint-staged#example-run-tsc-on-changes-to-typescript-files-but-do-not-pass-any-filename-arguments
    () => 'npm run lint:ts'
  ],
  'package.json': [() => 'node ./scripts/checkEngineVersions.js']
};
