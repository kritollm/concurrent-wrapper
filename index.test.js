// Stupid to use a library for this simple test, but to use hours to write test and debug the tests because
// it can't handle async code and promises is more important than productivity :)
"use strict";
var _1 = require(".");
test('concurrent-wrapper', function (done) {
    var maxConcurrent = 3;
    var parallelRequests = 0;
    function simulateRequest(req, done) {
        return new Promise(function (resolve, reject) {
            var random = Math.floor(Math.random() * 20);
            parallelRequests++;
            // This test will be catched if it fails
            try {
                expect(parallelRequests).toBeLessThanOrEqual(maxConcurrent);
            }
            catch (e) {
                done.fail(e);
            }
            // ---------------------------
            setTimeout(function () {
                var requestInParallel = parallelRequests;
                parallelRequests--;
                if (random < 7) {
                    return reject({ ok: false, req: req, requestInParallel: requestInParallel });
                }
                return resolve({ ok: true, req: req, requestInParallel: requestInParallel });
            }, random);
        });
    }
    //Same callback as the default, just lower timeouts to avoid timeout exception from
    // jasmine
    var concurrentWrapped = _1.concurrentWrapper(maxConcurrent, simulateRequest);
    var promises = [];
    for (var i = 0, l = 100; i < l; i++) {
        promises.push(concurrentWrapped(i, done).catch(function (e) { return e; }));
    }
    return Promise.all(promises)
        .then(function (res) {
        //console.log(res);
        expect(res.length).toBe(100);
        done();
    })
        .catch(function (e) { return done.fail(e); });
});
