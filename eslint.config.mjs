// @ts-check
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importXPlugin from 'eslint-plugin-import-x';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    ignores: ['*', '*/', '!src/', 'src/test/**/*'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      'import-x': importXPlugin,
    },
    rules: {
      // Import rules
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import-x/no-unresolved': 'off',
      'import-x/named': 'off',
      'import-x/default': 'off',
      'import-x/namespace': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-duplicates': 'error',
      // TypeScript rules
      '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true, ignoreVoidOperator: true },
      ],
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/unified-signatures': ['error', { ignoreDifferentlyNamedParameters: true }],
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowBoolean: true, allowNumber: true, allowNullish: true },
      ],
      'no-throw-literal': 'warn',
    },
    settings: {
      'import-x/extensions': ['.js', '.ts'],
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },
  },
  {
    name: 'extension:node',
    files: ['src/**/*'],
    ignores: ['src/webviews/apps/**/*', 'src/env/browser/**/*'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          impliedStrict: true,
        },
        projectService: true,
      },
    },
  },
  {
    name: 'webviews',
    files: ['src/webviews/apps/**/*', 'src/env/browser/**/*'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          impliedStrict: true,
        },
        projectService: true,
      },
    },
  },
);
