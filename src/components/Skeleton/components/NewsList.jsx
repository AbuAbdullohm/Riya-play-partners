import React from 'react';
import "./../style.scss";

const NewsList = () => {
  return (
    <div className="news__item skeleton-wrapper">
      <div className="news__link">
        <div className="news__image p-rel">
          <div className="skeleton-placeholder p-abs w-100 h-100" />
        </div>
        <div className="news__content">
          <div className="skeleton-placeholder h-12px mt-15 mb-5" />
          <div className="skeleton-placeholder h-12px mb-5 " />
          <div className="skeleton-placeholder h-12px mb-5 w-80" />
          <div className="skeleton-placeholder h-12px mb-5 w-80" />
          <div className="skeleton-placeholder h-12px w-40" />
        </div>
      </div>
    </div>
  );
};

export default NewsList;
