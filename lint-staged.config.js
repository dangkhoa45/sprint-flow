export default {
  // Lint and format TypeScript/JavaScript files
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // Format other files
  '*.{json,md,yml,yaml}': ['prettier --write'],

  // Type check TypeScript files
  '*.{ts,tsx}': ['pnpm run type-check'],

  // Run tests for changed files (if they have tests)
  '*.{js,jsx,ts,tsx}': [
    filenames => {
      const testFiles = filenames
        .map(filename => filename.replace(/\.(js|jsx|ts|tsx)$/, '.test.$1'))
        .filter(filename => {
          try {
            require('fs').accessSync(filename);
            return true;
          } catch {
            return false;
          }
        });

      if (testFiles.length > 0) {
        return `pnpm test ${testFiles.join(' ')}`;
      }
      return 'echo "No test files found"';
    },
  ],
};
