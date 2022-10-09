import { NextFunction, Request, Response, urlencoded } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import jwtConfig from "../config/jwt";
import { IReqAuth } from "../types/user-interface";
import { findUserByEmail } from "../services/user.service";

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        success: false,
        message: "Authorization is required for this resources",
      });
    }
    const decodeToken = (await jwt.verify(
      token.split(" ")[1],
      jwtConfig.appKey
    )) as JwtPayload;
    const user = await findUserByEmail(decodeToken.email);

    console.log("auth user: ", user)

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        success: false,
        message: "Invalid authorization token. Please try again",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export default auth;
