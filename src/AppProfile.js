import React, { useState } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Link, useHistory} from "react-router-dom";

export const AppProfile = () => {
    let history = useHistory();
    const [expanded, setExpanded] = useState(false);

    const onClick = (event) => {
        setExpanded(prevState => !prevState);
        event.preventDefault();
    }

    const logOutAction = () => {
        sessionStorage.usn = undefined;
        history.push('/login');
        window.location.reload();
    }

    return (
        <div className="layout-profile">
            <div>
                <img className="avatar" src="assets/thuxuan_v.jpg" alt="Profile" />
            </div>
            <button className="p-link layout-profile-link" onClick={onClick}>
                <span className="username">Phan Thien</span>
                <i className="pi pi-fw pi-cog" />
            </button>
            <CSSTransition classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={expanded} unmountOnExit>
                <ul className={classNames({ 'layout-profile-expanded': expanded })}>
                    <li><button type="button" className="p-link"><i className="pi pi-fw pi-user" /><span>Account</span></button></li>
                    <li><button type="button" className="p-link"><i className="pi pi-fw pi-inbox" /><span>Notifications</span><span className="menuitem-badge">2</span></button></li>
                    <li>
                        <Link to="/login">
                            <button type="button" className="p-link" onClick={logOutAction}><i className="pi pi-fw pi-power-off" /><span>Logout</span></button>
                        </Link>
                    </li>
                </ul>
            </CSSTransition>
        </div>
    );

}
