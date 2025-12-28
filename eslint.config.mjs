// @ts-check
import electronConfig from '@electron-toolkit/eslint-config-ts'
import { defineConfig } from '@eslint/config-helpers'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: ['out/**', 'dist/**', 'node_modules/**', '.vite/**', 'eslint.config.mjs']
  },

  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  ...electronConfig.configs.recommended,

  {
    // Apply type-aware linting to TypeScript files
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json', './tsconfig.web.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'no-control-regex': 'off'
    }
  }
])
