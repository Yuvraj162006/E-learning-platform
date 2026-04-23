export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const displayRazorpay = async (orderData, onSuccess, onFailure) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'CA E-Learning',
    description: 'Course Enrollment Payment',
    order_id: orderData.orderId,
    handler: function (response) {
      onSuccess({
        razorpayOrderId: orderData.orderId,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        paymentId: orderData.paymentId
      });
    },
    prefill: {
      name: orderData.userName,
      email: orderData.userEmail,
      contact: orderData.userPhone
    },
    theme: {
      color: '#4F46E5'
    },
    modal: {
      ondismiss: function() {
        onFailure('Payment cancelled by user');
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
