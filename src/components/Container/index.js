import styled from 'styled-components';

const Container = styled.div`
  max-width: 700px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;

  h1 {
    font-size: 25px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;

    svg {
      margin-right: 10px;
    }
  }
`;

export default Container;
