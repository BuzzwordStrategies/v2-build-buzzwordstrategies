import { updateOrderFormData, updateOrderStatus, ORDER_STATUS } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, ...formData } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Update order with form data
    const order = await updateOrderFormData(orderId, formData);

    res.status(200).json({ 
      success: true, 
      order,
      message: 'Form data updated successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to update form data',
      message: error.message 
    });
  }
}
