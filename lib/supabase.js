
// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service key for server-side operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Status enum for consistency
export const ORDER_STATUS = {
  FORM_STARTED: 'form_started',
  FORM_FILLED: 'form_filled',
  DISCLAIMER_ACCEPTED: 'disclaimer_accepted',
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid'
};

// Create a new order entry when user starts the workflow
export async function createNewOrder(initialData = {}) {
  try {
    const { data, error } = await supabase
      .from('pending_orders') // Your table name from the image
      .insert([
        {
          status: ORDER_STATUS.FORM_STARTED,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...initialData
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    console.log('New order created:', data.id);
    return data;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(orderId, status, additionalData = {}) {
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...additionalData
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    console.log(`Order ${orderId} updated to status: ${status}`);
    return data;
  } catch (error) {
    console.error('Failed to update order:', error);
    throw error;
  }
}

// Update order with form data
export async function updateOrderFormData(orderId, formData) {
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .update({
        ...formData,
        status: ORDER_STATUS.FORM_FILLED,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order form data:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update order form data:', error);
    throw error;
  }
}

// Get order by ID
export async function getOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    throw error;
  }
}

// Update order with Stripe session ID
export async function updateOrderWithStripeSession(orderId, stripeSessionId) {
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .update({
        stripe_session_id: stripeSessionId,
        status: ORDER_STATUS.PENDING_PAYMENT,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order with Stripe session:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update order with Stripe session:', error);
    throw error;
  }
}

// Mark order as paid
export async function markOrderAsPaid(orderId) {
  try {
    const { data, error } = await supabase
      .from('pending_orders')
      .update({
        status: ORDER_STATUS.PAID,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error marking order as paid:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to mark order as paid:', error);
    throw error;
  }
}
