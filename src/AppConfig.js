import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Slider } from 'primereact/slider';

import classNames from 'classnames';

export const AppConfig = (props) => {

    const [active, setActive] = useState(false);
    const config = useRef(null);
    let outsideClickListener = useRef(null);

    const unbindOutsideClickListener = useCallback(() => {
        if (outsideClickListener.current) {
            document.removeEventListener('click', outsideClickListener.current);
            outsideClickListener.current = null;
        }
    }, []);

    const hideConfigurator = useCallback((event) => {
        setActive(false);
        unbindOutsideClickListener();
        event.preventDefault();
    }, [unbindOutsideClickListener]);

    const bindOutsideClickListener = useCallback(() => {
        if (!outsideClickListener.current) {
            outsideClickListener.current = (event) => {
                if (active && isOutsideClicked(event)) {
                    hideConfigurator(event);
                }
            };
            document.addEventListener('click', outsideClickListener.current);
        }
    }, [active, hideConfigurator]);

    useEffect(() => {
        if (active) {
            bindOutsideClickListener()
        }
        else {
            unbindOutsideClickListener()
        }
    }, [active, bindOutsideClickListener, unbindOutsideClickListener]);

    const isOutsideClicked = (event) => {
        return !(config.current.isSameNode(event.target) || config.current.contains(event.target));
    }

    const toggleConfigurator = (event) => {
        setActive(prevState => !prevState);
    }

    const configClassName = classNames('layout-config', {
        'layout-config-active': active
    });

    const onThemeChange = (event, theme, dark) => {
        if (props.onThemeChange) {
            props.onThemeChange({
                originalEvent: event,
                theme,
                dark
            })
        }

        event.preventDefault();
    }

    const [scale, setScale] = useState(14);
    const [scales, setScales] = useState([12,13,14,15,16]);
    const scaleChange = (e) => {
        setScale(e.value);
        document.documentElement.style.fontSize = scale + 'px';
    }

    return (
        <div ref={config} className={configClassName}>
            
            <div className="layout-config-content-wrapper">
                <button className="layout-config-button p-link" onClick={toggleConfigurator}>
                    <i className="pi pi-cog"></i>
                </button>
                <button className="layout-config-close p-link" onClick={hideConfigurator}>
                    <i className="pi pi-times"></i>
                </button>
            </div>
            <div className="layout-config-content">
                <h5>Component Scale</h5>
                <h6 style={{    display: "flex", justifyContent: "center"}}>Size {scale}</h6>
                <Slider value={scale} onChange={scaleChange} step={2} min={10} max={16} style={{width: "100%"}}/>
                <h5>Input Style</h5>
                <div className="p-formgroup-inline">
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="input_outlined" name="inputstyle" value="outlined" onChange={(e) => props.onInputStyleChange(e.value)} checked={props.inputStyle === 'outlined'} />
                        <label htmlFor="input_outlined">Outlined</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="input_filled" name="inputstyle" value="filled" onChange={(e) => props.onInputStyleChange(e.value)} checked={props.inputStyle === 'filled'} />
                        <label htmlFor="input_filled">Filled</label>
                    </div>
                </div>

                <h5>Ripple Effect</h5>
                <InputSwitch checked={props.rippleEffect} onChange={props.onRippleEffect} />

                <h5>Menu Type</h5>
                <div className="p-formgroup-inline">
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="static" name="layoutMode" value="static" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'static'} />
                        <label htmlFor="static">Static</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="overlay" name="layoutMode" value="overlay" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'overlay'} />
                        <label htmlFor="overlay">Overlay</label>
                    </div>
                </div>

                <h5>Menu Color</h5>
                <div className="p-formgroup-inline">
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="dark" name="layoutColorMode" value="dark" onChange={(e) => props.onColorModeChange(e.value)} checked={props.layoutColorMode === 'dark'} />
                        <label htmlFor="dark">Dark</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="light" name="layoutColorMode" value="light" onChange={(e) => props.onColorModeChange(e.value)} checked={props.layoutColorMode === 'light'} />
                        <label htmlFor="light">Light</label>
                    </div>
                </div>
                <div className="card">
                    <h5>Raised</h5>
                    <Button label="Default" className="p-button-raised p-mr-2 p-mb-2" onClick={(e) => onThemeChange(e, 'default')}/> 
                    <br/>
                    <Button label="Fluent" className="p-button-raised p-button-secondary p-mr-2 p-mb-2 " onClick={(e) => onThemeChange(e, 'fluent')}/>
                    <br/>
                    <Button label="Material" className="p-button-raised p-button-success p-mr-2 p-mb-2 " onClick={(e) => onThemeChange(e, 'material')}/>
                    <br/>
                    <Button label="No CSS" className="p-button-raised p-button-danger p-mr-2 p-mb-2 " onClick={(e) => onThemeChange(e, 'no css')}/>
                </div>
            </div>
        </div>
    );
}
