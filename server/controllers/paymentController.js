const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const Formula = require('../models/Formula');
const Pack = require('../models/Pack');

/**
 * Create a Stripe checkout session for purchasing a formula/pack.
 * POST /api/payments/checkout
 */
const createCheckout = async (req, res, next) => {
  try {
    const { itemId, itemType = 'formula' } = req.body;

    // Fetch the item
    let item;
    if (itemType === 'pack') {
      item = await Pack.findById(itemId).populate('userId', 'name stripeAccountId');
    } else {
      item = await Formula.findById(itemId).populate('userId', 'name stripeAccountId');
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'This item is free. Use the download endpoint instead.',
      });
    }

    // Don't let users buy their own formulas
    if (item.userId._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You can't purchase your own formula",
      });
    }

    // Calculate platform cut (20%)
    const platformFeePercent = parseInt(process.env.STRIPE_PLATFORM_FEE_PERCENT) || 20;
    const amountInCents = Math.round(item.price * 100);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description || `FormulaOS ${itemType}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        itemId: itemId,
        itemType: itemType,
        buyerId: req.user._id.toString(),
        sellerId: item.userId._id.toString(),
        platformFeePercent: platformFeePercent.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/marketplace/${itemId}?purchased=true`,
      cancel_url: `${process.env.CLIENT_URL}/marketplace/${itemId}`,
    });

    res.json({
      success: true,
      data: { sessionId: session.id, url: session.url },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Stripe webhooks — process completed payments.
 * POST /api/payments/webhook
 * Note: This route uses raw body parsing (configured in server.js)
 */
const handleWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).json({ message: 'Webhook signature verification failed' });
    }

    // Handle checkout completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { itemId, itemType, buyerId, sellerId, platformFeePercent } = session.metadata;

      const amount = session.amount_total / 100;
      const platformCut = amount * (parseInt(platformFeePercent) / 100);
      const sellerPayout = amount - platformCut;

      // Record transaction
      await Transaction.create({
        buyerId,
        sellerId,
        [itemType === 'pack' ? 'packId' : 'formulaId']: itemId,
        amount,
        platformCut,
        sellerPayout,
        stripePaymentId: session.payment_intent,
        status: 'completed',
      });

      // Increment download count
      const Model = itemType === 'pack' ? Pack : Formula;
      await Model.findByIdAndUpdate(itemId, { $inc: { downloadCount: 1 } });

      // Copy formula to buyer's library (for single formulas)
      if (itemType === 'formula') {
        const original = await Formula.findById(itemId);
        if (original) {
          await Formula.create({
            userId: buyerId,
            name: original.name,
            description: original.description,
            tags: original.tags,
            syntax: original.syntax,
            parameters: original.parameters,
            isPublic: false,
            category: original.category,
          });
        }
      }

      console.log(`✅ Payment completed: ${session.payment_intent}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCheckout, handleWebhook };
