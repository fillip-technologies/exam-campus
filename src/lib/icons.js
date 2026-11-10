import {
  ArrowRight, Atom, Award, BarChart3, Bell, BookBookmark, BookMarked, BookOpen, Bookmark, Brain, Briefcase, Building2,
  Calculator, CalendarCheck, CalendarClock, CalendarDays, CheckCircle2, CircleHelp, ClipboardCheck, ClipboardList, Clock,
  Download, FileCheck2, FileText, FlaskConical, Flame, Gift, Globe, GraduationCap, HeartPulse, History, Home, Landmark,
  Languages, LayoutGrid, LayoutList, Library, Lightbulb, ListChecks, Mail, MapPinned, Medal, MessageCircle,
  MonitorCheck, Newspaper, NotebookText, Package, PencilRuler, Phone, PlayCircle, Rocket, RotateCcwClock, Scale, School,
  ScrollText, Shield, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Star, Target, Timer, TrainFront, TrendingUp, Trophy,
  Users, Video, Zap,
} from 'lucide-react'

/**
 * Icons the CMS can use. The API stores a lucide component name (`iconKey: "Landmark"`) and the site maps it here.
 * Keeping a fixed list means the public bundle only ships these icons; the admin icon picker offers the same list.
 * To make a new icon available: import it above and add it to this object.
 */
export const iconRegistry = {
  ArrowRight, Atom, Award, BarChart3, Bell, BookBookmark, BookMarked, BookOpen, Bookmark, Brain, Briefcase, Building2,
  Calculator, CalendarCheck, CalendarClock, CalendarDays, CheckCircle2, CircleHelp, ClipboardCheck, ClipboardList, Clock,
  Download, FileCheck2, FileText, FlaskConical, Flame, Gift, Globe, GraduationCap, HeartPulse, History, Home, Landmark,
  Languages, LayoutGrid, LayoutList, Library, Lightbulb, ListChecks, Mail, MapPinned, Medal, MessageCircle,
  MonitorCheck, Newspaper, NotebookText, Package, PencilRuler, Phone, PlayCircle, Rocket, RotateCcwClock, Scale, School,
  ScrollText, Shield, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Star, Target, Timer, TrainFront, TrendingUp, Trophy,
  Users, Video, Zap,
}

export const iconNames = Object.keys(iconRegistry).sort()

/** Component for an icon name, or `fallback` (null) for an unknown / empty name. */
export const iconFor = (name, fallback = null) => (name && iconRegistry[name]) || fallback
