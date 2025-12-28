import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import enforceSingleEofNewline from './eslint-rules/enforce-single-eof-newline.js'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'custom': {
        rules: {
          'enforce-single-eof-newline': enforceSingleEofNewline,
        },
      },
    },
    rules: {
      'eol-last': 'off',
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxBOF: 0,
        },
      ],
      'custom/enforce-single-eof-newline': 'error',
    },
  },
])
