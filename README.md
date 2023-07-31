# is-tor-order

```
Checks if http header order is Tor
```

## Usage

```javascript
const express = require("express");
const isTorOrder = require("is-tor-order");

const port = 3000;
const app = express();

app.get("/", ({ headers }, res) => {
  const are = isTorOrder(headers) ? "are" : "are not";

  res.send(`You ${are} tor!`);
});

app.listen(port);
```

# API

```javascript
  type Headers = Record<string, string> | string[] | Array<[string, string]>;
  type IsTorOrderOptions = {
    areRawHeaders: boolean;
  };

  function isTorOrder(
    headers: Headers,
    options: IsTorOrderOptions = { areRawHeaders = false }
  ): boolean;

  export = isTorOrder;
```

`headers` - one of:

- array of strings

```javascript
["accept", "accept-language"];
```

- object of structure `[key: string]: string`

```javascript
{
  'accept': '...',
  'user-agent': '...'
}
```

- array with 2-length array of strings

```javascript
[
  ["accept-encoding", "gzip"],
  ["accept", "*/*"],
];
```

`options`: object that can have `areRawHeaders` option if it should parse entries array such as:

```javascript
[
  "user-agent",
  "this is invalid because there can be only one",
  "User-Agent",
  "curl/7.22.0",
  "Host",
  "127.0.0.1:8000",
  "ACCEPT",
  "*",
];
```

`areRawHeaders` defaults to `false`

## Test

```bash
npm test
```

## Related repositories

[is-chrome-order](https://github.com/thepicture/is-chrome-order)
[is-firefox-order](https://github.com/thepicture/is-firefox-order)
[is-safari-order](https://github.com/thepicture/is-safari-order)
