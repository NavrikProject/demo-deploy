import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_LOGIN_SECRET_KEY, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.send({ token: "Token is invalid or expired" });
      }
    });
  } else {
    return res.send({ token: "You are not authenticated" });
  }
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isSuperAdmin) {
      next();
    } else {
      res.send("You are not allowed to do that");
    }
  });
};
