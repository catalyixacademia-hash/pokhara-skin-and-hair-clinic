import type { ServiceItem } from '../data/services';
import { skinServices, hairServices, aestheticServices } from '../data/services';

export type DbService = ServiceItem & {
  id: string;
  category_id: string;
  sort_order: number;
  is_published: boolean;
};

export type DbTestimonial = {
  id: string;
  name: string;
  location: string | null;
  treatment: string;
  rating: number;
  quote: string;
  initial: string | null;
  sort_order: number;
  is_published: boolean;
};

export type DbResult = {
  id: string;
  label: string;
  before_url: string;
  after_url: string;
  duration: string | null;
  category: 'skin' | 'hair';
  sort_order: number;
  is_published: boolean;
};

export type DbGalleryItem = {
  id: string;
  image_url: string;
  label: string;
  tag: string | null;
  is_tall: boolean;
  sort_order: number;
  is_published: boolean;
};

export type DbHeroSlide = {
  id: string;
  image_url: string;
  alt: string | null;
  sort_order: number;
  is_published: boolean;
};

export type DbAppointment = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  treatment: string;
  preferred_date: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
};

export const fallbackServices = {
  skin: skinServices,
  hair: hairServices,
  aesthetic: aestheticServices,
};
