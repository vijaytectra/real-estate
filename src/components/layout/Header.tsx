import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
  GitCompareArrows,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/context/ThemeContext";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/authSlice";
import { markAsRead, markAllAsRead } from "@/store/notificationSlice";
import { getInitials, formatDate } from "@/lib/utils";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { notifications } = useAppSelector((s) => s.notifications);
  const { compareIds } = useAppSelector((s) => s.compare);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "buyer":
        return "/buyer/dashboard";
      case "seller":
        return "/seller/dashboard";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Properties", to: "/?view=all" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b glass" role="banner">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" aria-label="PropVista Home">
          <Building2 className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-primary">
            Prop<span className="text-accent">Vista</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to={getDashboardLink()}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Compare */}
          {compareIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/compare")}
              className="hidden sm:flex"
              aria-label={`Compare ${compareIds.length} properties`}
            >
              <GitCompareArrows className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Compare</span>
              <Badge variant="gold" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {compareIds.length}
              </Badge>
            </Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Notifications — only shown when logged in */}
          {isAuthenticated && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b p-3">
                  <h4 className="text-sm font-semibold">Notifications</h4>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-auto py-1"
                      onClick={() => dispatch(markAllAsRead())}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-72">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">
                      No notifications yet
                    </p>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => dispatch(markAsRead(notif.id))}
                          className={`w-full text-left p-3 hover:bg-muted transition-colors ${
                            !notif.read ? "bg-primary/5" : ""
                          }`}
                        >
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {formatDate(notif.createdAt)}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}

          {/* Auth */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign up
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-background p-4 space-y-2" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to={getDashboardLink()}
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {compareIds.length > 0 && (
            <Link
              to="/compare"
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Compare ({compareIds.length})
            </Link>
          )}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                Log in
              </Button>
              <Button className="flex-1" onClick={() => { navigate("/register"); setMobileOpen(false); }}>
                Sign up
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
