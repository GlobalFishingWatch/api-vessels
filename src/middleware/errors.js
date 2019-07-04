const swaggerError2ValidationError = error => ({
  fields: [
    {
      field: error.paramName,
      errors: [
        {
          code: error.code.toLowerCase(),
          message: error.toString()
        }
      ]
    }
  ],

  general: []
});

module.exports = {
  handleErrors() {
    return (err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }

      if (err.failedValidation) {
        return res.status(400).json(swaggerError2ValidationError(err));
      }

      return res.sendStatus(500);
    };
  }
};
