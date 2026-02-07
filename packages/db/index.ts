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

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
export const prismaClient = new PrismaClient({ adapter })


