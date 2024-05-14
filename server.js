// This is your test secret API key.
const stripe = require('stripe')('sk_test_51LoGViKv008lOcIW4XZiHnwZolOGAAPa83KIPWMFOU6co5SuVFkkxfbda4XBpFfDA3tPS8nS4pcn4vvx4g0RB2wA00VT66YQyY');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1PFXazKv008lOcIWMr9C6nWd',
        quantity: 1,
      },
    ],
    mode: 'payment',
    payment_method_types: ['us_bank_account', 'card'],
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: {enabled: false},
  });

  res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log('Running on port 4242'));