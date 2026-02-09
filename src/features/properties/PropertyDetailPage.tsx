import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, BedDouble, Bath, Maximize, Calendar, Phone, Video, Building,
  ArrowLeft, Heart, Share2, Crown, Check,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { fetchPropertyById, clearCurrentProperty } from "@/store/propertySlice";
import { toggleFavorite } from "@/store/authSlice";
import { scheduleAppointment } from "@/store/appointmentSlice";
import { fetchPropertyReviews, addReview } from "@/store/reviewSlice";
import { addNotification } from "@/store/notificationSlice";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const possessionLabels: Record<string, string> = {
  ready: "Ready to Move",
  "6months": "In 6 Months",
  "1year": "In 1 Year",
  "2years": "In 2 Years",
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProperty: property, detailLoading } = useAppSelector((s) => s.properties);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { reviews } = useAppSelector((s) => s.reviews);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [scheduleType, setScheduleType] = useState<"videoCall" | "siteVisit">("videoCall");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const isFavorite = user?.favorites.includes(id ?? "") ?? false;
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
      dispatch(fetchPropertyReviews(id));
    }
    return () => { dispatch(clearCurrentProperty()); };
  }, [id, dispatch]);

  const handleSchedule = () => {
    if (!user || !property) return;
    if (!scheduleDate || !scheduleTime) {
      toast.error("Please select date and time");
      return;
    }
    dispatch(scheduleAppointment({
      propertyId: property.id,
      propertyName: property.name,
      buyerId: user.id,
      buyerName: user.name,
      buyerEmail: user.email,
      sellerId: property.sellerId,
      sellerName: property.sellerName,
      type: scheduleType,
      date: scheduleDate,
      time: scheduleTime,
      notes: scheduleNotes,
    }));
    dispatch(addNotification({
      title: "Appointment Scheduled",
      message: `${scheduleType === "videoCall" ? "Video call" : "Site visit"} for ${property.name} on ${scheduleDate}`,
      type: "appointment",
    }));
    toast.success(`${scheduleType === "videoCall" ? "Video Call" : "Site Visit"} scheduled successfully!`);
    setScheduleOpen(false);
    setScheduleDate("");
    setScheduleTime("");
    setScheduleNotes("");
  };

  const handleReview = () => {
    if (!user || !property) return;
    if (reviewRating === 0 || !reviewComment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }
    dispatch(addReview({
      propertyId: property.id,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewComment,
    }));
    toast.success("Review submitted!");
    setReviewRating(0);
    setReviewComment("");
  };

  if (detailLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="aspect-[16/9] w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold">Property not found</h2>
        <p className="text-muted-foreground mt-2">The property you're looking for doesn't exist.</p>
        <Button asChild className="mt-4"><Link to="/">Back to Home</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      {/* Image Carousel */}
      <div className="mb-8 mt-3">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          className="rounded-xl overflow-hidden aspect-[16/9] sm:aspect-[3/1]"
        >
          {property.images.map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt={`${property.name} - Image ${i + 1}`} className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Thumbnails */}
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          slidesPerView={5}
          spaceBetween={8}
          className="mt-3 hidden sm:block"
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
          }}
        >
          {property.images.map((img, i) => (
            <SwiperSlide key={i} className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity rounded-lg overflow-hidden">
              <img src={img} alt="" className="h-20 w-full object-cover rounded-lg" loading="lazy" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Price */}
          <div>
            <div className="flex flex-wrap items-start gap-3 mb-2">
              {property.isPremium && (
                <Badge variant="gold" className="gap-1"><Crown className="h-3 w-3" /> Premium</Badge>
              )}
              <Badge>{property.config}</Badge>
              <Badge variant="secondary">{possessionLabels[property.possessionPeriod]}</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">{property.name}</h1>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-3xl font-bold text-primary">{formatPrice(property.price)}</p>
              {avgRating > 0 && <StarRating rating={avgRating} showValue />}
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: BedDouble, label: "Bedrooms", value: property.bedrooms },
              { icon: Bath, label: "Bathrooms", value: property.bathrooms },
              { icon: Maximize, label: "Area", value: `${property.area} sq.ft` },
            ].map((spec) => (
              <Card key={spec.label} className="text-center p-4">
                <spec.icon className="h-6 w-6 mx-auto text-primary mb-1" />
                <p className="text-xl font-bold">{spec.value}</p>
                <p className="text-xs text-muted-foreground">{spec.label}</p>
              </Card>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-3">About this property</h2>
            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Possession */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-3">Possession Details</h2>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Possession Date: <strong>{formatDate(property.possessionDate)}</strong></span>
            </div>
          </div>

          {/* Videos */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-3">Property Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Video className="h-4 w-4" /> Sample Flat Tour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center border">
                    <div className="text-center text-muted-foreground">
                      <Video className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Flat Video Tour</p>
                      <p className="text-xs">Click to play</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="h-4 w-4" /> Building & Locality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center border">
                    <div className="text-center text-muted-foreground">
                      <Building className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Building Video Tour</p>
                      <p className="text-xs">Click to play</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Reviews */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">
              Reviews ({reviews.length})
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{review.userName}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
            )}

            {/* Write Review */}
            {isAuthenticated && (
              <Card className="mt-4 p-4">
                <h3 className="font-semibold text-sm mb-3">Write a Review</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Your Rating</Label>
                    <StarRating rating={reviewRating} interactive onRate={setReviewRating} />
                  </div>
                  <Textarea
                    placeholder="Share your experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                  />
                  <Button size="sm" onClick={handleReview}>Submit Review</Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact Card */}
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Contact Seller</CardTitle>
              <p className="text-sm text-muted-foreground">{property.sellerName}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={`tel:${property.sellerPhone}`}
                className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-success text-white font-medium text-sm hover:bg-success/90 transition-colors"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (!isAuthenticated) { toast.error("Please log in to schedule"); navigate("/login"); return; }
                  setScheduleType("videoCall");
                  setScheduleOpen(true);
                }}
              >
                <Video className="h-4 w-4 mr-2" /> Schedule Video Call
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (!isAuthenticated) { toast.error("Please log in to schedule"); navigate("/login"); return; }
                  setScheduleType("siteVisit");
                  setScheduleOpen(true);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" /> Schedule Site Visit
              </Button>

              <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Schedule {scheduleType === "videoCall" ? "Video Call" : "Site Visit"}
                    </DialogTitle>
                    <DialogDescription>
                      Pick a date and time for your {scheduleType === "videoCall" ? "video call" : "site visit"} with the seller.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes (optional)</Label>
                      <Textarea placeholder="Any specific questions or requirements..." value={scheduleNotes} onChange={(e) => setScheduleNotes(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
                    <Button onClick={handleSchedule}>Confirm Booking</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Separator />

              <Button
                variant={isFavorite ? "destructive" : "ghost"}
                className="w-full"
                onClick={() => {
                  if (!isAuthenticated) { toast.error("Please log in to save"); return; }
                  dispatch(toggleFavorite(property.id));
                }}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Remove from Saved" : "Save Property"}
              </Button>

              <Button variant="ghost" className="w-full" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
