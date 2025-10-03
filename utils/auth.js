

// Basic guard (401 JSON by default, or redirect if configured)
function requireAuth(opts = {}) {
  const {
    // If set, unauthenticated users will be redirected here (e.g., "/auth/github")
    loginRedirect = null,

    // If true, return 401 JSON for API/XHR callers but redirect real pages
    smart = true,
  } = opts;
  console.log("SUPERMAN");
  return (req, res, next) => {
    const isAuthed = req.isAuthenticated && req.isAuthenticated();
    if (isAuthed) return next();

    // Decide if caller looks like a browser page request
    const wantsHTML = req.accepts(['html', 'json']) === 'html'
      || /text\/html/.test(req.get('accept') || '');

    // Remember where to return after successful login
    if (req.session) req.session.returnTo = req.originalUrl;

    if (loginRedirect && (!smart || wantsHTML)) {
      return res.redirect(loginRedirect);         // e.g., "/auth/github"
    }

    // Default JSON response for APIs / Swagger XHR
    return res.status(401).json({ ok: false, message: "Not authenticated", login: loginRedirect || null });
  };
}

// Only allow NOT-logged-in users (e.g., login/register pages)
function requireGuest(opts = {}) {
  const { redirectTo = "/" } = opts;
  return (req, res, next) => {
    const isAuthed = req.isAuthenticated && req.isAuthenticated();
    if (!isAuthed) return next();
    return res.redirect(redirectTo);
  };
}

// Role-based guard (store roles/permissions on req.user)
function requireRole(role, opts = {}) {
  const { redirectTo = null } = opts;
  return (req, res, next) => {
    const user = req.user;
    const isAuthed = req.isAuthenticated && req.isAuthenticated();
    const hasRole = isAuthed && user && Array.isArray(user.roles) && user.roles.includes(role);

    if (hasRole) return next();

    if (!isAuthed) {
      if (redirectTo) return res.redirect(redirectTo);
      return res.status(401).json({ ok: false, message: "Not authenticated" });
    }

    // Authenticated but missing role
    return res.status(403).json({ ok: false, message: "Forbidden" });
  };
}

// (Optional) make user available to templates (if you render server-side pages)
function exposeUserToViews(req, res, next) {
  res.locals.user = req.user || null;
  next();
}

module.exports = {
  requireAuth,
  requireGuest,
  requireRole,
  exposeUserToViews,
};
