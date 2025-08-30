import React, { useEffect } from 'react';

const AdComponent = ({ adSlot }) => {
  useEffect(() => {
    // Try to push the ad to the window.adsbygoogle array
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []); // Empty dependency array means this runs once after mount

  return (
    <ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-4287607521320464"
     data-ad-slot={adSlot}
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
  );
};

export default AdComponent;
