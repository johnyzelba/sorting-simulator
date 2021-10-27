import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DragableBar from './DragableBar';

describe('<DragableBar />', () => {
  test('it should mount', () => {
    render(<DragableBar />);
    
    const dragableBar = screen.getByTestId('DragableBar');

    expect(dragableBar).toBeInTheDocument();
  });
});