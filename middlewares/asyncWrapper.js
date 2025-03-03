export default (asyncFn) => {
  return (req, res, next) => {
    asyncFn(req, res, next).catch((err) => {
      next(err);
    });
  };
};

// asyncFn => بتاخد اي ايرور حصل ف الكاتش وتبعتها ل => Global Middleware Error handler
