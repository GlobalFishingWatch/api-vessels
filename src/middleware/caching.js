module.exports = {
  withStaticTTL(ttl) {
    return (req, res, next) => {
      if (ttl) {
        res.set('Cache-Control', `private, max-age=${ttl}`);
      }
      next();
    };
  },
};
