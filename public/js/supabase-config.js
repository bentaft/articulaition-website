// Supabase configuration
const supabaseUrl = 'https://uxkvrwqnbyonzisvwczl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4a3Zyd3FuYnlvbnppc3Z3Y3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MjE2MjksImV4cCI6MjA2NjE5NzYyOX0.jAcokt69NEmHXbhWuY6QFRDsEJxwhurnevT9gXQ1dA4'

// Initialize Supabase client with error handling
let supabase;

try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized successfully');
    } else {
        console.error('Supabase library not loaded properly');
    }
} catch (error) {
    console.error('Error initializing Supabase client:', error);
}