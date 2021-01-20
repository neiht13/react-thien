import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { AppConfig } from './AppConfig';
import { Dashboard } from './components/Dashboard';
import { MiscDemo } from './components/MiscDemo';
import { EmptyPage } from './components/EmptyPage';
import { Documentation } from "./components/Documentation";
import { InputDemo } from './components/InputDemo';
import { FormLayoutDemo } from './components/FormLayoutDemo';
import { ButtonDemo } from './components/ButtonDemo';
import { PanelDemo } from "./components/PanelDemo";
import { MessageDemo } from './components/MessageDemo';
import { MenuDemo } from './components/MenuDemo';
import { OverlayDemo } from './components/OverlayDemo';
import { FileDemo } from './components/FileDemo';
import { ChartDemo } from './components/ChartDemo';
import { TableDemo } from './components/TableDemo';
import { ListDemo } from './components/ListDemo';
import { TreeDemo } from './components/TreeDemo';
import { Crud } from './components/Crud';
import { useAddToHomescreenPrompt } from "./service/AddToHomescreenPrompt";

import PrimeReact from 'primereact/utils';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';

const App = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(false);
    const [theme, setTheme] = useState('default');
    const sidebar = useRef();
    let menuClick = false;

    const [prompt, promptToInstall] = useAddToHomescreenPrompt();
    const [isVisible, setVisibleState] = React.useState(false);
    const hide = () => setVisibleState(false);

    useEffect(() => {

        if (mobileMenuActive) {
            addClass(document.body, 'body-overflow-hidden');
        }
        else {
            removeClass(document.body, 'body-overflow-hidden');
        }
    }, [mobileMenuActive]);
    useEffect(
        () => {
          if (prompt) {
            setVisibleState(true);
          }
        },
        [prompt]
      );



    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
        menuClick = false;
    }

    const onToggleMenu = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                setOverlayMenuActive(prevState => !prevState);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive(prevState => !prevState);
            }
        }
        else {
            setMobileMenuActive(prevState => !prevState);
        }
        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }

    const menu = [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { window.location = '#/' } },
        {
            label: 'Menu Modes', icon: 'pi pi-fw pi-cog',
            items: [
                { label: 'Static Menu', icon: 'pi pi-fw pi-bars', command: () => setLayoutMode('static') },
                { label: 'Overlay Menu', icon: 'pi pi-fw pi-bars', command: () => setLayoutMode('overlay') },
                { label: 'Dark', icon: 'pi pi-fw pi-bars', command: () => setLayoutColorMode('dark') },
                { label: 'Light', icon: 'pi pi-fw pi-bars', command: () => setLayoutColorMode('light') }
            ]
        },
        {
            label: 'Components', icon: 'pi pi-fw pi-globe', badge: '13',
            items: [

                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/formlayout' },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/input' },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/button' },
                { label: 'Table', icon: 'pi pi-fw pi-table', to: '/table' },
                { label: 'List', icon: 'pi pi-fw pi-list', to: '/list' },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/tree' },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/panel' },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/overlay' },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/menu' },
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/message' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/chart' },
                { label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/misc' }
            ], active: true
        },
        {
            label: 'Template Pages', icon: 'pi pi-fw pi-file',
            items: [
                { label: 'Empty Page', icon: 'pi pi-fw pi-circle-off', to: '/empty' },
                { label: 'Crud', icon: 'pi pi-fw pi-circle-off', to: '/crud' }
            ]
        },
        { label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
        { label: 'View Source', icon: 'pi pi-fw pi-search', command: () => { window.location = "https://github.com/primefaces/sigma" } }
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const isDesktop = () => {
        return window.innerWidth > 1024;
    }

    const isSidebarVisible = () => {
        if (isDesktop()) {
            if (layoutMode === 'static')
                return !staticMenuInactive;
            else if (layoutMode === 'overlay')
                return overlayMenuActive;
            else
                return true;
        }

        return true;
    }

    const logo = layoutColorMode === 'dark' ? 'assets/layout/images/logo-white.svg' : 'assets/layout/images/logo.svg';

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false
    });

    const sidebarClassName = classNames('layout-sidebar', {
        'layout-sidebar-dark': layoutColorMode === 'dark',
        'layout-sidebar-light': layoutColorMode === 'light'
    });

    const onThemeChange = (e) => {
        let themeElement = document.getElementById('theme-link');
        console.log(themeElement);
        themeElement.setAttribute('href', themeElement.getAttribute('href').replace(theme, e.theme));
        setTheme(e.theme)
        e.originalEvent.preventDefault();
    }
    const addHome = () => {
        if (!isVisible) {
            return <div>TESTTTTTTTTTTTTTTTTT</div>;
          }

          return (
            <div onClick={hide}>
              <button onClick={hide}>Close</button>
              Hello! Wanna add to homescreen?
              <button onClick={promptToInstall}>Add to homescreen</button>
            </div>
          );
    }

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <AppTopbar onToggleMenu={onToggleMenu} />
            {isVisible && <div onClick={hide}>
              <button onClick={hide}>Close</button>
              Hello! Wanna add to homescreen?
              <button onClick={promptToInstall}>Add to homescreen</button>
            </div>}
            <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={isSidebarVisible()} unmountOnExit>
                <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
                    <AppProfile />
                    <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
                </div>
            </CSSTransition>

            <AppConfig rippleEffect={ripple} onRipple={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange}
                onThemeChange={onThemeChange}
                />

            <div className="layout-main">
                <Route path="/" exact component={Dashboard} />
                <Route path="/empty" component={EmptyPage} />
                <Route path="/documentation" component={Documentation} />
                <Route path="/formlayout" component={FormLayoutDemo} />
                <Route path="/input" component={InputDemo} />
                <Route path="/button" component={ButtonDemo} />
                <Route path="/panel" component={PanelDemo} />
                <Route path="/message" component={MessageDemo} />
                <Route path="/menu" component={MenuDemo} />
                <Route path="/overlay" component={OverlayDemo} />
                <Route path="/file" component={FileDemo} />
                <Route path="/chart" component={ChartDemo} />
                <Route path="/misc" component={MiscDemo} />
                <Route path="/table" component={TableDemo} />
                <Route path="/list" component={ListDemo} />
                <Route path="/tree" component={TreeDemo} />
                <Route path="/crud" component={Crud} />
            </div>

            <AppFooter />

            <div className="layout-mask"></div>
        </div>
    );

}

export default App;
