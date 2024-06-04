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
import OverviewPage from './pages/OverviewPage'
import { ContentContainer, CheckoutContainer, BodyTextContainer, 
  FirstInstructionText, BodyText, GoalInput, PromptContainer, WagerContainer, WagerPill, 
  ProceedButton, Spinner, RemainingContentContainer, ContactInputContainer, ContactInput, ContactOption 
} from './components/StyledForm'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test public API key.
const stripePromise = loadStripe("pk_test_51LoGViKv008lOcIWwZ9EwabpQbjh8gfLoncVeufR7fVtxYhFjTerQ3ZjY0kstPTri0hjiVJ7ncjx2w3uhRayZDPg00pPKf9lzT");
const BACKEND_URL = "https://hqw51l1t2i.execute-api.us-east-1.amazonaws.com"

const CheckoutForm = () => {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState(5);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState('email');
  const [options, setOptions] = useState<{ clientSecret: string | null}>({ clientSecret: null}); 
  const [isLoading, setIsLoading] = useState(false); 

  const fetchClientSecret = useCallback((accountId: string, commitmentId: string) => {
    return fetch(`${BACKEND_URL}/create-checkout-session`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, account_id: accountId, commitment_id: commitmentId })
    })
    .then((res) => {
      setShowCheckout(true);
      return res.json()
    })
    .then((data) => data.clientSecret);
  }, [amount]);

  const handleProceed = () => {
    if (amount && goal) {
      setShowContact(true);
    }
  };

  const createAccount = async (payload: { phone_number: string } | { email: string }) => {
    return fetch(`${BACKEND_URL}/create-account`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
  }

  const createCommitment = async (payload: { account_id: string, description: string, amount: number }) => {
    return fetch(`${BACKEND_URL}/create-commitment`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
  }

  const handleFinish = () => {
    if (contact && contactType) {
      setIsLoading(true);
      const payload = contactType === 'phone' ? { phone_number: contact } : { email: contact };
      
      let accountId: string;

      createAccount(payload).then(response => response.json())
      .then(data => {
        accountId = data.account_id;
        localStorage.setItem('account_id', accountId);
        return createCommitment({ account_id: accountId, description: goal, amount: amount})
    }).then(response => response.json())
      .then(data => {
        fetchClientSecret(accountId, data.commitment_id).then(clientSecret => {
          setOptions({ clientSecret }); // Set options after fetching clientSecret
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
    }
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (!showFullContent) {
        setShowFullContent(true);
      } else if (!showContact) {
        handleProceed()
      } else {
        handleFinish()
      }
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
          <FirstInstructionText shouldDisplay={!showFullContent}>
            Let's start with a goal:
          </FirstInstructionText>
          <GoalInput
            type="text"
            placeholder="Enter your goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </PromptContainer>
        <RemainingContentContainer shouldDisplay={showFullContent && !showContact}>
          <WagerContainer>
            <BodyText shouldDisplay={true}>
              And how much can you commit to it?
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
          <ProceedButton onClick={handleProceed}>Continue</ProceedButton>
        </RemainingContentContainer>
        <RemainingContentContainer shouldDisplay={showContact}>
          <ContactInputContainer>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BodyText shouldDisplay={true}>
                How can we remember you?
              </BodyText>
              <div style={{ marginLeft: 20, marginBottom: 5 }}>
                <ContactOption 
                  onClick={() => setContactType('email')} 
                  isActive={contactType === 'email'}>
                  email
                </ContactOption>
                <ContactOption 
                  onClick={() => setContactType('phone')} 
                  isActive={contactType === 'phone'}>
                  phone
                </ContactOption>
              </div>
            </div>
            <ContactInput
              type={contactType === 'email' ? 'email' : 'tel'}
              placeholder={contactType === 'email' ? 'great_success@gmail.com' : '123-456-7890'}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            
          </ContactInputContainer>
          <ProceedButton onClick={handleFinish}>
            {isLoading ? <Spinner/> : 'Confirm'}
          </ProceedButton>
        </RemainingContentContainer>
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

    fetch(`${BACKEND_URL}/session-status?session_id=${sessionId}`)
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
        <Route path="/start" element={<CheckoutForm />} />
        <Route path="/return" element={<Return />} />
        <Route path="/home" element={<OverviewPage />} />
      </Routes>
    </Router>
  )
}

export default App;