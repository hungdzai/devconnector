import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileGithubItem from './ProfileGithubItem';
import { getGithubRepos } from '../../actions/profile';

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);

  return (
    <div className="profile-github">
      <h2 className='text-primary my-1'>Github Repos</h2>
      {repos === null ? (<Spinner />) : (
        repos.map(repo => (
          <ProfileGithubItem key={repo._id} repo={repo} />
        ))
      )}
    </div>
  )
}

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  repos: state.profile.repos
})

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
