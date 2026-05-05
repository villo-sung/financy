import {
  BriefcaseBusiness,
  Car,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ShoppingBasket,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  Receipt,
} from "lucide-react"

export const icons = {
  "briefcase-business": BriefcaseBusiness,
  "car": Car,
  "heart-pulse": HeartPulse,
  "piggy-bank": PiggyBank,
  "shopping-cart": ShoppingCart,
  "ticket": Ticket,
  "shopping-basket": ShoppingBasket,
  "utensils": Utensils,
  "paw-print": PawPrint,
  "home": Home,
  "gift": Gift,
  "dumbbell": Dumbbell,
  "book-open": BookOpen,
  "baggage-claim": BaggageClaim,
  "mailbox": Mailbox,
  "receipt": Receipt,
} as const;

export type IconName = keyof typeof icons;
