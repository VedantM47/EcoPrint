import styled from "styled-components";

const FooterContainer = styled.footer`
  background: ${(p) => p.theme.glass};
  backdrop-filter: blur(20px);
  border-top: 1px solid ${(p) => p.theme.borderColor};
  padding: 32px 0;
  margin-top: 80px;
`;

const FooterContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
`;

const Quote = styled.blockquote`
  margin: 0;
  font-size: 18px;
  font-style: italic;
  color: ${(p) => p.theme.muted};
  max-width: 600px;
  line-height: 1.6;
  position: relative;

  &::before {
    content: '"';
    font-size: 48px;
    color: ${(p) => p.theme.secondary};
    position: absolute;
    left: -24px;
    top: -12px;
    opacity: 0.3;
  }
`;

const TeamCredit = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${(p) => p.theme.text};
  font-weight: 500;

  svg {
    color: ${(p) => p.theme.secondary};
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    ${(p) => p.theme.secondary},
    transparent
  );
  border-radius: 2px;
`;

const LeafIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Quote>
          The environment is where we all meet; where we all have a mutual
          interest; it is the one thing all of us share.
        </Quote>
        <Divider />
        <TeamCredit>
          <span>Made by team</span>
          <LeafIcon />
          <strong>EcoPrint</strong>
        </TeamCredit>
      </FooterContent>
    </FooterContainer>
  );
}
