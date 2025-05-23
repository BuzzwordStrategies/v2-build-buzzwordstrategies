import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    sessionStorage.removeItem('currentOrderId');
  }, []);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Your order has been completed.</p>
      <p>Order ID: {orderId}</p>
    </div>
  );
}
