import React from 'react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
import { RenderResult, render, fireEvent, wait, createEvent } from '@testing-library/react';

import { Upload, IUploadProps } from './upload';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// interface IIcon
jest.mock('../Icon/icon', () => {
  return (props: any) => {
    return <span onClick={props.onClick}>{props.icon}</span>;
  };
});

const testProps: IUploadProps = {
  action: 'fakeurl.com',
  onSuccess: jest.fn(),
  onChange: jest.fn(),
  onRemove: jest.fn(),
  drag: true,
};

const testFile = new File(['test'], 'test.png', { type: 'image/png' });

let wrapper: RenderResult, fileInput: HTMLInputElement | null, uploadArea: HTMLElement | null;

describe('test upload component', () => {
  beforeEach(() => {
    wrapper = render(<Upload {...testProps}>Click to upload</Upload>);
    fileInput = wrapper.container.querySelector('.react-tangram-file-input');
    uploadArea = wrapper.queryByText('Click to upload');
  });

  it('upload process should works fine', async () => {
    const { queryByText } = wrapper;
    mockedAxios.post.mockResolvedValue({ data: 'done' });
    expect(uploadArea).toBeInTheDocument();
    expect(fileInput).not.toBeVisible();
    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [testFile] } });
      expect(queryByText('spinner')).toBeInTheDocument();
      await wait(() => {
        expect(queryByText('test.png')).toBeInTheDocument();
      });
      expect(queryByText('check-circle')).toBeInTheDocument();
      expect(testProps.onSuccess).toHaveBeenCalledWith('done', testFile);
      expect(testProps.onChange).toHaveBeenCalledWith(testFile);
    }

    // remove the uploaded file
    const timesObj = queryByText('times');
    expect(timesObj).toBeInTheDocument();
    if (timesObj) {
      fireEvent.click(timesObj);
      expect(queryByText('test.png')).not.toBeInTheDocument();
      expect(testProps.onRemove).toHaveBeenCalledWith(
        expect.objectContaining({
          raw: testFile,
          status: 'success',
          name: 'test.png',
        })
      );
    }
  });

  it('drag and drop files should works fine', async () => {
    if (uploadArea) {
      fireEvent.dragOver(uploadArea);
      expect(uploadArea).toHaveClass('is-dragover');
      fireEvent.dragLeave(uploadArea);
      expect(uploadArea).not.toHaveClass('is-dragover');

      const mockDropEvent = createEvent.drop(uploadArea);
      Object.defineProperty(mockDropEvent, 'dataTransfer', {
        value: {
          files: [testFile],
        },
      });
      fireEvent(uploadArea, mockDropEvent);

      await wait(() => {
        expect(wrapper.queryByText('test.png')).toBeInTheDocument();
      });
      expect(testProps.onSuccess).toHaveBeenCalledWith('done', testFile);
    }
  });
});
