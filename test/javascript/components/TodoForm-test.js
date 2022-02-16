import React from 'react';
import { shallow } from 'enzyme';

import TodoForm from '../../../app/javascript/components/TodoForm';

const e = React.createElement;

describe('<TodoForm/>', () => {
  it('should render', () => {
    const wrapper = shallow(e(TodoForm));
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should handle submit', async () => {
    const input = { focus: jest.fn() };
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: input });

    const handleOnSubmit = jest.fn();
    const resetForm = jest.fn();

    const wrapper = shallow(e(TodoForm, { onSubmit: handleOnSubmit }));
    await wrapper.find('Formik').props().onSubmit({ text: 'test' }, { resetForm });

    expect(handleOnSubmit).toHaveBeenCalledWith({ text: 'test' });
    expect(resetForm).toHaveBeenCalledWith({ text: '' });
    expect(input.focus).toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const error = new Error();
    error.response = { data: { errors: ['Error 1', 'Error 2'] } };

    const handleOnError = jest.fn();
    const handleOnSubmit = () => { throw error; };
    const wrapper = shallow(e(TodoForm, { onSubmit: handleOnSubmit, onError: handleOnError }));
    await wrapper.find('Formik').props().onSubmit({ text: '' });

    expect(handleOnError).toHaveBeenCalledWith(['Error 1', 'Error 2']);
  });
});