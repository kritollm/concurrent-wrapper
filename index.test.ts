// Stupid to use a library for this simple test, but to use hours to write test and debug the tests because
// it can't handle async code and promises is more important than productivity :)

import { concurrentWrapper } from '.';

test('concurrent-wrapper', done => {
    let maxConcurrent = 3;
    let parallelRequests = 0;
    function simulateRequest(req, done) {

        return new Promise((resolve, reject) => {

            var random = Math.floor(Math.random() * 20);
            parallelRequests++;
            // This test will be catched if it fails
            try {
                expect(parallelRequests).toBeLessThanOrEqual(maxConcurrent);
            } catch (e) {
                done.fail(e);
            }

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
        promises.push(concurrentWrapped(i, done).catch(e => e))
    }
    return Promise.all(promises)
        .then(res => {
            //console.log(res);
            expect(res.length).toBe(100);
            done();
        })
        .catch(e => done.fail(e));
});