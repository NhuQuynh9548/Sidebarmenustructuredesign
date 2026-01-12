import { supabase } from './lib/supabase';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');

  try {
    const { data, error } = await supabase
      .from('business_units')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connection successful!');
    console.log(`📊 Found ${data.length} business units`);
    console.log('Data:', JSON.stringify(data, null, 2));

    return true;
  } catch (error: any) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

testSupabaseConnection();
