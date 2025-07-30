import { getEmbedding } from "./embedding";

export const CATEGORY_TEXTS = {
  Interested:
    "The sender is interested in the proposal or offer and wants to learn more about services or discuss opportunities. They may ask for more information, schedule a meeting, or express interest in exploring options.",
  "Meeting Booked":
    "A meeting or call has been scheduled, confirmed, or booked. The email contains calendar details, appointment confirmation, or scheduling information.",
  "Not Interested":
    "The sender is not interested or has rejected the proposal. They may decline, say no thanks, pass on the opportunity, or express disinterest.",
  Spam: "This email is spam, irrelevant, or contains promotional content like limited time offers, free deals, urgent calls to action, or click here links.",
  "Out of Office":
    "The sender is currently out of office, unavailable, on vacation, or away. This is an automatic reply or status update about their availability.",
};

type CategoryLabel = keyof typeof CATEGORY_TEXTS;
type CategoryEmbeddings = Record<CategoryLabel, number[]>;

let cachedCategoryEmbeddings: CategoryEmbeddings | null = null;

export const getCategoryEmbeddings = async (): Promise<CategoryEmbeddings> => {
  if (cachedCategoryEmbeddings) return cachedCategoryEmbeddings;

  const result: Partial<CategoryEmbeddings> = {};
  for (const label of Object.keys(CATEGORY_TEXTS) as CategoryLabel[]) {
    result[label] = await getEmbedding(CATEGORY_TEXTS[label]);
  }

  cachedCategoryEmbeddings = result as CategoryEmbeddings;
  return cachedCategoryEmbeddings;
};
