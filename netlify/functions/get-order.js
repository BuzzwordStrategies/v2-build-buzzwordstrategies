const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const { orderId } = event.queryStringParameters || {};
  
  if (!orderId) {
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: 'Order ID required' }) 
    };
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data, error } = await supabase
      .from('pending_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, order: data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
