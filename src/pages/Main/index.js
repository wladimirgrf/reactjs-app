import React, { useState, useEffect } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import { Form, SubmitButton, List } from './styles';
import api from '../../services/api';

export default function Main() {
  const [repositories, setRepositories] = useState([]);
  const [newRepo, setNewRepo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      setRepositories(JSON.parse(repositories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  function handleInputChange(e) {
    setNewRepo(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    setRepositories([...repositories, data]);
    setNewRepo('');
    setLoading(false);
  }

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositórios
      </h1>
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          name="repotxt"
          placeholder="Adicionar repositório"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton disabled={loading}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List data-testid="repo-list">
        {repositories.map(repository => (
          <li key={repository.name} data-testid={repository.name}>
            <span>{repository.name}</span>
            {/* <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link> */}
          </li>
        ))}
      </List>
    </Container>
  );
}
