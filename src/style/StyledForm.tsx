import styled, { css, createGlobalStyle } from 'styled-components';
import DatePicker from 'react-datepicker';

export const DatePickerWrapperStyles = createGlobalStyle`
  .date_picker {
    background-color: transparent;
    color: #163C3A;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;;
    font-size: 20px;
    font-family: "DM Serif Display", serif;
    display: block;
  }

  .date_picker .react-datepicker__input-container input {
    border: none;
    padding: 5px; // Example style
    font-size: 20px;
    font-family: "DM Serif Display", serif;
    background-color: transparent;
    color: #163C3A;
    width: 10ch;
  }
`;

export const DatePickerContainer = styled.div<{ isActive?: boolean}>`
  background-color: #ffffff;
  border: none;
  border-radius: 20px;
  display: inline-block;
  padding: 7px 15px;
  margin: 0 5px;
  
  ${props => !props.isActive && css`
    background-color: #cccccc;
    color: #163C3A;
  `}
  
`

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

export const OrText = styled.p<{ shouldDisplay?: boolean }>`
  color: white;
  margin: 0 30px;
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.shouldDisplay ? '1' : '0'};
  display: inline-block;
  font-size: 25px;
`

export const FirstInstructionText = styled.p<{ shouldDisplay?: boolean }>`
  color: white;
  margin: 0;
  transition: opacity 0.3s ease-in-out;
  font-size: 60px;
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

export const NumberDateInput = styled.input`
  background: transparent;
  border: none;
  color: #cccccc;
  &:focus {
    outline: none;
  }
  font-size: 30px;
  font-family: "DM Serif Display", serif;
  overflow: hidden;
  width: 3ch;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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

  & > * {
    margin-top: 30px;
    margin-bottom: 30px;
  }
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

export const ProceedButton = styled.button<{ showArrow?: boolean }>`
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

  ${props => props.showArrow && css`
    &:after { 
      content: '→'; 
      margin-left: 10px; 
    }
  `}
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

export const Spinner = styled.span`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #ffffff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const CustomCheckbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-radius: 50%;
  background-color: transparent;
  cursor: pointer;
  position: relative;
  margin-right: 10px;

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background-color: white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const ListLabel = styled.label<{ completed?: boolean }>`
  color: ${props => props.completed ? '#aaaaaa' : '#eeeeee'};
  font-size: 30px;
  font-weight: 200;
  font-family: "DM Serif Display", serif;
  padding-right: 8px;
  padding-bottom: 3px;
  padding-left: 8px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  text-decoration-thickness: 2px; 
`;

export const WagerPillWithAccept = styled.button<{ isActive?: boolean }>`
  padding: 10px 15px;
  margin: 3px 5px;
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
    color: #163C3A;
  }

  ${props => props.isActive && css`
    background-color: #ffffff;
    color: #163C3A
  `}
`;

export const DurationSelect = styled.select<{ isActive?: boolean}>`
  padding: 10px 15px;
  margin: 0 5px;
  background-color: #ffffff;
  color: #163C3A;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 20px;
  font-family: "DM Serif Display", serif;
  transition: background-color 0.3s, color 0.3s;
  display: inline-block;

  ${props => !props.isActive && css`
    background-color: #cccccc;
    color: #163C3A;
  `}
`;

export const StatusPill = styled.button<{ status?: string }>`
  padding: 10px 15px;
  margin: 3px 5px;
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
    color: #163C3A;
  }

  ${props => props.status === `SUCCEEDED` && css`
    background-color: #ffffff;
    color: #163C3A;
    display: none;
  `}
  ${props => props.status === `REFUNDED` && css`
    background-color: #222222;
    color: #888888;
  `}
  ${props => (props.status === `PENDING` || props.status === `UNPAID`) && css`
    background-color: #cccccc;
    color: #777777;
  `}
`;