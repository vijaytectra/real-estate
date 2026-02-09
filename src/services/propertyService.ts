import { mockProperties } from "@/data/mockProperties";
import type { Property, Filters, CreatePropertyDTO } from "@/types";
import { delay, generateId } from "@/lib/utils";

let properties = [...mockProperties];

export const propertyService = {
  async getAll(filters?: Partial<Filters>): Promise<Property[]> {
    await delay(400);
    let results = [...properties];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.locality.toLowerCase().includes(q) ||
          p.location.state.toLowerCase().includes(q)
      );
    }

    if (filters?.city) {
      results = results.filter((p) => p.location.city === filters.city);
    }

    if (filters?.config) {
      results = results.filter((p) => p.config === filters.config);
    }

    if (filters?.budgetMin) {
      results = results.filter((p) => p.price >= filters.budgetMin!);
    }

    if (filters?.budgetMax) {
      results = results.filter((p) => p.price <= filters.budgetMax!);
    }

    if (filters?.possessionPeriod) {
      results = results.filter(
        (p) => p.possessionPeriod === filters.possessionPeriod
      );
    }

    if (filters?.status) {
      results = results.filter((p) => p.status === filters.status);
    }

    // Premium properties first
    results.sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return results;
  },

  async getById(id: string): Promise<Property | undefined> {
    await delay(300);
    return properties.find((p) => p.id === id);
  },

  async getByIds(ids: string[]): Promise<Property[]> {
    await delay(300);
    return properties.filter((p) => ids.includes(p.id));
  },

  async getBySellerId(sellerId: string): Promise<Property[]> {
    await delay(300);
    return properties.filter((p) => p.sellerId === sellerId);
  },

  async create(dto: CreatePropertyDTO, sellerId: string, sellerName: string, sellerPhone: string): Promise<Property> {
    await delay(800);
    const newProperty: Property = {
      ...dto,
      id: generateId(),
      sellerId,
      sellerName,
      sellerPhone,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    properties = [newProperty, ...properties];
    return newProperty;
  },

  async updateStatus(id: string, status: Property["status"]): Promise<Property | undefined> {
    await delay(500);
    const index = properties.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    properties[index] = { ...properties[index], status };
    return properties[index];
  },
};
