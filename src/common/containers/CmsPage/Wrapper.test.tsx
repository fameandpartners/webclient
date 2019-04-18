import React from 'react';
import Wrapper from './Wrapper';
import { shallow } from 'enzyme';
import 'jest-enzyme';

function getComponent(isEditMode: boolean) {
  const element = (
    <Wrapper id="Test ID" spaceId="Space Id" isEditMode={isEditMode}>
      <div>wrapped</div>
    </Wrapper>
  );
  const dom = shallow(element);

  return { element, dom };
}

xit('sets id', () => {
  const { dom } = getComponent(false);

  expect(dom).toHaveProp('id', 'Test ID');
});

describe('when edit mode', () => {
  xit('does show edit link', () => {
    const { dom } = getComponent(true);
    expect(dom.find('a')).toExist();
  });
});

describe('when not edit mode', () => {
  xit('does not show link', () => {
    const { dom } = getComponent(false);
    expect(dom.find('a')).not.toExist();
  });
});
