import { useEffect } from "react";
import {
  Building, Users, Calendar, BarChart3, CheckCircle, XCircle, Clock,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { fetchProperties, updatePropertyStatus } from "@/store/propertySlice";
import { fetchAllAppointments, updateAppointmentStatus } from "@/store/appointmentSlice";
import { addNotification } from "@/store/notificationSlice";
import { mockUsers } from "@/data/mockUsers";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  scheduled: "warning",
  completed: "secondary",
  cancelled: "destructive",
};

const CHART_COLORS = [
  "hsl(213, 56%, 24%)",
  "hsl(40, 55%, 58%)",
  "hsl(171, 60%, 40%)",
  "hsl(280, 50%, 50%)",
  "hsl(350, 60%, 55%)",
  "hsl(199, 89%, 48%)",
];

export default function AdminPanel() {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector((s) => s.properties);
  const { appointments } = useAppSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(fetchProperties({}));
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  // Analytics Data
  const cityData = Object.entries(
    properties.reduce<Record<string, number>>((acc, p) => {
      acc[p.location.city] = (acc[p.location.city] || 0) + 1;
      return acc;
    }, {})
  ).map(([city, count]) => ({ name: city, properties: count }));

  const statusData = [
    { name: "Approved", value: properties.filter((p) => p.status === "approved").length },
    { name: "Pending", value: properties.filter((p) => p.status === "pending").length },
    { name: "Rejected", value: properties.filter((p) => p.status === "rejected").length },
  ];

  const monthlyData = [
    { month: "Sep", appointments: 3 },
    { month: "Oct", appointments: 5 },
    { month: "Nov", appointments: 8 },
    { month: "Dec", appointments: 4 },
    { month: "Jan", appointments: 7 },
    { month: "Feb", appointments: appointments.length },
  ];

  const handleApprove = (id: string, name: string) => {
    dispatch(updatePropertyStatus({ id, status: "approved" }));
    dispatch(addNotification({ title: "Property Approved", message: `${name} has been approved`, type: "property" }));
    toast.success(`${name} approved`);
  };

  const handleReject = (id: string, name: string) => {
    dispatch(updatePropertyStatus({ id, status: "rejected" }));
    dispatch(addNotification({ title: "Property Rejected", message: `${name} has been rejected`, type: "property" }));
    toast.error(`${name} rejected`);
  };

  const handleApproveAppointment = (id: string) => {
    dispatch(updateAppointmentStatus({ id, status: "approved" }));
    dispatch(addNotification({ title: "Appointment Approved", message: "Appointment has been confirmed", type: "appointment" }));
    toast.success("Appointment approved");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage listings, users, and appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Properties", value: properties.length, icon: Building, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
          { label: "Pending Review", value: properties.filter((p) => p.status === "pending").length, icon: Clock, color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600" },
          { label: "Total Users", value: mockUsers.length, icon: Users, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
          { label: "Appointments", value: appointments.length, icon: Calendar, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analytics">
        <TabsList className="w-full sm:w-auto flex-wrap">
          <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-1.5" /> Analytics</TabsTrigger>
          <TabsTrigger value="listings"><Building className="h-4 w-4 mr-1.5" /> Listings</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1.5" /> Users</TabsTrigger>
          <TabsTrigger value="appointments"><Calendar className="h-4 w-4 mr-1.5" /> Appointments</TabsTrigger>
        </TabsList>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Properties by City */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Properties by City</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cityData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="properties" fill="hsl(213, 56%, 24%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointments Over Time */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Appointments Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="appointments" stroke="hsl(40, 55%, 58%)" strokeWidth={3} dot={{ fill: "hsl(40, 55%, 58%)", r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Listings */}
        <TabsContent value="listings">
          <div className="space-y-3 mt-4">
            {properties.map((prop) => (
              <Card key={prop.id} className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img src={prop.images[0]} alt={prop.name} className="h-20 w-32 rounded-lg object-cover shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{prop.name}</h4>
                        <p className="text-sm text-muted-foreground">{prop.location.city} - {prop.config} - {formatPrice(prop.price)}</p>
                        <p className="text-xs text-muted-foreground mt-1">By: {prop.sellerName}</p>
                      </div>
                      <Badge variant={statusColors[prop.status]} className="capitalize shrink-0">{prop.status}</Badge>
                    </div>
                  </div>
                  {prop.status === "pending" && (
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <Button size="sm" variant="default" onClick={() => handleApprove(prop.id, prop.name)}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(prop.id, prop.name)}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <div className="space-y-3 mt-4">
            {mockUsers.map((u) => (
              <Card key={u.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{u.name}</h4>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Joined: {formatDate(u.createdAt)}</p>
                  </div>
                  <Badge variant={u.role === "admin" ? "default" : u.role === "seller" ? "gold" : "secondary"} className="capitalize">
                    {u.role}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appointments */}
        <TabsContent value="appointments">
          {appointments.length === 0 ? (
            <Card className="p-12 text-center mt-4">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No appointments</h3>
            </Card>
          ) : (
            <div className="space-y-3 mt-4">
              {appointments.map((apt) => (
                <Card key={apt.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-medium">{apt.propertyName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {apt.type === "videoCall" ? "Video Call" : "Site Visit"} - {apt.buyerName} &rarr; {apt.sellerName}
                      </p>
                      <p className="text-sm">{formatDate(apt.date)} at {apt.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusColors[apt.status]} className="capitalize">{apt.status}</Badge>
                      {apt.status === "scheduled" && (
                        <Button size="sm" onClick={() => handleApproveAppointment(apt.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
