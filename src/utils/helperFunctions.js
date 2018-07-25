import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import moment from "moment"

// A nice helper to tell us if we're on the server
export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

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

          //Add date prop
          if(!item.node.date || x === 0)
            item.node.date = ``;
          if(formated_start_time.isValid() && formated_end_time.isValid()) {
            let format = "MMM DD";
            if(formated_end_time.get("month") < formated_start_time.get("month"))
              format = "MMM DD, YYYY";
            item.node.date += `${formated_start_time.format(format)} - ${formated_end_time.format(format)} <br />`;
          }

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