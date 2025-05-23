const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ORDER_STATUS = {
  FORM_STARTED: 'form_started',
  FORM_FILLED: 'form_filled',
  DISCLAIMER_ACCEPTED: 'disclaimer_accepted',
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid'
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    const { action, orderId, ...payload } = data;

    console.log('Save order request:', { action, orderId, payload });

    switch (action) {
      case 'create':
        // Create new order
        const { data: newOrder, error: createError } = await supabase
          .from('pending_orders')
          .insert([{
            bundle_id: payload.bundle_id,
            bundle_name: payload.bundle_name,
            selected_tiers: JSON.stringify(payload.selected_tiers || {}),
            selected_services: payload.selected_services,
            sub_length: payload.sub_length,
            final_monthly: payload.final_monthly,
            status: ORDER_STATUS.FORM_STARTED,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) {
          console.error('Supabase create error:', createError);
          throw createError;
        }

        console.log('Created order:', newOrder);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, orderId: newOrder.id })
        };

      case 'update-form':
        // Update with customer info
        const { data: updatedForm, error: updateFormError } = await supabase
          .from('pending_orders')
          .update({
            customer_name: payload.customer_name,
            customer_email: payload.customer_email,
            customer_phone: payload.customer_phone,
            customer_company: payload.customer_company,
            customer_website: payload.customer_website,
            customer_address: payload.customer_address,
            customer_city: payload.customer_city,
            customer_state: payload.customer_state,
            customer_zip: payload.customer_zip,
            marketing_consent: payload.marketing_consent,
            status: ORDER_STATUS.FORM_FILLED,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)
          .select()
          .single();

        if (updateFormError) {
          console.error('Supabase update form error:', updateFormError);
          throw updateFormError;
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, order: updatedForm })
        };

      case 'accept-disclaimer':
        // Update with agreement info
        const { data: updatedAgreement, error: agreementError } = await supabase
          .from('pending_orders')
          .update({
            agreement_accepted: payload.agreement_accepted,
            agreement_signature: payload.agreement_signature,
            agreement_date: payload.agreement_date,
            status: ORDER_STATUS.DISCLAIMER_ACCEPTED,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)
          .select()
          .single();

        if (agreementError) {
          console.error('Supabase agreement error:', agreementError);
          throw agreementError;
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, order: updatedAgreement })
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        message: error.message,
        details: error
      })
    };
  }
};
