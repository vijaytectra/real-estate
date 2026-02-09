import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating houses */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/[0.04] dark:text-primary/[0.06]"
            style={{
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, i % 2 === 0 ? 5 : -5, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <Building2 className="h-16 w-16 sm:h-24 sm:w-24" />
          </motion.div>
        ))}

        {/* Gradient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Animated 404 number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-2"
        >
          <span className="font-display text-[8rem] sm:text-[10rem] font-bold leading-none tracking-tighter bg-gradient-to-br from-primary via-primary/80 to-accent bg-clip-text text-transparent select-none">
            404
          </span>
          {/* Pulsing glow behind the number */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -z-10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Property Not Found
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-2 max-w-md">
            Looks like this address doesn't exist in our listings. The page you're looking for may have been moved, deleted, or never existed.
          </p>
          <p className="text-xs text-muted-foreground/70 mb-8">
            Redirecting to home in{" "}
            <span className="font-semibold text-primary">{countdown}s</span>
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Button asChild size="lg" className="w-full sm:w-auto gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
            <Link to="/?view=all">
              <Search className="h-4 w-4" />
              Browse Properties
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 flex items-center gap-3 text-muted-foreground/50"
        >
          <div className="h-px w-12 bg-border" />
          <Building2 className="h-4 w-4" />
          <span className="text-xs font-medium tracking-wider uppercase">PropVista</span>
          <Building2 className="h-4 w-4" />
          <div className="h-px w-12 bg-border" />
        </motion.div>
      </div>
    </div>
  );
}
