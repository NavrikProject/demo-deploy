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
export function generateUniqueId(length) {
  var result = "";
  var characters = "abcdefuv";
  var number = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    result += number.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
