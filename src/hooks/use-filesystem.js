import { useCallback } from 'react';
import config from 'config';


const { FLEETBASE_HOST, STORAGE_FILESYSTEM } = config;


const useFilesystem = () => {

  const getUrl = useCallback((url) => {

    // Silence  WARN  ReactImageView: Image source "null" doesn't exist
    // TODO: Implement proper fix.
    if(!url?.length) {
      return 'https://'
    }

    // Iff properly built url, eg. https://..
    // return without further fix.
    if(url.indexOf('://') > 0) {
      return url
    }

    switch(STORAGE_FILESYSTEM) {
      case 'public':
        return  FLEETBASE_HOST + (url.startsWith('/') ? '' : '/')  + url
    }

  }, [])

  return { getUrl }
}

export default useFilesystem;