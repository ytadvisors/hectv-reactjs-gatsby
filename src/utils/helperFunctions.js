import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import moment from "moment"

// A nice helper to tell us if we're on the server
export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const getLiveVideos = (live_videos) => {
  const current_time  = moment(moment().format('MM/DD/YYYY h:mm a'));
  return live_videos && live_videos.reduce((result, item) => {
      const {
        start_date,
        end_date
      } = item;
      let end_time = moment(end_date, "MM/DD/YYYY h:mm a", true);
      let start_time = moment(start_date, "MM/DD/YYYY h:mm a", true);
      if(current_time.isBetween(start_time, end_time)) {
        result = item;
        return result;
      }
      return result;
    }, {});

};

export const decodeHTML = function(text) {
  let map = {"gt":">" /* , … */};
  return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
    if ($1[0] === "#") {
      return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
    } else {
      return map.hasOwnProperty($1) ? map[$1] : $0;
    }
  });
};

export const cleanUrl = (url, prefix = "") => url && prefix + url.replace(/https?:\/\/[^/]+/, "");
export const cleanText = content => content.replace(/<\/?[^a]?[^>]+(>|$)/g, '');
export const getExcerpt = (excerpt, length = 200) => (excerpt.length > length) ? excerpt
    .replace(/<\/?[^>]+(>|$)/g, '')
    .substring(0, length) + '...' : excerpt ;

function getSocialIcon(title, size, color) {
  switch (title.toLowerCase()) {
    case 'facebook':
      return <FontAwesome.FaFacebook size={size} color={color} />;
    case 'twitter':
      return <FontAwesome.FaTwitter size={size} color={color} />;
    case 'youtube':
      return <FontAwesome.FaYoutubeSquare size={size} color={color} />;
    case 'instagram':
      return <FontAwesome.FaInstagram size={size} color={color} />;
  }
}

export function getNumAPIResults(response) {
  let num_results = 0;
  if (response.headers && response.headers['x-wp-total'])
    num_results = parseInt(response.headers['x-wp-total']);
  return num_results;
}

export function getHeaderMenuObject(menus) {
  return menus
    ? menus.map(link => {
        return {
          label: link.title,
          url: link.url,
          icon: link.wordpress_children && (
            <FontAwesome.FaCaretDown className="default-icon" />
          ),
          children: link.wordpress_children && getHeaderMenuObject(link.wordpress_children),
          icon_placement: 'right'
        };
      })
    : [];
}

export function getSocialMenuObject(menus, size, color) {
  return menus
    ? menus.map(link => {
        return {
          label: link.title,
          link: link.url,
          icon: getSocialIcon(link.title, size, color)
        };
      })
    : [];
}


export function  removeDuplicates(myArr, prop){
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

export function getPosts(data, listIndex, postIndex, postName, extraIndex){
  let posts = data[listIndex] && data[listIndex].acf
    && data[listIndex].acf[postIndex]
    && data[listIndex].acf[postIndex].map(obj =>  (
      obj[postName] &&
      { ...obj[postName],
        ...{ title: obj[postName].post_title},
        ...{ excerpt: obj[postName].post_excerpt }
      }))
    || [];
  if(data[extraIndex])
    posts = [...posts, ...data[extraIndex].edges.map(obj => obj.node)];


  return posts.filter( n => n );
}

export function getFirstImageFromWpList(posts){

  let image = "";
  if(posts.length > 0 && posts[0].acf){
    let imgContainer = posts[0].acf.video_image || posts[0].acf.post_header;
    if(imgContainer)
      image = imgContainer && imgContainer.sizes  ? imgContainer.sizes.medium : "";
    else {
      image = posts[0].cover_image || posts[0].thumbnail;
    }
  }
  return image;
}

export function getTransitions(timeout) {
  return {
    entering: {
      opacity: 0,
    },
    entered: {
      transition: `opacity ${timeout}ms ease-in-out`,
      opacity: 1,
    },
    exiting: {
      transition: `opacity ${timeout}ms ease-in-out`,
      opacity: 0,
    },
  }
}

export function getTransitionStyle({ timeout, status }){
  return getTransitions(timeout)[status] || {};
}

export function getEventDate(event_dates){
  let e_date = "";
  for(let x = 0; x < event_dates.length; x++) {
    const {
      start_time,
      end_time
    } = event_dates[x];
    let formated_start_time = moment(start_time, "MM/DD/YYYY h:mm a", true);
    let formated_end_time = moment(end_time, "MM/DD/YYYY h:mm a", true);

    //Add date prop
    if (!e_date || x === 0)
      e_date = ``;
    if (formated_start_time.isValid() && formated_end_time.isValid()) {
      let format = "MMM DD";
      if (formated_end_time.get("month") < formated_start_time.get("month"))
        format = "MMM DD, YYYY";
      e_date += `${formated_start_time.format(format)} - ${formated_end_time.format(format)} <br />`;
    }
  }
  return e_date;
}

export function getCurrentEvents(current_day, events, num_entries){
  return events.reduce(
    (result, item) => {
      const {
        node : {
          acf : {
            event_dates
          }
        }
      } = item;
      if (!num_entries || result['started'] < num_entries) {
        for(let x = 0; x < event_dates.length; x++){
          const {
            start_time,
            end_time
          } = event_dates[x];
          let formated_start_time = moment(start_time, "MM/DD/YYYY h:mm a", true);
          let formated_end_time = moment(end_time, "MM/DD/YYYY h:mm a", true);
          if (current_day.isSameOrBefore(formated_end_time)
            && (!num_entries || result['started'] < num_entries ) && current_day.isSameOrAfter(formated_start_time)) {
            result['values'].push(item);
            result['started']++;
          }

        }
      }
      return result;
    },
    { values: [], started: 0 }
  );
}

export const getPrograms = (schedules, num_entries) => {
  const current_time = moment(new Date());
  const day = current_time.format('MMMM-YYYY').toLowerCase();

  const programs = schedules.reduce((result, schedule) => {
    if(schedule.node.slug === day)
      result = schedule.node.acf.schedule_programs;
    return result;
  }, {});

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

