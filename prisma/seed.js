const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = {
  'سبزی': [['آلو', 90, 'kg'], ['پیاز', 80, 'kg'], ['ٹماٹر', 120, 'kg'], ['بھنڈی', 200, 'kg'], ['لہسن', 450, 'kg']],
  'پھل': [['سیب', 280, 'kg'], ['کیلا', 180, 'dozen'], ['انار', 350, 'kg'], ['مالٹا', 160, 'dozen']],
  'ڈیری': [['دودھ', 220, 'litre'], ['دہی', 240, 'kg'], ['انڈے', 360, 'dozen'], ['مکھن', 250, 'packet']],
  'راشن': [['چاول (باسمتی)', 320, 'kg'], ['آٹا', 130, 'kg'], ['چینی', 150, 'kg'], ['کوکنگ آئل', 520, 'litre'], ['چائے پتی', 480, 'packet']],
};

async function main() {
  for (const [cat, list] of Object.entries(data)) {
    const c = await prisma.category.upsert({ where: { name: cat }, update: {}, create: { name: cat } });
    for (const [name, price, unit] of list) {
      const exists = await prisma.product.findFirst({ where: { name, categoryId: c.id } });
      if (!exists) await prisma.product.create({ data: { name, price, unit, categoryId: c.id } });
    }
  }
  console.log('Seed done');
}
main().finally(() => prisma.$disconnect());
