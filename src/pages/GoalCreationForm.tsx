import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import { useNavigate } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { ContentContainer, CheckoutContainer, BodyTextContainer, DatePickerContainer, HomeButton,
  FirstInstructionText, BodyText, GoalInput, PromptContainer, WagerContainer, WagerPill, OrText, DatePickerWrapperStyles,
  ProceedButton, Spinner, RemainingContentContainer, ContactInputContainer, ContactInput, ContactOption, NumberDateInput, DurationSelect
} from '../style/StyledForm'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getConfig } from '../constants';
const { BACKEND_URL, PUBLIC_API_KEY } = getConfig();

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test public API key.
const stripePromise = loadStripe(PUBLIC_API_KEY);

enum Stage {
  START,
  SET_AMOUNT,
  CONTACT,
  CHECKOUT
}

export const GoalCreationForm = () => {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState(5);
  const [durationValue, setDurationValue] = useState<number | null>(null);
  const [durationUnit, setDurationUnit] = useState('days');
  const [contact, setContact] = useState('');
  const [specificDate, setSpecificDate] = useState<Date | null>(null);
  const [contactType, setContactType] = useState('email');
  const [options, setOptions] = useState<{ clientSecret: string | null}>({ clientSecret: null}); 
  const [isLoading, setIsLoading] = useState(false); 
  const [accountId, setAccountId] = useState('');
  const [commitmentFinalized, setCommitmentFinalized] = useState(false);
  const [stage, setStage] = useState<Stage>(Stage.START);

  const navigate = useNavigate();

  const fetchClientSecret = useCallback((accountId: string, commitmentId: string) => {
    return fetch(`${BACKEND_URL}/create-checkout-session`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, account_id: accountId, commitment_id: commitmentId })
    })
    .then((res) => {
      setStage(Stage.CHECKOUT)
      return res.json()
    })
    .then((data) => data.clientSecret);
  }, [amount]);

  useEffect(() => {
    const accountId = localStorage.getItem('account_id');
    if (accountId) {
      setAccountId(accountId);
    }
  }, []);


  useEffect(() => {
    if (accountId) {
      localStorage.setItem('account_id', accountId);
    }
  }, [accountId]);

  useEffect(() => {
    if (commitmentFinalized) {
      createCommitmentThenRedirect()
    }
  }, [commitmentFinalized]);

  const navigateHome = () => {
    navigate('/home');
  };

  const handleProceed = () => {
    if (amount && goal && (durationValue || specificDate)) {
      if (!accountId) {
        setStage(Stage.CONTACT)
      } else {
        setIsLoading(true)
        setCommitmentFinalized(true)
      }
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

  const createCommitment = async (payload: { account_id: string, description: string, amount: number, deadline: number }) => {
    return fetch(`${BACKEND_URL}/create-commitment`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
  }

  const createCommitmentThenRedirect = () => {
    if (!(durationValue || specificDate)) {
      return;
    }
    setIsLoading(true);

    let deadline: number = -1;
    if (specificDate) {
      deadline = specificDate.getTime();
    } else if (durationValue && durationUnit) {
      const now = new Date();
      switch (durationUnit) {
        case 'minutes':
          deadline = now.getTime() + durationValue * 60 * 1000;
          break;
        case 'hours':
          deadline = now.getTime() + durationValue * 60 * 60 * 1000;
          break;
        case 'days':
          deadline = now.getTime() + durationValue * 24 * 60 * 60 * 1000;
          break;
        case 'weeks':
          deadline = now.getTime() + durationValue * 7 * 24 * 60 * 60 * 1000;
          break;
        case 'months':
          deadline = new Date(now.setMonth(now.getMonth() + durationValue)).getTime();
          break;
        default:
          break;
      }
    }

    createCommitment({ account_id: accountId, description: goal, amount: amount, deadline: deadline}).then(response => response.json())
      .then(data => {
        fetchClientSecret(accountId, data.commitment_id).then(clientSecret => {
          setOptions({ clientSecret });
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }

  const handleFinish = () => {
    if (contact && contactType) {
      setIsLoading(true);
      const payload = contactType === 'phone' ? { phone_number: contact } : { email: contact };

      createAccount(payload)
      .then(response => response.json())
      .then(data => {
        setAccountId(data.account_id);
        setCommitmentFinalized(true)
      })
    }
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (stage === Stage.START) {
        setStage(Stage.SET_AMOUNT)
      } else if (stage === Stage.SET_AMOUNT) {
        handleProceed()
      } else {
        handleFinish()
      }
    }
  };

  const amounts = [5, 10, 25, 100, 500];
  const durationUnits = ['minutes', 'hours', 'days', 'weeks', 'months'];
  
  if (stage === Stage.CHECKOUT) {
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
      <BodyTextContainer showFullContent={stage === Stage.START}>
        <PromptContainer>
          <FirstInstructionText shouldDisplay={stage === Stage.START}>
            Let's start with a goal:
          </FirstInstructionText>
          <GoalInput
            type="text"
            placeholder="Enter your goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </PromptContainer>
        <RemainingContentContainer shouldDisplay={stage === Stage.SET_AMOUNT}>
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
          <WagerContainer>
            <BodyText shouldDisplay={true}>
              When will you be done by?
            </BodyText>
            <div>
              <NumberDateInput
                type="number"
                placeholder="1"
                value={durationValue || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 3) {
                    setDurationValue(parseInt(value));
                    setSpecificDate(null);
                  }
                }}
                maxLength={3} 
              />
              <DurationSelect
                value={durationUnit}
                onChange={(e) => { setDurationUnit(e.target.value); }}
                isActive={!(specificDate !== undefined && specificDate !== null)}
              >
                {durationUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </DurationSelect>
              <OrText shouldDisplay={true}>
              — or —
              </OrText>
                <DatePickerContainer isActive={!(durationValue !== undefined && durationValue !== null && !Number.isNaN(durationValue))}>
                  <DatePicker
                    selected={specificDate}
                    onChange={(date: Date | null) => { setSpecificDate(date); setDurationValue(null); }}
                    wrapperClassName='date_picker'
                    placeholderText="Select date"
                  />
                  <DatePickerWrapperStyles />
                </DatePickerContainer>
                
            </div>
          </WagerContainer>
          {<ProceedButton onClick={handleProceed} showArrow={!isLoading} hidden={!(durationValue || specificDate)}>
            {isLoading ? <Spinner/> : 'Continue'}
          </ProceedButton>}
        </RemainingContentContainer>
        <RemainingContentContainer shouldDisplay={stage === Stage.CONTACT}>
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
          <ProceedButton onClick={handleFinish} showArrow={!isLoading}>
            {isLoading ? <Spinner/> : 'Confirm'}
          </ProceedButton>
        </RemainingContentContainer>
      </BodyTextContainer>
      <HomeButton 
        onClick={navigateHome} 
      >
        <FaHome size={30} />
      </HomeButton>
    </div>
  );
}