import { mockReviews } from "@/data/mockReviews";
import type { Review } from "@/types";
import { delay, generateId } from "@/lib/utils";

let reviews = [...mockReviews];

export const reviewService = {
  async getByPropertyId(propertyId: string): Promise<Review[]> {
    await delay(300);
    return reviews
      .filter((r) => r.propertyId === propertyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAll(): Promise<Review[]> {
    await delay(300);
    return [...reviews];
  },

  async create(data: {
    propertyId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    await delay(500);
    const newReview: Review = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    reviews = [newReview, ...reviews];
    return newReview;
  },

  async getAverageRating(propertyId: string): Promise<number> {
    await delay(100);
    const propertyReviews = reviews.filter((r) => r.propertyId === propertyId);
    if (propertyReviews.length === 0) return 0;
    return (
      propertyReviews.reduce((sum, r) => sum + r.rating, 0) /
      propertyReviews.length
    );
  },
};
