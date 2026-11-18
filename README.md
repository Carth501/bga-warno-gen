# React + TypeScript + Vite

## Documents and images

The Situation section covers the area of operation, enemy presence, friendly
personnel, and civilian status.

General Orders covers the timeline, tasks, and coordination instruction.
Command and Signal covers the chain of command, comms nets, smoke and signals,
codewords, and sundial procedure.

Add optional PNG, JPEG, GIF, or WebP images in the Mission section. Change their
captions, order, and displayed width (25–100%); they appear after the objectives
in the preview and printed document. Image files retain their original resolution.

Form fields are saved in the browser, but images are kept only until the page is
reloaded or closed. Export a ZIP to preserve the entire document. The ZIP contains
`opord.json` and the original image files. Use Import to replace the current
document with an exported ZIP or a legacy JSON export. Reset clears both fields
and images.

## GitHub Pages

In the repository's **Settings → Pages**, select **GitHub Actions** as the
build and deployment source. Push these changes to `main` to run the Pages
workflow; subsequent pushes to `main` deploy automatically. The workflow can
also be started manually from the Actions tab. The relative asset base supports
both project Pages URLs and root or custom-domain URLs.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
