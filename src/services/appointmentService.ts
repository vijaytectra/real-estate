import { mockAppointments } from "@/data/mockAppointments";
import type { Appointment, AppointmentType } from "@/types";
import { delay, generateId } from "@/lib/utils";

let appointments = [...mockAppointments];

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    await delay(300);
    return [...appointments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getByBuyerId(buyerId: string): Promise<Appointment[]> {
    await delay(300);
    return appointments
      .filter((a) => a.buyerId === buyerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getBySellerId(sellerId: string): Promise<Appointment[]> {
    await delay(300);
    return appointments
      .filter((a) => a.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async schedule(data: {
    propertyId: string;
    propertyName: string;
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
    sellerId: string;
    sellerName: string;
    type: AppointmentType;
    date: string;
    time: string;
    notes?: string;
  }): Promise<Appointment> {
    await delay(600);
    const newAppointment: Appointment = {
      ...data,
      id: generateId(),
      status: "scheduled",
      createdAt: new Date().toISOString().split("T")[0],
    };
    appointments = [newAppointment, ...appointments];
    return newAppointment;
  },

  async updateStatus(id: string, status: Appointment["status"]): Promise<Appointment | undefined> {
    await delay(400);
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) return undefined;
    appointments[index] = { ...appointments[index], status };
    return appointments[index];
  },
};
