import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map(edu => {
    const { _id, school, degree, from, to } = exp;
    return (
      <tr key={_id}>
        <td>{school}</td>
        <td className="hide-sm">{degree}</td>
        <td>
          <Moment format="YYYY/MM/DD">{from}</Moment> -
          {to === null ? 'Now' : <Moment format="YYYY/MM/DD">{to}</Moment>}
        </td>
        <td>
          <button
            onClick={() => deleteEducation(_id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Year</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(Education);
