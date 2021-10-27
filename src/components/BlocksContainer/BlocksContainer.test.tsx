import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlocksContainer from './BlocksContainer';

describe('<BlocksContainer />', () => {
  test('it should mount', () => {
    render(<BlocksContainer />);
    
    const blocksContainer = screen.getByTestId('BlocksContainer');

    expect(blocksContainer).toBeInTheDocument();
  });
});