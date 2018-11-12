import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import moment from 'moment';

// A nice helper to tell us if we're on the server
export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const getLiveVideos = liveVideos => {
  const currentTime = moment(moment().format('MM/DD/YYYY h:mm a'));
  return (
    liveVideos &&
    liveVideos.reduce((acc, item) => {
      let result = { ...acc };
      const { startDate, endDate } = item;
      const endTime = moment(endDate, 'MM/DD/YYYY h:mm a', true);
      const startTime = moment(startDate, 'MM/DD/YYYY h:mm a', true);
      if (currentTime.isBetween(startTime, endTime)) {
        result = item;
        return result;
      }
      return result;
    }, {})
  );
};

export const decodeHTML = function(text) {
  const map = { gt: '>' /* , … */ };
  return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, ($0, $1) => {
    if ($1[0] === '#') {
      return String.fromCharCode(
        $1[1].toLowerCase() === 'x'
          ? parseInt($1.substr(2), 16)
          : parseInt($1.substr(1), 10)
      );
    }
    return map[$1] ? map[$1] : $0;
  });
};

export const cleanUrl = (url, prefix = '') =>
  url && prefix + url.replace(/https?:\/\/[^/]+/, '');
export const cleanText = content => content.replace(/<\/?[^a]?[^>]+(>|$)/g, '');
export const getExcerpt = (excerpt, length = 200) =>
  excerpt.length > length
    ? `${excerpt.replace(/<\/?[^>]+(>|$)/g, '').substring(0, length)}...`
    : excerpt;

export const getSocialIcon = (title, size, color) => {
  switch (title.toLowerCase()) {
    case 'facebook':
      return <FontAwesome.FaFacebook size={size} color={color} />;
    case 'twitter':
      return <FontAwesome.FaTwitter size={size} color={color} />;
    case 'youtube':
      return <FontAwesome.FaYoutubeSquare size={size} color={color} />;
    case 'instagram':
      return <FontAwesome.FaInstagram size={size} color={color} />;
    default:
      return '';
  }
};

export const getNumAPIResults = response => {
  let numResults = 0;
  if (response.headers && response.headers['x-wp-total'])
    numResults = response.headers['x-wp-total'] / 1;
  return numResults;
};

export const getHeaderMenuObject = menus =>
  menus
    ? menus.map(link => ({
        label: link.title,
        url: link.url,
        icon: link.wordpress_children && (
          <FontAwesome.FaCaretDown className="default-icon" />
        ),
        children:
          link.wordpress_children &&
          getHeaderMenuObject(link.wordpress_children),
        iconPlacement: 'right'
      }))
    : [];

export const getSocialMenuObject = (menus, size, color) =>
  menus
    ? menus.map(link => ({
        label: link.title,
        link: link.url,
        icon: getSocialIcon(link.title, size, color)
      }))
    : [];

export const removeDuplicates = (myArr, prop) =>
  myArr.filter(
    (obj, pos, arr) =>
      arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  );

export const getPosts = (data, listIndex, postIndex, postName, extraIndex) => {
  let posts =
    (data[listIndex] &&
      data[listIndex].acf &&
      data[listIndex].acf[postIndex] &&
      data[listIndex].acf[postIndex].map(
        obj =>
          obj[postName] && {
            ...obj[postName],
            ...{ title: obj[postName].postTitle },
            ...{ excerpt: obj[postName].postExcerpt }
          }
      )) ||
    [];
  if (data[extraIndex])
    posts = [...posts, ...data[extraIndex].edges.map(obj => obj.node)];

  return posts.filter(n => n);
};

export const getFirstImageFromWpList = posts => {
  let image = '';
  if (posts.length > 0 && posts[0].acf) {
    const imgContainer = posts[0].acf.videoImage || posts[0].acf.postHeader;
    if (imgContainer)
      image =
        imgContainer && imgContainer.sizes ? imgContainer.sizes.medium : '';
    else {
      image = posts[0].coverImage || posts[0].thumbnail;
    }
  }
  return image;
};

export const getTransitions = timeout => ({
  entering: {
    opacity: 0
  },
  entered: {
    transition: `opacity ${timeout}ms ease-in-out`,
    opacity: 1
  },
  exiting: {
    transition: `opacity ${timeout}ms ease-in-out`,
    opacity: 0
  }
});

export const getTransitionStyle = ({ timeout, status }) =>
  getTransitions(timeout)[status] || {};

export const getEventDate = eventDates => {
  let eDate = '';
  for (let x = 0; x < eventDates.length; x += 1) {
    const { startTime, endTime } = eventDates[x];
    const formattedStartTime = moment(startTime, 'MM/DD/YYYY h:mm a', true);
    const formattedEndTime = moment(endTime, 'MM/DD/YYYY h:mm a', true);

    // Add date prop
    if (!eDate || x === 0) eDate = ``;
    if (formattedStartTime.isValid() && formattedEndTime.isValid()) {
      let format = 'MMM DD';
      if (formattedEndTime.get('month') < formattedStartTime.get('month'))
        format = 'MMM DD, YYYY';
      eDate += `${formattedStartTime.format(
        format
      )} - ${formattedEndTime.format(format)} <br />`;
    }
  }
  return eDate;
};

export const getCurrentEvents = (currentDay, events, numEntries) =>
  events.reduce(
    (acc, item) => {
      const result = { ...acc };
      const {
        node: {
          acf: { eventDates }
        }
      } = item;
      if (!numEntries || result.started < numEntries) {
        for (let x = 0; x < eventDates.length; x += 1) {
          const { startTime, endTime } = eventDates[x];
          const formattedStartTime = moment(
            startTime,
            'MM/DD/YYYY h:mm a',
            true
          );
          const formattedEndTime = moment(endTime, 'MM/DD/YYYY h:mm a', true);
          if (
            currentDay.isSameOrBefore(formattedEndTime) &&
            (!numEntries || result.started < numEntries) &&
            currentDay.isSameOrAfter(formattedStartTime)
          ) {
            result.values.push(item);
            result.started += 1;
          }
        }
      }
      return result;
    },
    { values: [], started: 0 }
  );

export const getPrograms = (schedules, numEntries) => {
  const currentTime = moment(new Date());
  const day = currentTime.format('MMMM-YYYY').toLowerCase();

  if (schedules) {
    const programs = schedules.reduce((acc, schedule) => {
      let result = { ...acc };
      if (schedule.node.slug === day)
        result = schedule.node.acf.schedulePrograms;
      return result;
    }, {});

    return programs.reduce(
      (acc, item) => {
        const result = { ...acc };
        if (result.started < numEntries) {
          const endTime = moment(
            new Date(`${item.programStartDate} ${item.programEndTime}`)
          );
          if (currentTime.isSameOrBefore(endTime) || result.started > 0) {
            result.values.push(item);
            result.started += 1;
          }
        }
        return result;
      },
      { values: [], started: 0 }
    );
  }
  return {};
};
