function concurrentWrapper(maxConcurrent, fn) {
    let que = [];
    let concurrent = 0;

    function updateQue(r) {
        concurrent--;

        if (que.length) {
            let quedFunction = que.shift();
            quedFunction();
        }
        return r;
    }
    function executeFn(args): Promise<any> {
        if (concurrent < maxConcurrent) {
            concurrent++;
            return fn(...args)
                .then(updateQue)
                .catch(e => { throw updateQue(e) });
        }
        // We must store in que and execute once another request returns
        return new Promise((resolve, reject) => {
            que.push(() => {
                executeFn(args).then(resolve, reject);
            })
        });

    }
    return (...args) => {
        return executeFn(args);
    }
}
export { concurrentWrapper };
export default concurrentWrapper;