import { createNewOrder } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract initial data from request body
    const { bundle_id, bundle_name, selected_tiers, selected_services, sub_length, final_monthly } = req.body;

    // Create new order in Supabase
    const order = await createNewOrder({
      bundle_id,
      bundle_name,
      selected_tiers,
      selected_services,
      sub_length,
      final_monthly
    });

    res.status(200).json({ 
      success: true, 
      orderId: order.id,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
}
