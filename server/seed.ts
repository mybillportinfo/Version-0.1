import { db } from "./db";
import { users, bills, rewards } from "@shared/schema";

export async function seedDatabase() {
  // Check if data already exists
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database with demo data...");

  // Create demo user
  const [demoUser] = await db
    .insert(users)
    .values({
      username: "johndoe",
      password: "demo123",
      name: "John Doe"
    })
    .returning();

  // Create demo bills
  await db.insert(bills).values([
    {
      userId: demoUser.id,
      name: "Electricity Bill",
      company: "ConEd Energy",
      amount: "247.80",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      priority: "urgent" as const,
      icon: "fas fa-bolt",
      isPaid: 0,
    },
    {
      userId: demoUser.id,
      name: "Credit Card",
      company: "Chase Sapphire",
      amount: "1245.30",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      priority: "urgent" as const,
      icon: "fas fa-credit-card",
      isPaid: 0,
    },
    {
      userId: demoUser.id,
      name: "Internet Bill",
      company: "Spectrum",
      amount: "89.99",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
      priority: "medium" as const,
      icon: "fas fa-wifi",
      isPaid: 0,
    },
    {
      userId: demoUser.id,
      name: "Phone Bill",
      company: "Verizon",
      amount: "125.00",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
      priority: "medium" as const,
      icon: "fas fa-phone",
      isPaid: 0,
    },
    {
      userId: demoUser.id,
      name: "Netflix",
      company: "Streaming Service",
      amount: "15.99",
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // in 15 days
      priority: "low" as const,
      icon: "fas fa-tv",
      isPaid: 0,
    }
  ]);

  // Create demo rewards
  await db.insert(rewards).values([
    {
      userId: demoUser.id,
      points: 250,
      title: "On-time Payment Bonus",
      description: "Earned for paying 5 bills on time",
      isRedeemed: 0,
    },
    {
      userId: demoUser.id,
      points: 100,
      title: "First Payment",
      description: "Welcome bonus for first payment",
      isRedeemed: 0,
    }
  ]);

  console.log("Database seeded successfully!");
  return demoUser.id;
}