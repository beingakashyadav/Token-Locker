import React from 'react';
import "../styles/Spinner.scss";

const LoadingSpinner = () => {
    return (
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    )
}

export default LoadingSpinner;