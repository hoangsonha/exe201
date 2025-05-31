import classNames from "classnames/bind";

import styles from "./Footer.module.scss";

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <div className={cx("footer-component")}>
            <p>&copy; 2025 Nguyen Khanh Trinh. All rights reserved.</p>
        </div>
    )
}

export default Footer;