import React from 'react';

const NewsCard = () => {
    return (

        <article className="news-card h-18px">
            <div className="news-card__image skeleton-placeholder"/>
            <div style={{
                width: '100%',
                height: '100%',
            }}>
                <div className="news-card__title w-100">
                    <div className="skeleton-placeholder h-18px w-100 mb-10"/>
                    <div className="skeleton-placeholder h-18px w-80 mb-10"/>
                    <div className="skeleton-placeholder h-18px w-40 mb-10"/>
                </div>
            </div>
        </article>
    );
};

export default NewsCard;
