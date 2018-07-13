import React, { Component } from 'react';
import * as FontAwesome from 'react-icons/lib/fa';

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
