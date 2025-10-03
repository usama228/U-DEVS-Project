import React from "react";
import { Link } from "react-router-dom";

const PageTitle = ({ activeMenu, motherMenu, pageContent }) => {
    return (
        <div
  className="row page-titles"
  style={{
    minHeight: "60px",
    maxHeight: "60px",
  }}
>
    <ol className="breadcrumb mb-0">
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
