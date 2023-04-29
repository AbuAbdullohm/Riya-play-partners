import React from 'react';

const ExpertCard = () => {
    return (
        <div className="expert-card-col">
            <div className="expert-card skeleton">
                <div className="circle-avatar mr-25">
                    <span className="circle-line"></span>
                    <div className="skeleton-placeholder w-100 h-100 radius-50"></div>
                </div>
                <div className="expert-card__body mt-30">
                    <p className="skeleton-placeholder h-25px radius-50px mb-10 w-100"></p>

                    <p className="skeleton-placeholder h-25px radius-50px mb-5" style={{width: "80%", height: "15px"}}></p>
                    <p className="skeleton-placeholder h-25px radius-50px mb-5" style={{width: "80%", height: "15px"}}></p>
                    <p className="skeleton-placeholder h-25px radius-50px mb-5" style={{width: "65%", height: "15px"}}></p>
                    <p className="skeleton-placeholder h-25px radius-50px " style={{width: "55%", height: "15px"}}></p>
                </div>
                <div className="expert-card__footer">
                    <div className="info-bar">
                        <span className="skeleton-placeholder" style={{width: "27px", height: "27px", borderRadius: "50%"}}></span>
                        <span className="skeleton-placeholder" style={{width: "30px", height: "12px", borderRadius: "50px"}}></span>
                    </div>
                    <div className="info-bar">
                        <span className="skeleton-placeholder" style={{width: "27px", height: "27px", borderRadius: "50%"}}></span>
                        <span className="skeleton-placeholder" style={{width: "30px", height: "12px", borderRadius: "50px"}}></span>
                    </div>
                    <div className="info-bar">
                        <span className="skeleton-placeholder" style={{width: "27px", height: "27px", borderRadius: "50%"}}></span>
                        <span className="skeleton-placeholder" style={{width: "30px", height: "12px", borderRadius: "50px"}}></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertCard;
