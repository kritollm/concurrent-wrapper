"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function concurrentWrapper(maxConcurrent, fn) {
    var que = [];
    var concurrent = 0;
    function updateQue(r) {
        concurrent--;
        if (que.length) {
            var quedFunction = que.shift();
            quedFunction();
        }
        return r;
    }
    function executeFn(args) {
        if (concurrent < maxConcurrent) {
            concurrent++;
            return fn.apply(void 0, args).then(updateQue)
                .catch(function (e) { throw updateQue(e); });
        }
        // We must store in que and execute once another request returns
        return new Promise(function (resolve, reject) {
            que.push(function () {
                executeFn(args).then(resolve, reject);
            });
        });
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return executeFn(args);
    };
}
exports.concurrentWrapper = concurrentWrapper;
exports.default = concurrentWrapper;
