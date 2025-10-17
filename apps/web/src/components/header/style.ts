import { HEADER_HEIGHT } from '@/constant/style';
import styled from '@emotion/styled';

export const HeaderContainer = styled.header`
  width: 100%;
  height: ${HEADER_HEIGHT}
  // position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  // padding: 1.25rem 2rem;
`;

export const HeaderArea = styled.nav`
  display: flex;
  align-items: center;
  max-width: 42rem;
  // margin: 0 auto;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  transition: opacity 0.2s ease-in-out;
`;

export const LogoImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.75rem;
`;

export const HeaderItem = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: blue;
`;
