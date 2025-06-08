import pluginJs from '@eslint/js'
import pluginPrettier from 'eslint-config-prettier'

export default [
  pluginJs.configs.recommended,

  {
    globals: {
      window: true,
      document: true
    }
  },

  {
    files: ['**/*.{js,mjs,cjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },

  {
    ignores: ['node_modules/*']
  },

  pluginPrettier
]
