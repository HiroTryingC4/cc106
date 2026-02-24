import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | Smart Stay` : 'Smart Stay - Property Management';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default usePageTitle;
