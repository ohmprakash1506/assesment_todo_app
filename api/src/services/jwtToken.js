const jwt = require("jsonwebtoken");
require("dotenv").config();

const signature = process.env.TOKEN_SECERT;

class TokenService {
  generateToken = async (data) => {
    try {
      let header = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
      };
      let token;
      try {
        token = jwt.sign(header, signature, {
          expiresIn: "1d",
        });
      } catch (error) {
        return console.log(error);
      }
      return token;
    } catch (error) {
      return error;
    }
  };

  tokenVerifier = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) return res.status(403).send(`Token should not be empty`);

        const jwtToken = token.split(" ")[1];
        if (!jwtToken) return res.status(403).send(`JWT must be provided`); 

        let verify;
        try {
            verify = await jwt.verify(jwtToken, signature);
        } catch (error) {
            console.log(`Token verify error:`, error);
            return res.status(403).send(`Token verification failed`); 
        }
        
        if (verify) {
            req.user = verify; 
            return next(); 
        } else {
            return res.status(403).send(`Token verification failed`);
        }
    } catch (error) {
        console.error(`Error in token verification:`, error);
        return res.status(500).send(`Internal server error`);
    }
};

}

module.exports = TokenService;
