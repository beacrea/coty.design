import { db } from "./db";
import { knowledgeModules, moduleKeywords } from "@shared/schema";
import { modules } from "./kb/modules";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding knowledge base modules...");

  for (const module of modules) {
    // Extract title from first header line of content
    const titleMatch = module.content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : module.id;

    // Insert module
    const [inserted] = await db
      .insert(knowledgeModules)
      .values({
        slug: module.id,
        title,
        content: module.content,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: knowledgeModules.slug,
        set: {
          title,
          content: module.content,
          updatedAt: new Date(),
        },
      })
      .returning();

    console.log(`  Seeded module: ${inserted.slug} (${inserted.title})`);

    // Delete existing keywords for this module and re-insert
    await db.delete(moduleKeywords).where(
      eq(moduleKeywords.moduleId, inserted.id)
    );

    // Insert keywords
    if (module.keywords.length > 0) {
      const keywordRecords = module.keywords.map((keyword, index) => ({
        moduleId: inserted.id,
        keyword,
        weight: index === 0 ? 3 : 1, // First keyword has higher weight
        isPrimary: index === 0,
      }));

      await db.insert(moduleKeywords).values(keywordRecords);
      console.log(`    Added ${module.keywords.length} keywords`);
    }
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
