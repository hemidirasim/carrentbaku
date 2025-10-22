import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ep-square-paper-a4l1reo7-pooler.us-east-1.aws.neon.tech';
const supabaseKey = 'npg_iXWbsguID14k';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Admin authentication
export const adminAuth = {
  async login(email: string, password: string) {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async logout() {
    const { error } = await supabaseAdmin.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabaseAdmin.auth.getUser();
    return user;
  }
};

// Database operations
export const adminDb = {
  // Cars
  async getCars() {
    const { data, error } = await supabaseAdmin
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createCar(car: any) {
    const { data, error } = await supabaseAdmin
      .from('cars')
      .insert([car])
      .select()
      .single();
    return { data, error };
  },

  async updateCar(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('cars')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteCar(id: string) {
    const { error } = await supabaseAdmin
      .from('cars')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Reservations
  async getReservations() {
    const { data, error } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateReservation(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('reservations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteReservation(id: string) {
    const { error } = await supabaseAdmin
      .from('reservations')
      .delete()
      .eq('id', id);
    return { error };
  }
};
