import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, Filters, Actions } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    page: 1,
    filter: 'all',
  };

  async componentDidMount() {
    const { match } = this.props;
    const { filter } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filter,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  loadIssues = async () => {
    const { match } = this.props;

    const { page, filter } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [issues] = await Promise.all([
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filter,
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      issues: issues.data,
    });
  };

  filterClick = async fil => {
    this.setState({ filter: fil, page: 1 }, this.loadIssues);
  };

  prevPage = async () => {
    const { page } = this.state;

    await this.setState({ page: page === 1 ? page : page - 1 });
    this.loadIssues();
  };

  nextPage = async () => {
    const { page } = this.state;

    await this.setState({ page: page + 1 });
    this.loadIssues();
  };

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Filters>
          <button
            type="button"
            className="all"
            key="all"
            onClick={() => this.filterClick('all')}
          >
            All
          </button>
          <button
            type="button"
            className="open"
            key="open"
            onClick={() => this.filterClick('open')}
          >
            Open
          </button>
          <button
            type="button"
            className="closed"
            key="closed"
            onClick={() => this.filterClick('closed')}
          >
            Closed
          </button>
        </Filters>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                  <span
                    className={String(issue.state)}
                    key={String(issue.state)}
                  >
                    {issue.state}
                  </span>
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>

        <Actions>
          <button type="button" disabled={page === 1} onClick={this.prevPage}>
            Anterior
          </button>
          <span>Página {page}</span>
          <button
            type="button"
            disabled={issues.length === 0}
            onClick={this.nextPage}
          >
            Próxima
          </button>
        </Actions>
      </Container>
    );
  }
}
