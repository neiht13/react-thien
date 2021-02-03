import React, {useState, useRef, useEffect} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {BreadCrumb} from 'primereact/breadcrumb';
import {Card} from 'primereact/card';
import './LoginPage.scss';
import { useHistory } from 'react-router-dom';
import axios from "axios";

export function LoginPage() {
    let history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const toast = useRef();

    useEffect(() => {
    }, [])
    const showSubmit = () => {
        if (!username && !password) {
            toast.current.show({severity: 'error', summary: 'Login Failed', detail: 'Please Enter User Name & Password', life: 3000});
            setUsername('');
            setPassword('');
        }
        else if (!username) {
            toast.current.show({severity: 'error', summary: 'Login Failed', detail: 'Please Enter User Name', life: 2000});
            setUsername('')
        }
        else if (!password) {
            toast.current.show({severity: 'error', summary: 'Login Failed', detail: 'Please Enter Password', life: 2000});
            setPassword('')
        }
        else {
            loginAction(username, password)
        }
    }
    const loginAction = () => {
        axios.post('http://localhost:5000/login', {username, password}
        ).then(res => {
            console.log(res.data);
            sessionStorage.usn = res.data;
            toast.current.show({severity: 'success', summary: 'Login Success', detail: `User Name:  ${username}`, life: 2000});
            history.push('/');
            window.location.reload();
        });
    }
    const showPasswordAction = () => {
        setShowPass(!showPass);
    }
    const enterAction = (event) => {
        if(event.key === 'Enter'){
            console.log('enter press here! ');
            loginAction(username, password)
        }
    }
    const footer = () => {
        return (
            <span>
                <div className="p-grid">
                    <div className="p-col-3 p-offset-9">
                        <Button
                            className="submit p-button-raised p-button-success p-button-rounded"
                            onClick={showSubmit}
                            label="Login"
                            icon="pi pi-key"
                        />
                    </div>
                </div>
            </span>);
    }
    return (

        <div className="login-page p-grid">

            <Toast ref={toast}/>
            <div className="p-col-12">
                <BreadCrumb model={[
                    {label: 'Home'},
                    {label: 'Login'},
                ]} home={{icon: 'fas fa-home'}}/>
            </div>
            <div className="p-col-12 p-md-3">
            </div>
            <div className="p-col-12 p-md-6">
                <Card className="card margin-top-100 card-login" footer={footer}>
                    <label className="label-login">Login</label>
                    <div className="p-field p-fluid p-field-login">
                        <label htmlFor="username">Username</label>
                        <div className={`p-inputgroup ${username==='' ? "p-error" : ""}`}>
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"/>
                                </span>
                            <InputText id="username" type="text" placeholder="pht" onChange={e => setUsername(e.target.value)} onKeyPress={enterAction}/>
                        </div>
                        {username==='' &&  <small className="p-invalid">Enter your username.</small>}
                    </div>
                    <br/>
                    <div className="p-field p-fluid p-field-login">
                        <label htmlFor="password">Password</label>

                        <div className={`p-inputgroup ${password==='' ? "p-error" : ""}`}>
                                <span className="p-inputgroup-addon" onClick={showPasswordAction}>
                                    <i className={showPass ? "pi pi-eye" : "pi pi-eye-slash"}/>
                                </span>
                                <InputText id="password" type={showPass ? "text" : "password"} placeholder="132" onChange={e => setPassword(e.target.value)} onKeyPress={enterAction}/>
                        </div>
                        {password==='' &&  <small className="p-invalid">Enter your password.</small>}

                    </div>
                </Card>
            </div>
        </div>
    )
}
