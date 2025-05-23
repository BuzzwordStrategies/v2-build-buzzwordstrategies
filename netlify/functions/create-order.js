// netlify/functions/create-order.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    
    const { data: order, error } = await supabase
      .from('pending_orders')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: order })
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};
