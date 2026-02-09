// import type{NextFunction, Request, Response} from 'express';
// import jwt from 'jsonwebtoken';

//   const JWT_PUBLIC_KEY=process.env.JWT_PUBLIC_KEY?? `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0/Taz/PQrrKGjAt+HOOr
// LZ0hhto0j1VgCKt4Z6glea6fFvNc60w7voX85bxbmk05o7qE9v40gyIB/z+v/A42
// yed8xsis618YbrZPO70HJOWx4S53ZZeAit9n2BeS7mZXi8O7PD1tg4WzyunetGo9
// gAQgRCvbEE8VdMnj1rc9MgWPVAvnrneIY3xi51ga9ORlzAtulKhCerGSuYKjen/E
// B0vUHI60cmm+K3MfkLyUl0a+WIWIJhVx8gD0GdB9BO2VYRjB7Am3YQsm6CJn5tTp
// bE6t2cOFKg5qjm4SN8WDqx0atxOqOYlNZ8xK9FyKMQjznli0OuUZAoUXXDyff42y
// 2wIDAQAB
// -----END PUBLIC KEY-----`;
// export function authMiddleware(req:Request, res:Response, next:NextFunction) {
//     // Simple authentication middleware example
//     const authHeader= req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
//     if(!token){
//          res.status(401).json({error: "Unauthorized"});
//          return;
//     }

// console.log("JWT_PUBLIC_KEY:", JWT_PUBLIC_KEY); // Debugging line to check if the key is loaded
// const decoded=jwt.verify(token,process.env.JWT_PUBLIC_KEY!,
//   {algorithms: ['RS256']});
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

// // import type { NextFunction, Request, Response } from "express";
// // import jwt from "jsonwebtoken";

// // export function authMiddleware(
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) {
// //   const authHeader = req.headers.authorization;
// //   const token = authHeader?.split(" ")[1];

// //   if (!token) {
// //     return res.status(401).json({ error: "Missing token" });
// //   }

// //   if (!process.env.JWT_PUBLIC_KEY) {
// //     console.error("JWT_PUBLIC_KEY not set");
// //     return res.status(500).json({ error: "Server misconfigured" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
// //       algorithms: ["RS256"],
// //     });

// //     const userId = (decoded as any).sub;

// //     if (!userId) {
// //       return res.status(401).json({ error: "Invalid token payload" });
// //     }

// //     req.userId = userId;
// //     next();
// //   } catch (err) {
// //     return res.status(401).json({ error: "Invalid or expired token" });
// //   }
// // }

import { verifyToken } from "@clerk/backend";
import type { Request, Response, NextFunction } from "express";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!process.env.CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY is not defined");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload.sub) {
      console.error("Token verified but no sub (userId) found");
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = payload.sub;
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
