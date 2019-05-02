import '@babel/polyfill';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import wrapWithProvider from './src/utils/wrapWithProvider';

export const wrapRootElement = wrapWithProvider;
export default wrapRootElement;
