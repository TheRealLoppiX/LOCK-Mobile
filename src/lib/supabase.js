import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grcxqjrodvulxnhtrqhq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyY3hxanJvZHZ1bHhuaHRycWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzgyMjMsImV4cCI6MjA3MjMxNDIyM30.8VGjs7HtQ32ZLvGPV8MZTIiftucZmlW0rw9jlYQzraw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);