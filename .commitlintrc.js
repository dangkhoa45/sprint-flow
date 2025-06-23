export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type rules
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Code style changes
        'refactor', // Code refactoring
        'test', // Adding tests
        'chore', // Maintenance tasks
        'perf', // Performance improvements
        'ci', // CI/CD changes
        'build', // Build system changes
        'revert', // Revert changes
      ],
    ],

    // Scope rules - specific to our project
    'scope-enum': [
      2,
      'always',
      [
        'auth', // Authentication module
        'users', // User management
        'projects', // Project management
        'tasks', // Task management
        'milestones', // Milestone management
        'attachments', // File attachments
        'ui', // Frontend UI components
        'api', // Backend API
        'database', // Database changes
        'ci', // CI/CD pipeline
        'deps', // Dependencies
        'config', // Configuration files
        'docs', // Documentation
        'test', // Testing
        'docker', // Docker configuration
        'release', // Release process
      ],
    ],

    // Subject rules
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 72],

    // Body rules
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],

    // Footer rules
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],

    // Issue reference
    'references-empty': [2, 'never'],
  },

  // Custom parser for issue references
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['#'],
    },
  },

  // Custom plugins for issue tracking
  plugins: [
    {
      rules: {
        'issue-format': [2, 'always', /^#\d+$/],
      },
    },
  ],
};
