import { PrismaClient, UserRole, PropertyType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");


  // Create Users
  const owner = await prisma.user.create({
    data: {
      name: "John Owner",
      email: "owner@example.com",
      password: "hashedpassword123", // In real apps, store hashed password
      phone: "+911234567890",
      role: UserRole.AGENT
    }
  });

  const seeker = await prisma.user.create({
    data: {
      name: "Jane Seeker",
      email: "seeker@example.com",
      password: "hashedpassword456",
      phone: "+919876543210",
      role: UserRole.USER
    }
  });

  // Create Property
  const property = await prisma.property.create({
    data: {
      title: "Luxury Apartment in Mumbai",
      description: "3BHK with sea view, fully furnished.",
      type: PropertyType.APARTMENT,
      price: "12000000.00",
      location: "Mumbai, India",
      ownerId: owner.id,
      images: {
        create: [
          { url: "https://example.com/image1.jpg" },
          { url: "https://example.com/image2.jpg" }
        ]
      }
    },
    include: { images: true }
  });

  // Create Messages
  await prisma.message.createMany({
    data: [
      {
        content: "Hi, is this property still available?",
        propertyId: property.id,
        senderId: seeker.id,
        receiverId: owner.id
      },
      {
        content: "Yes, it is available. Would you like to schedule a visit?",
        propertyId: property.id,
        senderId: owner.id,
        receiverId: seeker.id
      }
    ]
  });

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
