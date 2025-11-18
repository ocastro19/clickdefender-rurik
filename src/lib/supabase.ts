import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback seguro para desenvolvimento: evita crash quando variáveis estão vazias
// Em dev, cria um cliente com chaves vazias apenas para permitir renderização da UI.
// As chamadas que exigem auth já tratam a ausência de token e mostrarão erros controlados.
export const supabase = createClient(
  (supabaseUrl && supabaseUrl.length > 0) ? supabaseUrl : 'https://dev-placeholder.supabase.co',
  (supabaseAnonKey && supabaseAnonKey.length > 0) ? supabaseAnonKey : 'dev-placeholder-key'
);
