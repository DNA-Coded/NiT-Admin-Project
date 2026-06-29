/**
 * Async Handler Utility
 *
 * Wraps async route controller functions to automatically catch any
 * rejected promises and forward the error to Express's next() middleware.
 *
 * Usage:
 *   export const myController = asyncHandler(async (req, res) => {
 *     const data = await someAsyncOperation();
 *     res.json({ success: true, data });
 *   });
 *
 * This eliminates the need for repetitive try/catch blocks in every controller.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
