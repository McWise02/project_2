


function requireAuth(opts = {}) {
  const {

    loginRedirect = null,


    smart = true,
  } = opts;
  return (req, res, next) => {
    const isAuthed = req.isAuthenticated && req.isAuthenticated();
    if (isAuthed) return next();


    const wantsHTML = req.accepts(['html', 'json']) === 'html'
      || /text\/html/.test(req.get('accept') || '');


    if (req.session) req.session.returnTo = req.originalUrl;

    if (loginRedirect && (!smart || wantsHTML)) {
      return res.redirect(loginRedirect);         
    }


    return res.status(401).json({ ok: false, message: "Not authenticated", login: loginRedirect || null });
  };
}




function exposeUserToViews(req, res, next) {
  res.locals.user = req.user || null;
  next();
}

module.exports = {
  requireAuth,
  exposeUserToViews,
};
