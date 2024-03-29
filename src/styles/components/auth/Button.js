import styled from "styled-components";

const StyledButton = styled.button`
    width: 100px;
    height: 48px;
    padding: 13px 20px;
    border-radius: 4px;
    margin-left: 10px;
    background-color: #222222;
    font-family: Pretendard;
    font-size: 15px;
    font-weight: 700;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: left;
    color: #ffffff;
    cursor: pointer;
`;

export const Button = (props) => {
    return (
        <StyledButton
            className={props.className}
            type={props.type}
            onClick={props.onClick}
        >
            {props.children}
        </StyledButton>
    );
};
