declare module 'react';
declare module 'next-themes';
declare module 'react-icons/gi';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
