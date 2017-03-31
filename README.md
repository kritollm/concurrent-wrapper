# concurrent-wrapper - Easily add logic to limit concurrent execution of any function returning a Promise.

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
import { concurrentWrapper } from 'concurrent-wrapper';

let maxConcurrent = 3;
// To log
let parallelRequests = 0;

function doSomething(r) {
    console.log(r);
}
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
//Same callback as the default, just lower timeouts to avoid timeout exception from
// jasmine

let concurrentWrapped = concurrentWrapper(maxConcurrent, simulateRequest);
let promises = [];
for (let i = 0, l = 100; i < l; i++) {
    promises.push(concurrentWrapped(i)
    // Catch so Promise.all(promises) isn't rejected if
    // retry fails.
    .catch(e => e));
}
Promise.all(promises)
    .then(res => {
        res.forEach(r => doSomething(r));
    });
```# concurrent-wrapper
