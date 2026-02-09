// import { PrismaClient } from "./generated/prisma/client";


// export const prismaClient = new PrismaClient();

// import { PrismaClient } from "./generated/prisma/client";

// export const prismaClient = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL!,
//     },
//   },
// });

// import "dotenv/config";
// import { PrismaClient } from "./generated/prisma/client";

// export const prismaClient = new PrismaClient({
//   datasourceUrl: process.env.DATABASE_URL!,
// });


// import { PrismaClient } from "./generated/prisma/client";

// export const prismaClient = new PrismaClient();


// Source - https://stackoverflow.com/a/79873474
// Posted by Damodharan, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-07, License - CC BY-SA 4.0

import { PrismaClient } from './generated/prisma/client'

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in packages/db/index.ts");
}

export const prismaClient = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});


