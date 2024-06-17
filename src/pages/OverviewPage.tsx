import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BodyTextContainer, Spinner, WagerPillWithAccept, StatusPill, ProceedButton, FirstInstructionText, CustomCheckbox, WagerContainer, ListLabel } from '../style/StyledForm';
import { getConfig } from '../constants';
const { BACKEND_URL } = getConfig();

export const OverviewPage = () => {
  const [commitments, setCommitments] = useState<{ commitment_id: string, description: string, amount: number, completed: boolean, payment_status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
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
  }, [accountId, navigate]);

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
    setIsLoadingUpdate(true);
    const updatedCommitments = commitments.map((commitment, index) => {
      if (selectedCommitments.has(index)) {
        fetch(`${BACKEND_URL}/update-commitment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commitment_id: commitment.commitment_id, completed: true }),
        })
        .then((res) => res.json())
        .then((data) => {
          setIsLoadingUpdate(false);
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
              {commitment.payment_status && <StatusPill status={commitment.payment_status}>{commitment.payment_status}</StatusPill>}
            </li>
          ))}
        </ul>)
        )}
      </ WagerContainer>
        
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ProceedButton onClick={() => navigate('/start', { replace: true })} showArrow={true}>
          Pick something new
        </ProceedButton>
        {selectedCommitments.size > 0 && (
          <ProceedButton onClick={markAsDone} style={{ marginLeft: '10px' }}>
            {isLoadingUpdate ? <Spinner/> : 'Mark as done'}
          </ProceedButton>
        )}
      </div>
    </BodyTextContainer>
  );
};

export default OverviewPage;