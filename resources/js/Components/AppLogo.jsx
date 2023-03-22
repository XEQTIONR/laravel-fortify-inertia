import React from 'react';

export default function AppLogo ({show, className}) {
    return <img className={className} style={{ display:  show ? 'block' : 'none', height: '30px'}} src="/stripekart-wordmark.svg" alt="stripekart" />;
}
