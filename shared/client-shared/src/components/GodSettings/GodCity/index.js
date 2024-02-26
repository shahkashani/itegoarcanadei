import styled from 'styled-components';
import { GodClose } from '../GodClose';
import { useMemo, useState } from 'react';

const Wrapper = styled.div`
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const CityWrapper = styled.div`
  max-width: 900px;
  position: relative;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 50px;
  max-height: calc(100vh - 200px);
  text-align: center;
  overflow: hidden;
  overflow-y: scroll;
  white-space: pre-wrap;
  color: white;
`;

const Controls = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Header = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 32px;
`;

const CityLink = styled.a`
  color: inherit;
  font-size: 18px;
`;

const HeaderWrapper = styled.div``;

const Description = styled.main`
  line-height: 1.7;
  font-size: 18px;
`;

const ReadMore = styled.button`
  background: none;
  border: none;
  outline: none;
  color: #888;
  cursor: pointer;
  font-size: 18px;
  font-family: inherit;
  margin-top: 20px;
  transition: color 250ms;

  &:hover {
    color: #aaa;
  }
`;

export const GodCity = ({
  city: { name, url, urls, description },
  onClose,
  linkTarget,
  ...props
}) => {
  const [isExpanded, setIsExpaded] = useState(false);
  const paragraphs = useMemo(() => description.split('\n\n'), [description]);
  const isTruncated = !isExpanded && paragraphs.length > 2;
  const firstParagraph = useMemo(
    () => (paragraphs.length > 0 ? paragraphs[0] : ''),
    paragraphs
  );

  return (
    <Wrapper {...props} onClick={() => onClose?.()}>
      <CityWrapper onClick={(e) => e.stopPropagation()}>
        <HeaderWrapper>
          <Header>{name}</Header>
          <Controls>
            {url && (
              <CityLink target={linkTarget} href={url}>
                Travel here
              </CityLink>
            )}
            {urls &&
              urls.map((url) => (
                <CityLink target={linkTarget} key={url.url} href={url.url}>
                  {url.title}
                </CityLink>
              ))}
          </Controls>
        </HeaderWrapper>
        <Description>{isTruncated ? firstParagraph : description}</Description>
        {isTruncated && (
          <ReadMore onClick={() => setIsExpaded(true)}>Read the rest</ReadMore>
        )}
      </CityWrapper>
      <GodClose onClick={() => onClose?.()} />
    </Wrapper>
  );
};
