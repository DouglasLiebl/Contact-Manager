exports.middlewareGlobal = (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.errors = req.flash("errors");
  res.locals.user = req.session.user;
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404');
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "Você deve fazer login antes.");
    req.session.save(() => res.redirect("/"));
    return;
  };
  
  next();
}
