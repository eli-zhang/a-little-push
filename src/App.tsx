import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { ContentContainer, CheckoutContainer, BodyTextContainer, 
  BodyText, GoalInput, PromptContainer, WagerContainer, WagerPill, ProceedButton } from './components/StyledForm'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test public API key.
const stripePromise = loadStripe("pk_test_51LoGViKv008lOcIWwZ9EwabpQbjh8gfLoncVeufR7fVtxYhFjTerQ3ZjY0kstPTri0hjiVJ7ncjx2w3uhRayZDPg00pPKf9lzT");

const CheckoutForm = () => {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState(5);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const fetchClientSecret = useCallback(() => {
    return fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount })
    })
    .then((res) => res.json())
    .then((data) => data.clientSecret);
  }, [amount]);

  const options = {fetchClientSecret};

  const handleAccept = () => {
    if (amount && goal) {
      setShowCheckout(true);
    }
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setShowFullContent(true);
    }
  };

  const amounts = [5, 10, 25, 100, 500];
  
  if (showCheckout) {
    return (
      <ContentContainer>
        <CheckoutContainer>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={options}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </CheckoutContainer>
      </ContentContainer>
      
    );
  }

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <BodyTextContainer showFullContent={showFullContent}>
        <PromptContainer>
          <BodyText>
            Let's start with a goal:
          </BodyText>
          <GoalInput
            type="text"
            placeholder="Enter your goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </PromptContainer>
        {showFullContent && (
          <>
            <WagerContainer>
              <BodyText>
                And how much are you willing to wager?
              </BodyText>
              <div>
                {amounts.map((amountValue) => (
                  <WagerPill 
                  key={amountValue} 
                  onClick={() => handleAmountSelect(amountValue)} 
                  isActive={amount === amountValue}>
                    ${amountValue}
                  </WagerPill>
                ))}
              </div>
            </WagerContainer>
            
            <ProceedButton onClick={handleAccept}>Proceed</ProceedButton>
          </>
        )}
      </BodyTextContainer>
      
    </div>
  );
}

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    )
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.

          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }

  return null;
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="" element={<CheckoutForm />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/return" element={<Return />} />
      </Routes>
    </Router>
  )
}

export default App;