import { mockUsers } from "@/data/mockUsers";
import type { User, UserRole } from "@/types";
import { delay, generateId } from "@/lib/utils";

let users = [...mockUsers];

export const authService = {
  async loginWithGoogle(email: string): Promise<User | undefined> {
    await delay(500);
    return users.find((u) => u.email === email);
  },

  async register(name: string, email: string, role: UserRole, phone: string, registrationPaid: boolean = false): Promise<User> {
    await delay(600);
    const existing = users.find((u) => u.email === email);
    if (existing) throw new Error("User already exists with this email");

    const newUser: User = {
      id: generateId(),
      name,
      email,
      role,
      phone,
      favorites: [],
      registrationPaid,
      createdAt: new Date().toISOString().split("T")[0],
    };
    users = [...users, newUser];
    return newUser;
  },

  async getAllUsers(): Promise<User[]> {
    await delay(300);
    return [...users];
  },

  async toggleFavorite(userId: string, propertyId: string): Promise<string[]> {
    await delay(200);
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    const index = user.favorites.indexOf(propertyId);
    if (index === -1) {
      user.favorites = [...user.favorites, propertyId];
    } else {
      user.favorites = user.favorites.filter((id) => id !== propertyId);
    }
    return [...user.favorites];
  },
};
