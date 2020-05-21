import React from 'react';
import { config } from 'react-transition-group';
import { render, fireEvent } from '@testing-library/react';

import Alert, { IAlertProps } from './alert';
config.disabled = true;

jest.mock('../Icon/icon', () => {
  return (props: any) => {
    return <span>{props.icon}</span>;
  };
});

const testProps: IAlertProps = {
  title: 'title',
  onClose: jest.fn(),
};

const typeProps: IAlertProps = {
  ...testProps,
  type: 'success',
  description: 'hello',
  closable: false,
};
describe('test Alert Component', () => {
  it('should render the correct default Alert', () => {
    const { getByText, container, queryByText } = render(<Alert {...testProps} />);
    expect(queryByText('title')).toBeInTheDocument();
    expect(container.querySelector('.react-tangram-alert')).toHaveClass(
      'react-tangram-alert-default'
    );
    fireEvent.click(getByText('times'));
    expect(testProps.onClose).toHaveBeenCalled();
    expect(queryByText('title')).not.toBeInTheDocument();
  });
  it('should render the correct Alert based on different type and description', () => {
    const { container, queryByText } = render(<Alert {...typeProps} />);
    expect(queryByText('title')).toHaveClass('bold-title');
    expect(container.querySelector('.react-tangram-alert')).toHaveClass(
      'react-tangram-alert-success'
    );
    expect(queryByText('hello')).toBeInTheDocument();
    expect(queryByText('times')).not.toBeInTheDocument();
  });
});
