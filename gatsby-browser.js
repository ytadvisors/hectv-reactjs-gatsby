// eslint-disable-next-line no-unused-vars
import React from 'react';
import wrapWithProvider from './src/utils/wrapWithProvider';

const timeout = 250;
const historyExitingEventType = `history::exiting`;

export { historyExitingEventType, timeout };
export const wrapRootElement = wrapWithProvider;
