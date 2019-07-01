import React from 'react';
import { Link } from 'gatsby';
import './styles.scss';

const getPodcastListItem = podcastInfo => {
  const { podcast, podcastLink } = podcastInfo;
  let listClass = '';
  switch (podcast) {
    case 'Apple Podcasts':
      listClass = 'apple-link';
      break;
    case 'Stitcher':
      listClass = 'stitcher-link';
      break;
    case 'Google Play':
      listClass = 'google-link';
      break;
    case 'Tune In':
      listClass = 'tunein-link';
      break;
    case 'Spotify':
      listClass = 'tunein-gray';
      break;
    case 'RSS':
      listClass = 'spotify-link';
      break;
    default:
      listClass = '';
  }

  return (
    <li className="podcast">
      <Link to={podcastLink} className={`${listClass} `} />
    </li>
  );
};

export default ({ podcasts }) => (
  <section className="podcast-links">
    {podcasts && podcasts.length > 0 && (
      <ul>
        <li className="subscribe-label">Subscribe:</li>
        {podcasts.map(obj => getPodcastListItem(obj))}
      </ul>
    )}
  </section>
);
