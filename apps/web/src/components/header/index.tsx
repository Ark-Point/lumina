'use client';
import { HeaderArea, HeaderContainer, HeaderItem, LogoImage, LogoWrapper } from './style';
const Header = () => {
  const InternalRoute = { HOME: '/' };
  const logoUrl = '';

  return (
    <HeaderContainer>
      <HeaderArea aria-label="main-navigation">
        <LogoWrapper
          onClick={() => {
            window.location.href = InternalRoute.HOME;
          }}
        >
          <LogoImage src={logoUrl} alt="" />
          <HeaderItem>lumina</HeaderItem>
        </LogoWrapper>
      </HeaderArea>
    </HeaderContainer>
  );
};

export default Header;
