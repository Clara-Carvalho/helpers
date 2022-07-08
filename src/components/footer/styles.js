import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => (props.light ? "#eef5ff" : "white")};
  color: #123571;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 25px;
  padding: 30px;
  font-weight: bold;
  font-size: 13px;
`;

export const Line = styled.div`
  background-color: ${(props) => (props.isLined ? "#123571" : "#white")};
  width: 85%;
  height: 1px;
`;
