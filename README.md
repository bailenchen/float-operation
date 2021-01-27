A library of JavaScript tools for floating-point calculation.

## Load

The library is the single JavaScript file *float-operation.js*

Browser:

```HTML
<script type="module">
import operation from './path/to/float-operation.js';
...
</script>
```

ES module:

```js
import operation from 'float-operation';
```

## Use

Use 4 methods of add()、sub()、mul()、division()  to perform basic arithmetic operations.

```js
import operation from 'float-operation'

console.log('add', operation.add(12.123456, 10.154))
console.log('substract', operation.sub(12.123456, 10.154))
console.log('multiply', operation.mul(12.123456, 10.154))
console.log('divide', operation.division(12.123456, 10.154))
```

## Licence

MIT.

See *LICENCE.md*