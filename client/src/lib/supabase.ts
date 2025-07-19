import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadEventImage(file: File, eventId: number): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${eventId}-${Date.now()}.${fileExt}`;
  const filePath = `event-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from('event-images')
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('event-images')
    .getPublicUrl(filePath);

  return publicUrl;
}
