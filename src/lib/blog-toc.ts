export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Extracts h2 and h3 headings from HTML or markdown content,
 * injects unique IDs into the heading tags for anchor navigation,
 * and returns the processed HTML along with the structured headings list.
 */
export function extractHeadingsAndInjectIds(rawContent: string): {
  processedHtml: string;
  headings: TocHeading[];
} {
  if (!rawContent) {
    return { processedHtml: "", headings: [] };
  }

  const headings: TocHeading[] = [];
  const slugCounts: Record<string, number> = {};

  // 1. Convert any markdown-style headings (## or ###) to HTML if present
  let content = rawContent.replace(
    /^(#{2,3})\s+(.+)$/gm,
    (_match, hashes, headingText) => {
      const level = hashes.length;
      return `<h${level}>${headingText.trim()}</h${level}>`;
    }
  );

  // 2. Match all <h2...> and <h3...> tags (case-insensitive)
  const headingRegex = /<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  const processedHtml = content.replace(
    headingRegex,
    (fullMatch, levelStr, existingAttrs, innerContent) => {
      const level = parseInt(levelStr, 10);
      // Strip any nested HTML tags to get pure display text
      const cleanText = innerContent.replace(/<[^>]*>/g, "").trim();
      if (!cleanText) return fullMatch;

      // Check if tag already has an id attribute
      const idMatch = existingAttrs.match(/\bid=["']([^"']+)["']/i);
      let id = idMatch ? idMatch[1] : null;

      if (!id) {
        // Generate a URL-friendly slug
        const baseSlug = cleanText
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        const slugKey = baseSlug || `heading-${headings.length + 1}`;
        const count = slugCounts[slugKey] || 0;
        slugCounts[slugKey] = count + 1;
        id = count === 0 ? slugKey : `${slugKey}-${count}`;

        headings.push({ id, text: cleanText, level });
        return `<h${level} id="${id}"${existingAttrs}>${innerContent}</h${level}>`;
      } else {
        headings.push({ id, text: cleanText, level });
        return fullMatch;
      }
    }
  );

  return { processedHtml, headings };
}
