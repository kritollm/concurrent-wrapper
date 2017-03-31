declare function concurrentWrapper(maxConcurrent: any, fn: any): (...args: any[]) => Promise<any>;
export { concurrentWrapper };
export default concurrentWrapper;
