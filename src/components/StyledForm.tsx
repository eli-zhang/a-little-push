import styled, { css } from 'styled-components';

export const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const CheckoutContainer = styled.div`
  width: 70vw;
  margin-top: 30px;
  margin-bottom: 30px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`

export const BodyTextContainer = styled.div<{ showFullContent?: boolean }>`
  color: white;
  font-family: "DM Serif Display", serif;
  font-size: 80px;
`

export const BodyText = styled.p<{ shouldDisplay?: boolean }>`
  color: white;
  margin: 0;
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.shouldDisplay ? '1' : '0'};
`

export const FirstInstructionText = styled.p<{ shouldDisplay?: boolean }>`
  color: white;
  margin: 0;
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.shouldDisplay ? '1' : '0'};
`

export const GoalInput = styled.input`
  background: transparent;
  border: none;
  color: #cccccc;
  width: 100%;
  &:focus {
    outline: none;
  }
  font-size: 80px;
  font-family: "DM Serif Display", serif;
`;

export const PromptContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 80px;
  font-family: "DM Serif Display", serif;

`

export const RemainingContentContainer = styled.div<{ shouldDisplay?: boolean }>`
  display: ${props => props.shouldDisplay ? 'block' : 'none'};
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.shouldDisplay ? '1' : '0'};
`

export const WagerContainer = styled.div`
  font-size: 40px;
  font-family: "DM Serif Display", serif;
`

export const WagerPill = styled.button<{ isActive?: boolean }>`
  padding: 10px 15px;
  margin: 0 5px;
  background-color: #006b55;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;;
  font-size: 20px;
  font-family: "DM Serif Display", serif;

  &:hover {
    background-color: #ffffff;
    color: #163C3A
  }

  ${props => props.isActive && css`
    background-color: #ffffff;
    color: #163C3A
  `}
`;

export const ProceedButton = styled.button`
  padding: 10px 20px;
  background-color: transparent; 
  color: white;
  border: 2px solid #dddddd; 
  border-radius: 5px;
  cursor: pointer;
  position: relative; 
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 20px;
  font-family: "DM Serif Display", serif;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #dddddd;
    color: #163C3A;
  }

  &:after { 
    content: '→'; 
    margin-left: 10px; 
  }
`;

export const ContactInputContainer = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  font-size: 40px;
  font-family: "DM Serif Display", serif;
`;

export const ContactInput = styled.input`
  background: transparent;
  border: none;
  color: #cccccc;
  width: 100%;
  &:focus {
    outline: none;
  }
  font-size: 40px;
  font-family: "DM Serif Display", serif;
  margin-top: 10px;
`;

export const ContactOption = styled.button<{ isActive?: boolean }>`
  padding: 10px 15px;
  margin: 0 5px;
  background-color: #006b55;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 20px;
  font-family: "DM Serif Display", serif;
  display: inline-block;

  &:hover {
    background-color: #ffffff;
    color: #163C3A;
  }

  ${props => props.isActive && css`
    background-color: #ffffff;
    color: #163C3A;
  `}
`;