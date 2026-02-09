import { useEffect, useState } from "react";
import { Building, Plus, Calendar, Users, Crown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { addProperty, fetchSellerProperties } from "@/store/propertySlice";
import { fetchSellerAppointments } from "@/store/appointmentSlice";
import { addNotification } from "@/store/notificationSlice";
import { formatPrice, formatDate } from "@/lib/utils";
import type { PropertyConfig, PossessionPeriod } from "@/types";
import { toast } from "sonner";

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  scheduled: "warning",
  completed: "secondary",
};

export default function SellerDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { properties } = useAppSelector((s) => s.properties);
  const { appointments } = useAppSelector((s) => s.appointments);

  const sellerProperties = properties.filter((p) => p.sellerId === user?.id);

  useEffect(() => {
    if (user) {
      dispatch(fetchSellerProperties(user.id));
      dispatch(fetchSellerAppointments(user.id));
    }
  }, [user, dispatch]);

  // Add Property Form State
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formLocality, setFormLocality] = useState("");
  const [formState, setFormState] = useState("");
  const [formConfig, setFormConfig] = useState<PropertyConfig>("2BHK");
  const [formPossession, setFormPossession] = useState<PossessionPeriod>("ready");
  const [formPossessionDate, setFormPossessionDate] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formBedrooms, setFormBedrooms] = useState("");
  const [formBathrooms, setFormBathrooms] = useState("");
  const [formAmenities, setFormAmenities] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formBuildingVideo, setFormBuildingVideo] = useState("");
  const [formPremium, setFormPremium] = useState(false);

  const handleAddProperty = () => {
    if (!formName || !formPrice || !formCity || !user) {
      toast.error("Please fill in required fields (name, price, city)");
      return;
    }
    dispatch(
      addProperty({
        dto: {
          name: formName,
          description: formDesc,
          price: Number(formPrice),
          location: {
            address: `${formLocality}, ${formCity}`,
            locality: formLocality,
            city: formCity,
            state: formState,
            pincode: "000000",
            lat: 19.076,
            lng: 72.8777,
          },
          config: formConfig,
          possessionPeriod: formPossession,
          possessionDate: formPossessionDate || new Date().toISOString().split("T")[0],
          amenities: formAmenities.split(",").map((a) => a.trim()).filter(Boolean),
          images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
          ],
          flatVideoUrl: formVideoUrl || "",
          buildingVideoUrl: formBuildingVideo || "",
          isPremium: formPremium,
          bedrooms: Number(formBedrooms) || 2,
          bathrooms: Number(formBathrooms) || 2,
          area: Number(formArea) || 1000,
        },
        sellerId: user.id,
        sellerName: user.name,
        sellerPhone: user.phone,
      })
    );
    dispatch(addNotification({
      title: "Property Submitted",
      message: `${formName} has been submitted for review`,
      type: "property",
    }));
    toast.success("Property submitted for review!");
    // Reset form
    setFormName(""); setFormDesc(""); setFormPrice(""); setFormCity("");
    setFormLocality(""); setFormState(""); setFormArea(""); setFormBedrooms("");
    setFormBathrooms(""); setFormAmenities(""); setFormVideoUrl("");
    setFormBuildingVideo(""); setFormPremium(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your property listings and appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Listings", value: sellerProperties.length, icon: Building, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
          { label: "Approved", value: sellerProperties.filter((p) => p.status === "approved").length, icon: Building, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
          { label: "Appointments", value: appointments.length, icon: Calendar, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
          { label: "Inquiries", value: appointments.length, icon: Users, color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600" },
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

      <Tabs defaultValue="properties">
        <TabsList className="w-full sm:w-auto flex-wrap">
          <TabsTrigger value="properties"><Building className="h-4 w-4 mr-1.5" /> My Listings</TabsTrigger>
          <TabsTrigger value="add"><Plus className="h-4 w-4 mr-1.5" /> Add Property</TabsTrigger>
          <TabsTrigger value="appointments"><Calendar className="h-4 w-4 mr-1.5" /> Appointments</TabsTrigger>
          <TabsTrigger value="inquiries"><Users className="h-4 w-4 mr-1.5" /> Inquiries</TabsTrigger>
        </TabsList>

        {/* My Properties */}
        <TabsContent value="properties">
          {sellerProperties.length === 0 ? (
            <Card className="p-12 text-center mt-4">
              <Building className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No properties listed</h3>
              <p className="text-muted-foreground text-sm mt-1">Add your first property to get started</p>
            </Card>
          ) : (
            <div className="space-y-3 mt-4">
              {sellerProperties.map((prop) => (
                <Card key={prop.id} className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img src={prop.images[0]} alt={prop.name} className="h-24 w-36 rounded-lg object-cover shrink-0" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {prop.name}
                            {prop.isPremium && <Crown className="h-4 w-4 text-accent" />}
                          </h4>
                          <p className="text-sm text-muted-foreground">{prop.location.city} - {prop.config}</p>
                        </div>
                        <Badge variant={statusColors[prop.status]} className="capitalize shrink-0">
                          {prop.status}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-primary mt-1">{formatPrice(prop.price)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Add Property Form */}
        <TabsContent value="add">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Add New Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propName">Property Name *</Label>
                  <Input id="propName" placeholder="e.g., Skyline Heights" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propPrice">Price (INR) *</Label>
                  <Input id="propPrice" type="number" placeholder="e.g., 5000000" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your property..." value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} />
              </div>

              <Separator />
              <h4 className="font-medium text-sm">Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input placeholder="Mumbai" value={formCity} onChange={(e) => setFormCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Locality</Label>
                  <Input placeholder="Bandra West" value={formLocality} onChange={(e) => setFormLocality(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input placeholder="Maharashtra" value={formState} onChange={(e) => setFormState(e.target.value)} />
                </div>
              </div>

              <Separator />
              <h4 className="font-medium text-sm">Property Details</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Configuration</Label>
                  <Select value={formConfig} onValueChange={(v) => setFormConfig(v as PropertyConfig)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1BHK">1 BHK</SelectItem>
                      <SelectItem value="2BHK">2 BHK</SelectItem>
                      <SelectItem value="3BHK">3 BHK</SelectItem>
                      <SelectItem value="4BHK">4 BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input type="number" placeholder="2" value={formBedrooms} onChange={(e) => setFormBedrooms(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input type="number" placeholder="2" value={formBathrooms} onChange={(e) => setFormBathrooms(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Area (sq.ft)</Label>
                  <Input type="number" placeholder="1200" value={formArea} onChange={(e) => setFormArea(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Possession Period</Label>
                  <Select value={formPossession} onValueChange={(v) => setFormPossession(v as PossessionPeriod)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready to Move</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Possession Date</Label>
                  <Input type="date" value={formPossessionDate} onChange={(e) => setFormPossessionDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amenities (comma-separated)</Label>
                <Input placeholder="Swimming Pool, Gym, Parking, 24/7 Security" value={formAmenities} onChange={(e) => setFormAmenities(e.target.value)} />
              </div>

              <Separator />
              <h4 className="font-medium text-sm">Media</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Flat Video URL</Label>
                  <Input placeholder="https://youtube.com/..." value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Building Video URL</Label>
                  <Input placeholder="https://youtube.com/..." value={formBuildingVideo} onChange={(e) => setFormBuildingVideo(e.target.value)} />
                </div>
              </div>

              <Separator />
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/20">
                <div>
                  <Label className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-accent" /> Premium Listing
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Premium properties appear first and get a gold badge
                  </p>
                </div>
                <Switch checked={formPremium} onCheckedChange={setFormPremium} />
              </div>

              <Button className="w-full sm:w-auto" size="lg" onClick={handleAddProperty}>
                <Plus className="h-4 w-4 mr-2" /> Submit Property
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments */}
        <TabsContent value="appointments">
          {appointments.length === 0 ? (
            <Card className="p-12 text-center mt-4">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No appointments</h3>
              <p className="text-muted-foreground text-sm mt-1">Appointments from buyers will appear here</p>
            </Card>
          ) : (
            <div className="space-y-3 mt-4">
              {appointments.map((apt) => (
                <Card key={apt.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-medium">{apt.propertyName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {apt.type === "videoCall" ? "Video Call" : "Site Visit"} - {apt.buyerName} ({apt.buyerEmail})
                      </p>
                      <p className="text-sm mt-1">{formatDate(apt.date)} at {apt.time}</p>
                    </div>
                    <Badge variant={statusColors[apt.status]} className="capitalize w-fit">
                      {apt.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Inquiries */}
        <TabsContent value="inquiries">
          {appointments.length === 0 ? (
            <Card className="p-12 text-center mt-4">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No inquiries yet</h3>
              <p className="text-muted-foreground text-sm mt-1">Buyer inquiries will appear here</p>
            </Card>
          ) : (
            <div className="space-y-3 mt-4">
              {appointments.map((apt) => (
                <Card key={apt.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{apt.buyerName}</h4>
                      <p className="text-sm text-muted-foreground">{apt.buyerEmail}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Interested in: {apt.propertyName}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(apt.createdAt)}</p>
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
