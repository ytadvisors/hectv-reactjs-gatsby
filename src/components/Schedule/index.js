import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import './styles.scss';

export default ({
  programs = {}
}) =>
  <section className="schedule">
    <h4 className="title">Playing Now</h4>
    <ul className="program">
      {programs && programs.values &&
      programs.values.map((program, x) => (
        <li
          key={`program-${x}`}
          className={`program ${x === 0 ? 'active' : ''}`}
        >
          <FontAwesome.FaPlayCircleO
            size="20"
            color={x === 0 ? '#0065bc' : '#aaa'}
          />
          <span>
      {` ${program.program_start_time} | ${program.program_title}`}
      </span>
        </li>
      ))}
    </ul>
  </section>
