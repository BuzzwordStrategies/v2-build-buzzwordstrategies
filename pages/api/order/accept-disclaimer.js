import { updateOrderStatus, ORDER_STATUS } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, agreement_accepted, agreement_signature, agreement_date } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Update order with disclaimer acceptance
    const order = await updateOrderStatus(orderId, ORDER_STATUS.DISCLAIMER_ACCEPTED, {
      agreement_accepted,
      agreement_signature,
      agreement_date
    });

    res.status(200).json({ 
      success: true, 
      order,
      message: 'Disclaimer accepted successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to accept disclaimer',
      message: error.message 
    });
  }
}
