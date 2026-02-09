import type { User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "Rahul Sharma",
    email: "buyer@test.com",
    role: "buyer",
    phone: "+919876543211",
    favorites: ["prop-001", "prop-005", "prop-009"],
    registrationPaid: false,
    createdAt: "2025-06-15",
  },
  {
    id: "user-002",
    name: "Prestige Builders",
    email: "seller@test.com",
    role: "seller",
    phone: "+919876543210",
    favorites: [],
    registrationPaid: true,
    createdAt: "2025-05-01",
  },
  {
    id: "user-003",
    name: "Admin User",
    email: "admin@test.com",
    role: "admin",
    phone: "+919876543212",
    favorites: [],
    registrationPaid: false,
    createdAt: "2025-01-01",
  },
];
