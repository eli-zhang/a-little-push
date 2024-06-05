import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BodyTextContainer, WagerPill, WagerPillWithAccept, ProceedButton, PromptContainer, FirstInstructionText, CustomCheckbox, WagerContainer, ListLabel } from '../components/StyledForm';

const BACKEND_URL = "https://hqw51l1t2i.execute-api.us-east-1.amazonaws.com";

const OverviewPage = () => {
  const [commitments, setCommitments] = useState<{ commitment_id: string, description: string, amount: number, completed: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const accountId = localStorage.getItem('account_id'); 

  useEffect(() => {
    if (accountId) {
      fetch(`${BACKEND_URL}/commitments?account_id=${accountId}`)
        .then((res) => res.json())
        .then((data) => {
          setCommitments(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching commitments:', error);
          setIsLoading(false);
        });
    } else {
      console.error('No account_id found in localStorage');
      navigate('/start'); 
    }
  }, [accountId]);

  return (
    <BodyTextContainer>
      <PromptContainer>
        <FirstInstructionText shouldDisplay={!isLoading && commitments.length == 0}>
          You have no commitments.
        </FirstInstructionText>
      </PromptContainer>
      <FirstInstructionText shouldDisplay={!isLoading && commitments.length > 0}>
        Here's what you've promised:
      </FirstInstructionText>
      
      <WagerContainer>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          commitments && (<ul style={{ listStyleType: 'none', padding: 0 }}>
          {commitments.map((commitment, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox id={`commitment-${index}`} checked={commitment.completed} />
              <ListLabel htmlFor={`commitment-${index}`} completed={commitment.completed}>
                {commitment.description}
              </ListLabel>
              <WagerPillWithAccept>${commitment.amount}</WagerPillWithAccept>
            </li>
          ))}
        </ul>)
        )}
      </ WagerContainer>
        
      
      <ProceedButton onClick={() => window.location.href = '/'} showArrow={true}>
        Pick something new
      </ProceedButton>
    </BodyTextContainer>
  );
};

export default OverviewPage;