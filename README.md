# concurrent-wrapper - Easily add logic to limit concurrent execution of any function returning a Promise.

## Reason

It is rarely a good thing to send off too many requests at once, so it's good to be able to limit it easy.
Some api's have a limit on unhandled request.

## Usage

```bash
$ npm install -S  concurrent-wrapper
```

```javascript
// var retryWrapper = require(retry-wrapper).retryWrapper
import { concurrentWrapper } from 'concurrent-wrapper';

let myAsyncFunctionWithConcurrentLogic = concurrentWrapper(2, myAsyncFunction);

let params = ["something", "somethingelse", "andanotherthing", "whattotype"]

params.forEach(p=>{
myAsyncFunctionWithConcurrentLogic(`https://unstable.com/api/findSomething?thing=${p}`)
    .then(r => {
        //..Do something with result
    })
    .catch(e => {
        // Retry 4 times was not enough,
        // do something with the error
    });
})

```

## Example

```javascript
import { retryWrapper } from 'retry-wrapper';

let retry = {};
function simulateRequest(req) {
    // --- To log retries ---
    retry[req] = retry[req] || 0;
    // ----------------------

    return new Promise((resolve, reject) => {

        var random = Math.floor(Math.random() * 10);
        // ---------------------------
        setTimeout(() => {
            retry[req]++;
            if (random < 7) {
                return reject(`${req}, failed at try ${retry[req]}`);
            }
            return resolve(req);
        }, random);
    });
}

let retryWrapped = retryWrapper(4, simulateRequest);
let promises = [];

for (let i = 0, l = 100; i < l; i++) {
    // 
    promises.push(retryWrapped(i)
        .then(result => ({ error: null, result }))
        .catch(error => ({ error, result: null }))
    );
}

Promise.all(promises)
    .then(res => {
        // Do something with the array of results
    });
```# concurrent-wrapper
