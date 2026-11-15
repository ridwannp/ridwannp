import { EvaluatedFinding, RecommendedProduct } from './types';
import { PRODUCTS } from '../data/products';

export function recommendProducts(findings: EvaluatedFinding[]): RecommendedProduct[] {
  if (!findings || findings.length === 0) {
    return [];
  }

  // Weight map based on finding priority
  const weightByPriority: Record<string, number> = {
    tinggi: 3,
    perhatian: 2,
    peluang: 1,
  };

  const tagWeights = new Map<string, number>();
  const tagToBestFinding = new Map<string, EvaluatedFinding>();

  for (const finding of findings) {
    const weight = weightByPriority[finding.priority] || 1;
    for (const tag of finding.tags) {
      const currentWeight = tagWeights.get(tag) || 0;
      tagWeights.set(tag, currentWeight + weight);

      // Keep the highest priority finding for this tag
      const existingFinding = tagToBestFinding.get(tag);
      if (!existingFinding || weight > (weightByPriority[existingFinding.priority] || 0)) {
        tagToBestFinding.set(tag, finding);
      }
    }
  }

  const scoredProducts: {
    product: (typeof PRODUCTS)[0];
    score: number;
    matchedFinding: EvaluatedFinding;
  }[] = [];

  for (const product of PRODUCTS) {
    let score = 0;
    let bestMatchedFinding: EvaluatedFinding | null = null;
    let highestWeight = -1;

    for (const tag of product.solvesTags) {
      const weight = tagWeights.get(tag);
      if (weight !== undefined && weight > 0) {
        score += weight;
        const finding = tagToBestFinding.get(tag);
        if (finding) {
          const findingWeight = weightByPriority[finding.priority] || 0;
          if (findingWeight > highestWeight) {
            highestWeight = findingWeight;
            bestMatchedFinding = finding;
          }
        }
      }
    }

    if (score > 0 && bestMatchedFinding) {
      scoredProducts.push({
        product,
        score,
        matchedFinding: bestMatchedFinding,
      });
    }
  }

  // Sort descending by score, with featured products as tiebreaker
  scoredProducts.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.product.featured && !a.product.featured) return 1;
    if (!b.product.featured && a.product.featured) return -1;
    return 0;
  });

  return scoredProducts.slice(0, 3).map(({ product, matchedFinding }) => ({
    product,
    matchedFindingTitle: matchedFinding.title,
    reason: `Membantu mengatasi kendala "${matchedFinding.title}" melalui ${product.format.toLowerCase()} yang praktis.`,
  }));
}

