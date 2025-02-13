const jwt = require("jsonwebtoken");

function Generatetoken(email) {
  const token = jwt.sign(email, "secret");
  return token;
}

//t
async function Authenticator(req, res, next) {
  if (req.headers.authorization) {
 console.log(req.headers.authorization)
    if (req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      if (token == null) {
        res.send({ message: "unauthorized" });
      }
      const decode = jwt.verify(token,"secret");
      if (decode) {
        req.data=decode;
        
        next();
      }
    } }else
      res.send({ message: "unauthorized" });
    }
  //hh


module.exports = { Authenticator, Generatetoken };
