import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import { mount, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import api from '../../services/api';
import Main from '../../pages/Main';

configure({ adapter: new Adapter() });

const apiMock = new MockAdapter(api);

describe('Main page', () => {
  it('should be able to add new repository', async () => {
    const { getByTestId } = render(<Main />);

    const repoName = 'wladimirfrost/devRadar';

    fireEvent.change(getByTestId('repo-input'), {
      target: { value: repoName },
    });

    apiMock.onGet(`https://api.github.com/repos/${repoName}`).reply(200, {
      full_name: repoName,
    });

    fireEvent.submit(getByTestId('repo-form'));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'repositories',
      JSON.stringify([{ full_name: repoName }])
    );
  });

  it('should be able to add new repository', () => {
    const main = mount(<Main />);

    const repoName = 'wladimirfrost/devRadar';

    const repoInput = main.find('input');

    repoInput.instance().value = repoName;
    repoInput.simulate('change', repoInput);

    apiMock.onGet(`https://api.github.com/repos/${repoName}`).reply(200, {
      full_name: repoName,
    });

    main.find('form').simulate('submit');

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'repositories',
      JSON.stringify([{ full_name: repoName }])
    );

    main.unmount();
  });

  // it('should store repository in storage', () => {
  //   let { getByText, getByTestId } = render(<Main />);

  //   fireEvent.change(getByTestId('repo-input'), {
  //     target: { value: 'wladimirfrost/devRadar' },
  //   });
  //   fireEvent.submit(getByTestId('repo-form'));

  //   cleanup();

  //   ({ getByText, getByTestId } = render(<Main />));

  //   expect(localStorage.setItem).toHaveBeenCalledWith(
  //     'repositories',
  //     JSON.stringify([])
  //   );
  // });
});
