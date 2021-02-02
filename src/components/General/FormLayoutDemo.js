import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import {AutoComplete} from 'primereact/autocomplete'
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { BreadCrumb } from 'primereact/breadcrumb';

import '../../layout/flags/flags.css'
import { CountryService } from '../../service/CountryService';

export function FormLayoutDemo() {

    const [city, setCity] = useState(null);
    const [user, setUser] = useState({firstName: undefined, lastName: undefined});
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [filteredCountries, setFilteredCountries] = useState(null);
    const countryService = new CountryService();


    useEffect(() => {
        countryService.getCountries().then(data => setCountries(data));
    }, [])
    const cityOptions = [
        { label: 'Select City', value: null },
        { label: 'New York', value: 'New York' },
        { label: 'Rome', value: 'Rome' },
        { label: 'London', value: 'London' },
        { label: 'Istanbul', value: 'Istanbul' },
        { label: 'Paris', value: 'Paris' }
    ]
    const toast = useRef();
    const showSubmit = () => {
        const { firstName, lastName } = user;
        if (firstName && lastName) {
            toast.current.show({ severity: 'success', summary: 'Submit User Name', detail: `${firstName}  ${lastName}`, life: 2000 });
        } else {
            //setUser({firstName: '', lastName: ''})
            toast.current.show({ severity: 'error', summary: 'Submit User Name', detail: 'Please Enter User Name', life: 1500 });
        }


    }
    const searchCountry = (event) => {
        setTimeout(() => {
            let filteredCountries;
            if (!event.query.trim().length) {
                filteredCountries = [...countries];
            }
            else {
                filteredCountries = countries.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            setFilteredCountries(filteredCountries);
        }, 250);
    }


    const countryTemplate = (option) => {
        return (
            <div className="country-item">
                <span class={`flag flag-${option.code.toLowerCase()}` } style={{width: "30px", height: "20px"}}></span>
                &nbsp;&nbsp;&nbsp;{option.name}
            </div>
        );
    }

    return (


        <div className="p-grid">

            <Toast ref={toast} />
            <div className="p-col-12">
                    <BreadCrumb model={[
                        { label: 'Home' },
                        { label: 'Form' },
                        { label: 'Input' }
                    ]} home={{icon: 'fas fa-home'}} />
            </div>
            <div className="p-col-12 p-md-6">
                <div className="card p-fluid">
                    <h5>Vertical</h5>
                    <div className="p-field">
                        <label htmlFor="name1">Name</label>
                        <InputText id="name1" type="text" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email1">Email</label>
                        <InputText id="email1" type="text" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="age1">Age</label>
                        <InputText id="age1" type="text" />
                    </div>
                </div>

                <div className="card p-fluid">
                    <h5>Vertical Grid</h5>
                    <div className="p-formgrid p-grid">
                        <div className="p-field p-col">
                            <label htmlFor="name2">Name</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div className="p-field p-col">
                            <label htmlFor="email2">Email</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-6">
                <div className="card p-fluid">
                    <h5>Horizontal</h5>
                    <div className="p-field p-grid">
                        <label htmlFor="name3" className="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Name</label>
                        <div className="p-col-12 p-md-10">
                            <InputText id="name3" type="text" />
                        </div>
                    </div>
                    <div className="p-field p-grid">
                        <label htmlFor="email3" className="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Email</label>
                        <div className="p-col-12 p-md-10">
                            <InputText id="email3" type="text" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h5>Inline</h5>
                    <div className="p-formgroup" style={{width: "80%"}}>
                        <div className="p-field p-fluid">
                            <label htmlFor="firstname1" className="p-sr-only">Firstname</label>
                            {user.firstName === '' ?
                                <div><InputText id="firstname1" type="text" placeholder="Firstname"  className="p-error" onChange={e => setUser({...user, firstName: e.target.value})}/>
                                <small className={"p-invalid"}>Enter your first name.</small></div>
                                : <InputText id="firstname1" type="text" placeholder="Firstname" onChange={e => setUser({...user, firstName: e.target.value})}/>
                            }

                        </div>
                        <div className="p-field p-fluid">
                            <label htmlFor="lastname1" className="p-sr-only">Lastname</label>
                            {user.lastName === '' ?
                                <div><InputText id="lastname1" type="text" placeholder="Lastname"  className="p-error" onChange={e => setUser({...user, lastName: e.target.value})}/>
                                <small className={"p-invalid"}>Enter your last name.</small></div>
                                : <InputText id="lastname1" type="text" placeholder="Lastname" onChange={e => setUser({...user, lastName: e.target.value})}/>
                            }
                        </div>
                        <Button label="Submit" onClick={showSubmit}></Button>
                    </div>
                </div>

                <div className="card">
                    <h5>Help Text</h5>
                    <div className="p-field p-fluid">
                        <label htmlFor="username">Username</label>
                        <InputText id="username" type="text" />
                        <small>Enter your username to reset your password.</small>
                    </div>
                </div>
            </div>

            <div className="p-col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="firstname2">Firstname</label>
                            <InputText id="firstname2" type="text" />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="lastname2">Lastname</label>
                            <InputText id="lastname2" type="text" />
                        </div>
                        <div className="p-field p-col-12">
                            <label htmlFor="address">Address</label>
                            <InputTextarea rows={4} cols={30} />
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="city">City</label>
                            <InputText id="city" type="text" />
                        </div>

                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="city">Country</label>
                            <div className="p-inputgroup">

                            <span className="p-inputgroup-addon">
                            <span class={`flag flag-${selectedCountry && selectedCountry.code && selectedCountry.code.toLowerCase()}` } style={{width: "28px", height: "19px"}}></span>
                            </span>
                            <AutoComplete placeholder="Search" value={selectedCountry} itemTemplate={countryTemplate} suggestions={filteredCountries} completeMethod={searchCountry} field="name" dropdown onChange={(e) => setSelectedCountry(e.value)} />

                            </div>
                        </div>

                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="state">State</label>
                            <Dropdown options={cityOptions} value={city} onChange={(event) => setCity(event.value)} autoWidth={false} />
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="zip">Zip</label>
                            <InputText id="zip" type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </div>


        // <div className="p-grid p-fluid">
        //     <div className="p-col-12 p-md-6">
        //         <div className="card p-fluid">
        //             <h5>Vertical</h5>
        //             <div className="p-field">
        //                 <div className="p-col-12">
        //                     <label>Name</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-field">
        //                     <label htmlFor="email1">Email</label>
        //                     <InputText id="email1" type="text" />
        //                 </div>
        //                 <div className="p-field">
        //                     <label htmlFor="age1">Age</label>
        //                     <InputText id="age1" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="card p-field">
        //             <h5>Vertical Grid</h5>
        //             <div className="p-formgrid p-grid">
        //                 <div className="p-formgrid p-grid">
        //                     <label>Name</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-col-6">
        //                     <label>Email</label>
        //                     <InputText />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="p-col-12 p-lg-6">
        //         <div className="card card-w-title">
        //             <h5>Horizontal</h5>
        //             <div className="p-grid">
        //                 <div className="p-col-12">
        //                     <div className="p-field p-grid">
        //                         <label className="p-col-2">Name</label>
        //                         <div className="p-col-10">
        //                             <InputText placeholder="Name" />
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="p-col-12">
        //                     <InputText placeholder="Email" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="card card-w-title">
        //             <h5>Inline</h5>
        //             <div className="p-grid">
        //                 <div className="p-col-3">
        //                     <InputText placeholder="Firstname" />
        //                 </div>
        //                 <div className="p-col-3">
        //                     <InputText placeholder="Lastname" />
        //                 </div>
        //                 <div className="p-col-2">
        //                     <Button label="submit" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="card card-w-title">
        //             <h5>Help Text</h5>
        //             <div className="p-grid">
        //                 <div className="p-col-12">
        //                     <label>Username</label>
        //                     <InputText />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="p-col-12">
        //         <div className="card card-w-title">
        //             <h5>Advanced</h5>
        //             <div className="p-grid">
        //                 <div className="p-col-6">
        //                     <label>Firstname</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-col-6">
        //                     <label>Lastname</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-col-12">
        //                     <label>Address</label>
        //                     <InputTextarea rows={3} cols={30} />
        //                 </div>
        //                 <div className="p-col-6">
        //                     <label>City</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-col-3">
        //                     <label>State</label>
        //                     <Dropdown options={cityOptions} value={city} onChange={(event) => setCity(event.value)} autoWidth={false} />
        //                 </div>
        //                 <div className="p-col-3">
        //                     <label>Zip</label>
        //                     <InputText />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    )
}

