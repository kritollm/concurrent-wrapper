declare function concurrentWrapper(maxConcurrent: number, fn: (...args) => Promise<any>): (...args: any[]) => Promise<any>;
export { concurrentWrapper };
export default concurrentWrapper;
