Antlers is a templating language for [Statamic](https://statamic.com/).

## Usage

Include the Highlight.js library in your webpage or Node app, and then include the Antlers highlighting module.

### Using the distribution files

If you already have a copy of Highlight.js and the Antlers within your project, you can include them both like so:

```html
<script type="text/javascript" src="/path/to/highlight.min.js"></script>
<script type="text/javascript" charset="UTF-8"
  src="/path/to/highlightjs-antlers/dist/antlers.min.js"></script>
<script type="text/javascript">
  hljs.highlightAll();
</script>
```

### Using UNPKG CDN

```html
<script type="text/javascript"
    src="https://unpkg.com/highlightjs-antlers@0.0.1/dist/antlers.min.js"></script>
```

### Using Node

You may install the Antlers grammar using

```bash
npm install highlightjs-antlers
```

afterwards, you can register it like so:

```js
import hljs from 'highlight.js';
import hljsAntlers from 'highlightjs-antlers';

hljs.registerLanguage('antlers', hljsAntlers);

hljs.highlightAll();
```

## License

highlightjs-antlers is released under the CC0 1.0 License.
