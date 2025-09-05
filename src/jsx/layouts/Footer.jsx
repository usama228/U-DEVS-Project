 import React from "react";

const Footer = (props) => {
  let d = new Date();
  return (
    <div className={`footer ${props.changeFooter}`}>
      <div className="copyright">
        <p>
          Copyright © Designed &amp; Developed by{" "}
          <a href="#" target="_blank" rel="noreferrer">
            U Dev
          </a>{" "}
          {d.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
