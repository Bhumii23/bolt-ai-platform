// import type{NextFunction, Request, Response} from 'express';
// import jwt from 'jsonwebtoken';

// export function authMiddleware(req:Request, res:Response, next:NextFunction) {
//     // Simple authentication middleware example
//     const authHeader= req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
//     if(!token){
//          res.status(401).json({error: "Unauthorized"});
//          return;
//     }


// const decoded=jwt.verify(token,process.env.JWT_PUBLIC_KEY!,{algorithms: ['RS256']});
// if(!decoded){
//      res.status(401).json({error: "Unauthorized"});
//      return;
// }
// const userId=(decoded as any).sub; //by payload.sub we get back user id bcz whenver user come it will hit to clerk for sign up and sign in
// if(!userId){
//     return res.status(401).json({error: "Unauthorized"});
// }
// req.userId=userId;
// next();
// }

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  if (!process.env.JWT_PUBLIC_KEY) {
    console.error("JWT_PUBLIC_KEY not set");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    const userId = (decoded as any).sub;

    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
