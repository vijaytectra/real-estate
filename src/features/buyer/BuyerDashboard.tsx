import { useEffect } from "react";
import { Heart, Calendar, Mail, MessageSquare, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/common/PropertyCard";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { fetchBuyerAppointments } from "@/store/appointmentSlice";
import { toggleEmail, toggleSms } from "@/store/notificationSlice";
import { mockProperties } from "@/data/mockProperties";
import { formatDate } from "@/lib/utils";

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  scheduled: "warning",
  approved: "success",
  completed: "secondary",
  cancelled: "destructive" as "default",
};

export default function BuyerDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { appointments, loading } = useAppSelector((s) => s.appointments);
  const { emailToggle, smsToggle } = useAppSelector((s) => s.notifications);

  useEffect(() => {
    if (user) dispatch(fetchBuyerAppointments(user.id));
  }, [user, dispatch]);

  const savedProperties = mockProperties.filter((p) =>
    user?.favorites.includes(p.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Manage your saved properties and appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{savedProperties.length}</p>
              <p className="text-xs text-muted-foreground">Saved Properties</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{appointments.length}</p>
              <p className="text-xs text-muted-foreground">Appointments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "approved").length}</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saved">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="saved" className="flex-1 sm:flex-none">
            <Heart className="h-4 w-4 mr-1.5" /> Saved
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex-1 sm:flex-none">
            <Calendar className="h-4 w-4 mr-1.5" /> Appointments
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 sm:flex-none">
            <Settings className="h-4 w-4 mr-1.5" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Saved Properties */}
        <TabsContent value="saved">
          {savedProperties.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No saved properties</h3>
              <p className="text-muted-foreground text-sm mt-1">Start browsing and save properties you like</p>
              <Button className="mt-4" asChild><a href="/">Browse Properties</a></Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {savedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Appointments */}
        <TabsContent value="appointments">
          {loading ? (
            <p className="text-muted-foreground py-8 text-center">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No appointments yet</h3>
              <p className="text-muted-foreground text-sm mt-1">Schedule a video call or site visit from a property page</p>
            </Card>
          ) : (
            <div className="space-y-3 mt-4">
              {appointments.map((apt) => (
                <Card key={apt.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-medium">{apt.propertyName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {apt.type === "videoCall" ? "Video Call" : "Site Visit"} with {apt.sellerName}
                      </p>
                      <p className="text-sm">
                        {formatDate(apt.date)} at {apt.time}
                      </p>
                    </div>
                    <Badge variant={statusColors[apt.status] || "default"} className="capitalize w-fit">
                      {apt.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Receive updates about your appointments via email</p>
                </div>
                <Switch checked={emailToggle} onCheckedChange={() => dispatch(toggleEmail())} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> SMS Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Receive SMS alerts for important updates</p>
                </div>
                <Switch checked={smsToggle} onCheckedChange={() => dispatch(toggleSms())} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
