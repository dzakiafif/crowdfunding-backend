import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()
async function main() {
  const seedUser = await prisma.users.create({
    data: {
      email: "admin@mail.com",
      password: await bcrypt.hash("Gulali123@", 12),
      name: "admin",
      role: "ADMIN",
    },
  })

  console.log("seed berhasil", seedUser)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit()
  })
