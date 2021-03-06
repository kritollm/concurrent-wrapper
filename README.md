# concurrent-wrapper

## Description
Easily add logic to limit concurrent execution of any function returning a Promise.

## Reason
It is rarely a good thing to send off too many requests at once, so it's good to be able to limit it easy.
Some api's have a limit on unhandled request.

## Usage
```bash
$ npm install -S concurrent-wrapper
```

```javascript
// var concurrentWrapper = require(concurrent-wrapper).concurrentWrapper;
import { concurrentWrapper } from 'concurrent-wrapper';

let withConcurrentLogic = concurrentWrapper(2, myAsyncFunction);

let params = ["something", "somethingelse", "andanotherthing", "whattotype"]

params.forEach(p => withConcurrentLogic(`https://unstable.com/api/findSomething?thing=${p}`)
    .then(r => {
        //..Do something with result
    })
    .catch(e => {
        // Retry 4 times was not enough,
        // do something with the error
    }));

```

>If my function doesn't return a Promise, am I doomed to live a life in callback hell making spaghetti code?

Fear not, you can use [this](https://www.npmjs.com/package/cb-topromise-wrapper).

## Example

```javascript
import { concurrentWrapper } from 'concurrent-wrapper';

let maxConcurrent = 3;
// To log
let parallelRequests = 0;

function simulateRequest(req) {

    return new Promise((resolve, reject) => {

        var random = Math.floor(Math.random() * 20);
        parallelRequests++;
        // Log parallel requests
        console.log('Requests in parallel', parallelRequests);

        // ---------------------------
        setTimeout(() => {
            let requestInParallel = parallelRequests;
            parallelRequests--;
            if (random < 7) {
                return reject({ ok: false, req, requestInParallel });
            }
            return resolve({ ok: true, req, requestInParallel });
        }, random);
    });
}

let concurrentWrapped = concurrentWrapper(maxConcurrent, simulateRequest);
let promises = [];
for (let i = 0, l = 100; i < l; i++) {
    promises.push(concurrentWrapped(i)
    // Catch so Promise.all(promises) isn't rejected if
    // retry fails.
    .catch(e => e));
}
function doSomething(r) {
    console.log(r);
    return r;
}
Promise.all(promises)
    .then(res => res
        .map(r => doSomething(r)));
```
## Tips

You can use it with retry-wrapper to also add retry logic to your async function.

```bash
$ npm install -S concurrent-wrapper retry-wrapper
```

```javascript
// var concurrentWrapper = require(concurrent-wrapper).concurrentWrapper;
import { concurrentWrapper } from 'concurrent-wrapper';
// var retryWrapper = require(retry-wrapper).retryWrapper;
import { retryWrapper } from 'retry-wrapper';

// Fastest, retries must wait in que.
let retryAndConcurrent = retryWrapper(5, concurrentWrapper(5, myRequestFunction));
// Slower, retries doesn't wait in que.
//let retryAndConcurrent = concurrentWrapper(5, retryWrapper(5, myRequestFunction));
for (let i = 0, l = 1000; i < l; i++) {
    retryAndConcurrent(i).then(console.log.bind(console)).catch(console.error.bind(console))
  }
```