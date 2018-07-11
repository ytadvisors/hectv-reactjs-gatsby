import React from 'react';
import moment from 'moment';
import { graphql } from "gatsby"
import * as FontAwesome from 'react-icons/lib/fa';
import './styles.scss';

const getPrograms = (programs, num_entries) => {
  const current_time = moment();
  return programs.reduce(
    (result, item) => {
      if (result['started'] < num_entries) {
        let end_time = moment(
          new Date(`${item.program_start_date} ${item.program_end_time}`)
        );
        if (current_time.isSameOrBefore(end_time) || result['started'] > 0) {
          result['values'].push(item);
          result['started']++;
        }
      }
      return result;
    },
    { values: [], started: 0 }
  );
};

export default (props) => {
  const {data:{acf:{schedule_programs}}} = props;
  const programs = getPrograms(schedule_programs, 5);
  return <section className="schedule">
    <h4 className="title">Playing Now</h4>
    <ul className="program">
      {programs['values'] &&
      programs['values'].map((program, x) => (
        <li
          key={`program-${x}`}
          className={`program ${x === 0 ? 'active' : ''}`}
        >
          <FontAwesome.FaPlayCircleO
            size="20"
            color={x === 0 ? '#0065bc' : '#aaa'}
          />
          <span>
              {' '}
            {`${program.program_start_time} | ${program.program_title}`}
            </span>
        </li>
      ))}
    </ul>
  </section>
}