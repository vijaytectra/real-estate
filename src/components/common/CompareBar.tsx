import { useNavigate } from "react-router-dom";
import { X, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { removeFromCompare, clearCompare } from "@/store/compareSlice";
import { mockProperties } from "@/data/mockProperties";
import { AnimatePresence, motion } from "framer-motion";

export function CompareBar() {
  const { compareIds } = useAppSelector((s) => s.compare);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (compareIds.length === 0) return null;

  const properties = mockProperties.filter((p) => compareIds.includes(p.id));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md shadow-2xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <GitCompareArrows className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Compare ({compareIds.length}/3)
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 shrink-0"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.name}
                  className="h-8 w-8 rounded object-cover"
                  loading="lazy"
                />
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {prop.name}
                </span>
                <button
                  onClick={() => dispatch(removeFromCompare(prop.id))}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${prop.name} from compare`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => dispatch(clearCompare())}>
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/compare")}
              disabled={compareIds.length < 2}
            >
              Compare Now
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
