import React from 'react';
import PropTypes from 'prop-types';

const ProfileGithubItem = ({
  repo: {
    html_url,
    name
  }
}) => {
  return (
    <div className='repo bg-white p-1 my-1'>
      <a href={html_url} target='_blank' rel='noopener noreferrer'>
        {name}
      </a>
    </div>
  )
}

ProfileGithubItem.propTypes = {
  repo: PropTypes.object.isRequired
}

export default ProfileGithubItem;
