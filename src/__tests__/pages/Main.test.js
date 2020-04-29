import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import api from '../../services/api';
import Main from '../../pages/Main';

const apiMock = new MockAdapter(api);

const actWait = async (amount = 0) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, amount));
  });
};

const repoName = 'wladimirfrost/devRadar';

describe('Main page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should be able to add new repository', async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    );

    fireEvent.change(getByTestId('repo-input'), {
      target: { value: repoName },
    });

    apiMock.onGet(`https://api.github.com/repos/${repoName}`).reply(200, {
      full_name: repoName,
    });

    fireEvent.submit(getByTestId('repo-form'));
    await actWait();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'repositories',
      JSON.stringify([{ name: repoName }])
    );
  });

  it('should store repository in storage', async () => {
    let { getByTestId } = render(
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    );

    fireEvent.change(getByTestId('repo-input'), {
      target: { value: repoName },
    });

    apiMock.onGet(`https://api.github.com/repos/${repoName}`).reply(200, {
      full_name: repoName,
    });

    fireEvent.submit(getByTestId('repo-form'));
    await actWait();

    cleanup();

    ({ getByTestId } = render(
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    ));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'repositories',
      JSON.stringify([])
    );
  });
});
