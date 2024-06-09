import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BodyTextContainer, WagerPill, WagerPillWithAccept, ProceedButton, PromptContainer, FirstInstructionText, CustomCheckbox, WagerContainer, ListLabel } from '../components/StyledForm';

const BACKEND_URL = "https://hqw51l1t2i.execute-api.us-east-1.amazonaws.com";

const OverviewPage = () => {
  const [commitments, setCommitments] = useState<{ commitment_id: string, description: string, amount: number, completed: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommitments, setSelectedCommitments] = useState<Set<number>>(new Set());
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

  const handleCheckboxChange = (index: number) => {
    setSelectedCommitments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const markAsDone = () => {
    const updatedCommitments = commitments.map((commitment, index) => {
      if (selectedCommitments.has(index)) {
        console.log("commitment", commitment)
        fetch(`${BACKEND_URL}/update-commitment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commitment_id: commitment.commitment_id, completed: true }),
        })
        .then((res) => res.json())
        .then((data) => {
          console.log('Commitment updated:', data);
        })
        .catch((error) => {
          console.error('Error updating commitment:', error);
        });
        return { ...commitment, completed: true };
      }
      return commitment;
    });
    setCommitments(updatedCommitments);
    setSelectedCommitments(new Set());
  };

  return (
    <BodyTextContainer>
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
              <CustomCheckbox 
                id={`commitment-${index}`} 
                onChange={() => handleCheckboxChange(index)} 
              />
              <ListLabel htmlFor={`commitment-${index}`} completed={commitment.completed}>
                {commitment.description}
              </ListLabel>
              <WagerPillWithAccept>${commitment.amount}</WagerPillWithAccept>
            </li>
          ))}
        </ul>)
        )}
      </ WagerContainer>
        
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ProceedButton onClick={() => window.location.href = '/'} showArrow={true}>
          Pick something new
        </ProceedButton>
        {selectedCommitments.size > 0 && (
          <ProceedButton onClick={markAsDone} style={{ marginLeft: '10px' }}>
            Mark as done
          </ProceedButton>
        )}
      </div>
    </BodyTextContainer>
  );
};

export default OverviewPage;