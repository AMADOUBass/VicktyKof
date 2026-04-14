import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const logs = await prisma.emailLog.findMany({
    orderBy: { sentAt: 'desc' },
    take: 5
  })
  console.log(JSON.stringify(logs, null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
