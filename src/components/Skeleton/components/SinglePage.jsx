import React from "react";
const SinglePage = () => {
	return (
		<div className="single-page-content mb-20">
			<div className="post-title">
					<div className="skeleton-placeholder h-18px w-100 mb-10"/>
			</div>
			<div className="post-thumbnail-content">
				<div className="post-thumbnail skeleton-placeholder"/>
				<div className="post-meta w-100">
					<div className="skeleton-placeholder h-18px w-80 mb-10"/>
				</div>
				<div className="post-meta w-100">
					<div className="skeleton-placeholder h-18px w-80 mb-10"/>
				</div>
			</div>
			<div className="text-content">
				<p>
					<div className="skeleton-placeholder h-18px w-100 mb-10"/>
					<div className="skeleton-placeholder h-18px w-100 mb-10"/>
					<div className="skeleton-placeholder h-18px w-100 mb-10"/>
					<div className="skeleton-placeholder h-18px w-80 mb-10"/>
					<div className="skeleton-placeholder h-18px w-80 mb-10"/>
					<div className="skeleton-placeholder h-18px w-80 mb-10"/>
					<div className="skeleton-placeholder h-18px w-40 mb-10"/>
					<div className="skeleton-placeholder h-18px w-40 mb-10"/>
					<div className="skeleton-placeholder h-18px w-40 mb-10"/>
				</p>
			</div>
			<div className="text-content">

				<div className="post-tags">
					{[...Array(3)].map((item, index)=> (
						<div key={index} style={{ width: '100px' }}
							 className="post-tags-item skeleton-placeholder"/>
					))}
				</div>
			</div>
		</div>
	);
};

export default SinglePage;