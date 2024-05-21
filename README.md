# Audio Visualizer

This is an audio visualizer app that integrates with your Spotify account.

## Components and Styling

This app uses [TailwindCSS](https://tailwindcss.com/docs/installation) for styling along with the [Flowbite UI](https://flowbite-svelte.com/docs/pages/quickstart) component library for easy styling.

## Customizing Theme

To add custom colors to the theme add them to `tailwind.config.js` under `theme.extend.colors`
You can then use those colors freely with tailwind.

```js
  // tailwind.config.js
  theme: {
    extend: {
      'custom-color': '#111111'
    }
  }
```

```html
<!-- *.svelte -->
<div class="bg-custom-color">Hello, World!</div>
```

Global styles can be added in `app.css`. You can create custom classes with tailwind and vanilla CSS like so

```css
.my-custom-class {
  // using the tailwind apply directive
  @apply text-custom-color;

  // use vanilla css as well
  font-weight: 500;
}
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Recommended VSCode extensions

[PostCSS Language Support](https://marketplace.visualstudio.com/items?itemName=csstools.postcss)

[Tailwind CSS](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

[Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
