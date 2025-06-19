// style.ts
import styled, { css } from 'styled-components';

interface ResponsiveProps {
  isOpen: boolean;
}

export const HeaderTop = styled.div`
  background-color: #4267b2;
  color: white;
  font-size: 11px;
  text-align: center;
  padding: 6px 0px;
`;

export const HeaderMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  height: 88px;
  position: relative;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: black;
  margin-left:50px;
  span {
    background-color: #2e57a5;
    color: white;
    padding: 2px 6px;
    margin-left: 4px;
    font-size: 14px;
    border-radius: 3px;
  }
`;

export const NavMenu = styled.ul<ResponsiveProps>`
  list-style: none;
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;

  @media (max-width: 767px) {
    flex-direction: column;
    position: absolute;
    top: 88px;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px 32px;
    z-index: 999;
    display: none;

    ${props =>
    props.isOpen &&
    css`
        display: flex;
      `}
  }
`;

export const NavItem = styled.li`
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;

  @media (max-width: 767px) {
    font-size: 18px;
    padding: 8px 0;
  }

  &:hover {
    color: #2e57a5;
    text-decoration: underline;
  }
`;

export const IconGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
   margin-right:50px;
  .anticon {
    font-size: 13px;
    cursor: pointer;
  }

  @media (min-width: 768px) {
    div.hamburger-icon {
      display: none;
    }
  }
`;

export const Icon = styled.div`
  font-size: 16px;
  cursor: pointer;
  color: black;
  &:hover {
    color: #2e57a5;
  }
`;

export const HamburgerIcon = styled.div<ResponsiveProps>`
  display: none;
  cursor: pointer;
  font-size: 24px;
  color: black;
  z-index: 1000;

  @media (max-width: 767px) {
    display: block;
  }

  width: 25px;
  height: 20px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: #000;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: 0px;
    }
    &:nth-child(2),
    &:nth-child(3) {
      top: 8px;
    }
    &:nth-child(4) {
      top: 16px;
    }
  }

  ${props =>
    props.isOpen &&
    css`
      span {
        &:nth-child(1),
        &:nth-child(4) {
          top: 8px;
          width: 0%;
          left: 50%;
        }
        &:nth-child(2) {
          transform: rotate(45deg);
        }
        &:nth-child(3) {
          transform: rotate(-45deg);
        }
      }
    `}
`;

// Footer styles
export const FooterWrapper = styled.footer`
  background-color: #fff;
  padding: 40px 0;
  border-top: 1px solid #eaeaea;
  font-size: 14px;
  color: #333;
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

export const FooterSection = styled.div`
  h4 {
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 16px;
  }
  p,
  li {
    font-size: 13px;
    line-height: 1.6;
  }
  ul {
    list-style: none;
    padding: 0;
  }
`;

export const FooterBottom = styled.div`
  text-align: center;
  padding-top: 24px;
  font-size: 12px;
  color: #999;
`;
