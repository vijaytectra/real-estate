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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">Manage your property listings and appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Total Listings", value: sellerProperties.length, icon: Building, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
          { label: "Approved", value: sellerProperties.filter((p) => p.status === "approved").length, icon: Building, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
          { label: "Appointments", value: appointments.length, icon: Calendar, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
          { label: "Inquiries", value: appointments.length, icon: Users, color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
              <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0 ${stat.color}`}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold leading-tight">{stat.value}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="properties">
        {/* Horizontally scrollable tabs on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 sm:w-auto">
            <TabsTrigger value="properties" className="text-xs sm:text-sm gap-1 sm:gap-1.5">
              <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">My Listings</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="text-xs sm:text-sm gap-1 sm:gap-1.5">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Add Property</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs sm:text-sm gap-1 sm:gap-1.5">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="text-xs sm:text-sm gap-1 sm:gap-1.5">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Inquiries</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* My Properties */}
        <TabsContent value="properties">
          {sellerProperties.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center mt-4">
              <Building className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No properties listed</h3>
              <p className="text-muted-foreground text-sm mt-1">Add your first property to get started</p>
            </Card>
          ) : (
            <div className="space-y-3 mt-4">
              {sellerProperties.map((prop) => (
                <Card key={prop.id} className="p-3 sm:p-4">
                  <div className="flex gap-3 sm:gap-4">
                    <img
                      src={prop.images[0]}
                      alt={prop.name}
                      className="h-20 w-20 sm:h-24 sm:w-36 rounded-lg object-cover shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm sm:text-base truncate flex items-center gap-1.5">
                          {prop.name}
                          {prop.isPremium && <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent shrink-0" />}
                        </h4>
                        <Badge variant={statusColors[prop.status]} className="capitalize shrink-0 text-[10px] sm:text-xs">
                          {prop.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{prop.location.city} - {prop.config}</p>
                      <p className="text-sm sm:text-lg font-bold text-primary mt-1">{formatPrice(prop.price)}</p>
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
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Add New Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="propName" className="text-xs sm:text-sm">Property Name <span className="text-red-500">*</span></Label>
                  <Input id="propName" placeholder="e.g., Skyline Heights" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="propPrice" className="text-xs sm:text-sm">Price (INR) <span className="text-red-500">*</span></Label>
                  <Input id="propPrice" type="number" placeholder="e.g., 5000000" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Description <span className="text-red-500">*</span></Label>
                <Textarea placeholder="Describe your property..." value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} />
              </div>

              <Separator />
              <h4 className="font-medium text-xs sm:text-sm">Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">City <span className="text-red-500">*</span></Label>
                  <Input placeholder="Mumbai" value={formCity} onChange={(e) => setFormCity(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Locality <span className="text-red-500">*</span></Label>
                  <Input placeholder="Bandra West" value={formLocality} onChange={(e) => setFormLocality(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">State <span className="text-red-500">*</span></Label>
                  <Input placeholder="Maharashtra" value={formState} onChange={(e) => setFormState(e.target.value)} />
                </div>
              </div>

              <Separator />
              <h4 className="font-medium text-xs sm:text-sm">Property Details</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Configuration <span className="text-red-500">*</span></Label>
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
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Bedrooms <span className="text-red-500">*</span></Label>
                  <Input type="number" placeholder="2" value={formBedrooms} onChange={(e) => setFormBedrooms(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Bathrooms <span className="text-red-500">*</span></Label>
                  <Input type="number" placeholder="2" value={formBathrooms} onChange={(e) => setFormBathrooms(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Area (sq.ft) <span className="text-red-500">*</span></Label>
                  <Input type="number" placeholder="1200" value={formArea} onChange={(e) => setFormArea(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Possession Period</Label>
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
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Possession Date</Label>
                  <Input type="date" value={formPossessionDate} onChange={(e) => setFormPossessionDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Amenities (comma-separated)</Label>
                <Input placeholder="Swimming Pool, Gym, Parking, 24/7 Security" value={formAmenities} onChange={(e) => setFormAmenities(e.target.value)} />
              </div>

              <Separator />
              <h4 className="font-medium text-xs sm:text-sm">Media</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Flat Video URL</Label>
                  <Input placeholder="https://youtube.com/..." value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Building Video URL</Label>
                  <Input placeholder="https://youtube.com/..." value={formBuildingVideo} onChange={(e) => setFormBuildingVideo(e.target.value)} />
                </div>
              </div>

              <Separator />
              <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-accent/5 border border-accent/20">
                <div className="min-w-0">
                  <Label className="flex items-center gap-2 text-xs sm:text-sm">
                    <Crown className="h-4 w-4 text-accent shrink-0" /> Premium Listing
                  </Label>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                    Premium properties appear first with a gold badge
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
            <Card className="p-8 sm:p-12 text-center mt-4">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No appointments</h3>
              <p className="text-muted-foreground text-sm mt-1">Appointments from buyers will appear here</p>
            </Card>
          ) : (
            <div className="space-y-3 mt-4">
              {appointments.map((apt) => (
                <Card key={apt.id} className="p-3 sm:p-4">
                  <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm sm:text-base truncate">{apt.propertyName}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {apt.type === "videoCall" ? "Video Call" : "Site Visit"} — {apt.buyerName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(apt.date)} at {apt.time}
                      </p>
                    </div>
                    <Badge variant={statusColors[apt.status]} className="capitalize w-fit text-[10px] sm:text-xs">
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
            <Card className="p-8 sm:p-12 text-center mt-4">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-semibold">No inquiries yet</h3>
              <p className="text-muted-foreground text-sm mt-1">Buyer inquiries will appear here</p>
            </Card>
          ) : (
            <div className="space-y-3 mt-4">
              {appointments.map((apt) => (
                <Card key={apt.id} className="p-3 sm:p-4">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm sm:text-base truncate">{apt.buyerName}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground shrink-0">{formatDate(apt.createdAt)}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{apt.buyerEmail}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground/80">
                      Interested in: <span className="text-foreground font-medium">{apt.propertyName}</span>
                    </p>
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
