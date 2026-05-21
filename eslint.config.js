// Flat config — ported 1:1 from the previous .eslintrc.js so behaviour
// stays the same. Two rule overrides from the old config were dropped
// because the rules no longer exist in @typescript-eslint v8:
//   - '@typescript-eslint/camelcase' (removed in v6; superseded by
//     '@typescript-eslint/naming-convention', which is not enabled by
//     the recommended preset, so the explicit 'off' was already a no-op)
//   - '@typescript-eslint/member-delimiter-style' (moved to
//     @stylistic in v6; not part of the recommended preset, so the
//     explicit 'off' was already a no-op)
//
// Effective rule set: eslint:recommended + plugin:@typescript-eslint/recommended
// (the v8 recommended preset already applies the eslint-recommended
// overrides for TypeScript).
const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const globals = require('globals')

module.exports = tseslint.config(
  // Replaces the old .eslintignore
  {
    ignores: ['dist/**', 'node_modules/**', 'example/node_modules/**', '.env'],
  },
  // eslint 10 enables reportUnusedDisableDirectives by default; the old
  // setup (eslint 9 + .eslintrc.js without overrides) did not flag
  // them, so turning it off here preserves the v2 lint behaviour.
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  js.configs.recommended,
  // CJS config files (jest.config.js, eslint.config.js) — declare the
  // Node globals that the old .eslintrc.js used to provide implicitly
  // via `env: node`.
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'commonjs',
    },
  },
  // Scope the typescript-eslint recommended preset (and the rule
  // overrides below) to .ts only. Without this, flat config applies
  // these TS-targeted rules to every file in the project.
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended],
    rules: {
      // Rules introduced (or significantly tightened) in
      // @typescript-eslint/recommended v3+, which the old
      // .eslintrc.js did not enforce. Disabled to preserve the v2
      // recommended-preset behaviour.
      //
      // 'no-require-imports' is net-new in v8 (replaced the v2
      // 'no-var-requires' surface area with a stricter check).
      '@typescript-eslint/no-require-imports': 'off',
      // 'no-unused-vars' existed in v2 but v8 now flags `const` arrays
      // whose only consumer is a `typeof X[number]` type alias — a
      // common pattern in this repo (e.g. ITEM_STATUSES, LOAN_*).
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
)
