const express = require("express");
const passport = require("passport");

const router = new express.Router();


router.get("/github", passport.authenticate("github", { scope: ["read:user"] }));


router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    const dest = (req.session && req.session.returnTo && /^\/(?!\/)/.test(req.session.returnTo))
      ? req.session.returnTo
      : "/";

    if (req.session) delete req.session.returnTo;
    return res.redirect(dest);
  }
);

router.get("/success", (req, res) => {
  res.status(200).json({ ok: true, user: req.user || null });
});

router.get("/failure", (_req, res) => {
  res.status(401).json({ ok: false, message: "GitHub authentication failed" });
});


router.post("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ ok: false, error: "Logout failed" });
  req.session.destroy(() => {
      res.clearCookie("sessionId");
      res.json({ ok: true });
    });
  });
});

module.exports = router;