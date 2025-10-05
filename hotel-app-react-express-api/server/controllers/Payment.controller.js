/**
 * Payment controller for handling payment-related operations
 */

/**
 * Process payment confirmation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const confirmPayment = async (req, res) => {
  try {
    const {
      cardNumber,
      expiry,
      cvc,
      nameOnCard,
      email,
      address,
      city,
      state,
      postalCode
    } = req.body;

    // Basic validation
    if (!cardNumber || !expiry || !cvc || !nameOnCard) {
      return res.status(400).json({
        success: false,
        errors: ['Missing required payment information']
      });
    }

    // Simulate payment processing (in real app, this would integrate with payment gateway)
    // For demo purposes, we'll simulate different scenarios based on card number

    // Check for test card numbers that should fail
    if (cardNumber.endsWith('0000')) {
      return res.status(402).json({
        success: false,
        errors: ['Payment declined by bank. Please try a different card.']
      });
    }

    // Simulate insufficient funds (card number ending with 1111)
    if (cardNumber.endsWith('1111')) {
      return res.status(402).json({
        success: false,
        errors: ['Insufficient funds. Please try a different payment method.']
      });
    }

    // Simulate expired card (expiry in the past)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1;

    const [expMonth, expYear] = expiry.split('/').map(Number);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return res.status(402).json({
        success: false,
        errors: ['Card has expired. Please use a valid card.']
      });
    }

    // Validate card number format (basic Luhn algorithm simulation)
    if (!isValidCardNumber(cardNumber)) {
      return res.status(400).json({
        success: false,
        errors: ['Invalid card number. Please check and try again.']
      });
    }

    // Validate CVC
    if (!/^\d{3,4}$/.test(cvc)) {
      return res.status(400).json({
        success: false,
        errors: ['Invalid CVC code. Please enter a valid CVC code (3-4 digits).']
      });
    }

    // Simulate successful payment for valid cards
    const paymentData = {
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.floor(Math.random() * 5000) + 1000, // Random amount between 1000-6000
      currency: 'INR',
      status: 'completed',
      cardLast4: cardNumber.slice(-4),
      processedAt: new Date().toISOString(),
      paymentMethod: 'credit_card'
    };

    res.status(200).json({
      success: true,
      data: paymentData,
      errors: []
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      errors: ['Payment processing failed. Please try again.']
    });
  }
};

// Basic Luhn algorithm check for card number validation
// This is a simplified version for demo purposes
function isValidCardNumber(cardNumber) {
  // Remove spaces and convert to array of digits
  const digits = cardNumber.replace(/\s/g, '').split('').map(Number);

  if (digits.length !== 16) return false;

  // Double every second digit from right to left
  for (let i = digits.length - 2; i >= 0; i -= 2) {
    digits[i] *= 2;
    if (digits[i] > 9) digits[i] -= 9;
  }

  // Sum all digits
  const sum = digits.reduce((acc, digit) => acc + digit, 0);

  // Valid if sum is divisible by 10
  return sum % 10 === 0;
}
