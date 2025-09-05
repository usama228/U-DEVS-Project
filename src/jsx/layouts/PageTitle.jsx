import React from "react";
import { Link } from "react-router-dom";

const PageTitle = ({ activeMenu, motherMenu, pageContent }) => {
    return (
        <div className="row page-titles">
            <ol className="breadcrumb">
                <li className="breadcrumb-item active">
                    <Link to="/">{motherMenu}</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="#">{activeMenu}</Link>
                </li>
            </ol>
        </div>
    );
};

export default PageTitle;
