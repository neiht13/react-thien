import React, {useState, useEffect, useRef, useContext} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {CustomerService} from '../../service/CustomerService';
import './TableDemo.scss';
import '../../layout/flags/flags.css'
import classNames from 'classnames';
import {InputText} from 'primereact/inputtext';
import {ProgressBar} from 'primereact/progressbar';
import {Button} from 'primereact/button';
import * as XLSX from "xlsx";
import axios from "axios";
import moment from "moment";
import {InputTextarea} from "primereact/inputtextarea";
import {RadioButton} from "primereact/radiobutton";
import {InputNumber} from "primereact/inputnumber";
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";


export function TableDemo() {

    const [customers, setCustomers] = useState(null);
    const [employees, setEmployees] = useState(null);
    const [newEmployee, setEmployee] = useState({id: null, name: null, birthday: null, address: null, gender: null, city: null, province: null});
    const [showDialog, setShowDialog] = useState(false);
    const [showNesDialog, setShowNesDialog] = useState(false);
    const [cityState, setCityState] = useState(null);
    const [dayState, setDayState] = useState(null);
    const [monthState, setMonthState] = useState(null);
    const [yearState, setYearState] = useState(null);
    const [genderState, setGenderState] = useState(null);
    const [nameState, setNameState] = useState(null);
    const [provinceState, setProvinceState] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [refreshPage, setRefreshPage] = useState(0);
    const [selectItem, setSelectItem] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [birthdayDefault, setBirthdayDefault] = useState("dd/mm/yyyy");
    const dt = useRef(null);
    const isMounted = useRef(false);
    const customerService = new CustomerService();
    const province = [
        {label: 'Dong Thap', value: 'dt'},
        {label: 'Can Tho', value: 'ct'},
        {label: 'Sai Gon', value: 'sg'},
    ];
    const city = [
        {label: 'Cao Lanh', value: 'cl'},
        {label: 'Sa Dec', value: 'sd'},
        {label: 'Hong Ngu', value: 'hn'},
    ]
    useEffect(() => {
        isMounted.current = true;
        customerService.getCustomersMedium().then(data => {
            setCustomers(data)
        });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:21760/employee').then(res => {
            setEmployees(res.data)
        });
    }, [refreshPage]);

    useEffect((e) => {
        let arr = birthdayDefault.split('/');
        arr[0] = dayState || 'dd';
        arr[1] = monthState || 'mm';
        arr[2] = yearState || 'yyyy';
        let string = arr.join('/');
        setBirthdayDefault(string);
    }, [dayState,monthState,yearState]);

    const renderHeader = () => {
        return (
            <div className="table-header">
                List of Employee

                <span>
                    <button type="button" className="nes-btn is-primary" onClick={showNesDialogAction}><span className="nes-text">New</span></button>
                    &nbsp;&nbsp;&nbsp;
                    <Button className="p-button-raised p-button-danger" onClick={showDeleteDialogAction} disabled={selectedEmployees.length === 0}>Delete All</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button className="p-button-raised " onClick={showDialogAction}>New</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button className="p-button-raised p-button-secondary" onClick={exportCSV}>Export Csv</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button className="p-button-raised p-button-info" onClick={exportData}>Export Excel</Button>
                    &nbsp;&nbsp;&nbsp;
                    <span className="p-input-icon-left">
                        <i className="pi pi-search"/>
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search"/>
                    </span>
                </span>
            </div>
        );
    }

    const activityBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={rowData.activity} showValue={true}/>
            </React.Fragment>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Status</span>
                <span className={classNames('customer-badge', 'status-' + rowData.status)}>{rowData.status}</span>
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    const countryBodyTemplate = (rowData) => {
        let {name, code} = rowData.country;

        return (
            <React.Fragment>
                <span className="p-column-title">Country</span>
                <span class={"flag flag-" + code} style={{width: "28px", height: "19px"}}></span>
                <span style={{verticalAlign: 'middle', marginLeft: '.5em'}}>{name}</span>
            </React.Fragment>
        );
    }

    const representativeBodyTemplate = (rowData) => {
        const src = "assets/demo/images/avatar/" + rowData.representative.image;

        return (
            <React.Fragment>
                <span className="p-column-title">Representative</span>
                <img alt={rowData.representative.name} src={src} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{verticalAlign: 'middle'}}/>
                <span style={{verticalAlign: 'middle', marginLeft: '.5em'}}>{rowData.representative.name}</span>
            </React.Fragment>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                <span>{rowData.date}</span>
            </React.Fragment>
        );
    }

    const exportData = () => {
        var ws = XLSX.utils.json_to_sheet(customers);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");
        XLSX.writeFile(wb, "customers.xlsx");
    }
    const exportCSV = () => {
        dt.current.exportCSV();
    }
    const hideDialog = () => {
        setShowDialog(false);
        setShowNesDialog(false);
        setDeleteDialog(false);
        setYearState(null);
        setMonthState(null);
        setDayState(null);
        setSelectedEmployees([]);
        setSelectItem(null)
    }
    const saveAction = () => {
        axios.post('http://localhost:21760/employee/new',
            {
                name: nameState,
                gender: genderState,
                birthday: birthdayDefault,
                city: cityState
            }
        ).then(res => {
            setRefreshPage(refreshPage + 1);
            hideDialog();

        });
    }
    const deleteAction = () => {
        axios.post('http://localhost:21760/employee/delete',
            selectItem && selectItem.length > 0 ? selectItem : selectedEmployees
        ).then(res => {
            setRefreshPage(refreshPage + 1);
            hideDialog();
        });
    }
    const showDeleteDialogAction = () => {
        setDeleteDialog(true);
    }
    const showDialogAction = () => {
        setShowDialog(true);
    }
    const showNesDialogAction = () => {
        setShowNesDialog(true);
    }
    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveAction}/>
        </React.Fragment>
    );
    const dialogNesFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text nes-text" onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" className="p-button-text nes-text" onClick={saveAction}/>
        </React.Fragment>
    );
    const onInputChange = (e, fieldName) => {
        switch (fieldName) {
            case 'name':
                const valName = e && e.target && e.target.value;
                setNameState(valName)
                break;
            case 'birthday':
                const val = e && e.target && e.target.value;
                const birthday = moment(val).format('DD/MM/YYYY');
                setBirthdayDefault(birthday)
                break;
            case 'gender':
                const valGender = e && e.target && e.target.value;
                setGenderState(valGender)
                break;
            case 'city':
                const valCity = e && e.target && e.target.value;
                setCityState(valCity)
                break;
            case 'day':
                const vday = e && e.target && e.target.value;
                setDayState(vday)
                break;
            case 'month':
                const vmonth = e && e.target && e.target.value;
                setMonthState(vmonth)
                break;
            case 'year':
                const vyear = e && e.target && e.target.value;
                setYearState(vyear)
                break;
            default:
                const valDefault = e && e.target && e.target.value;
                console.log(`${fieldName}`, valDefault)
                newEmployee[`${fieldName}`] = `${valDefault}`;
                setEmployee(newEmployee);
        }
        setEmployee(newEmployee);
    }

    const confirmDeleteProduct = (product) => {
        setSelectItem([product]);
        setDeleteDialog(true);
    }

    const renderDay = () => {
        let days = [];
        let maxDay;
        let zero;
        if (monthState === '02') {
            maxDay = 28
        } else if (['01', '03', '05', '07', '08', '10', '12'].includes(monthState)) {
            maxDay = 31
        } else {
            maxDay = 30
        }
        for (let i = 1; i <= maxDay; i++) {
            zero = i < 10 ? '0' : '';
            days.push(<option value={zero+i}>{zero+i}</option>)
        }
        return days;
    }
    const renderYear = () => {
        let years = [];
            for (let i = 1900; i <=2100; i++) {
                years.push(<option value={i+''}>{i}</option>);
            }
        return years;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <button type="button" className="nes-btn is-warning" onClick={() => confirmDeleteProduct(rowData)}><i className="pi pi-pencil"/></button>
                &nbsp;&nbsp;&nbsp;
                <button type="button" className="nes-btn is-error" onClick={() => confirmDeleteProduct(rowData)}><i className="pi pi-trash"/></button>
                {/*<Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => confirmDeleteProduct(rowData)} />*/}
                {/*<Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />*/}
            </React.Fragment>
        );
    }

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteAction}/>
        </React.Fragment>
    );
    const headerDataTable = renderHeader();
    const yearList = renderYear();
    const dayList = renderDay();
    const userLogin = sessionStorage.usn;
    console.log(sessionStorage.usn);
    return (
        <div className="datatable-crud-demo">
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card">
                        {/*<h4>Default</h4>*/}
                        {/*<div className="datatable-doc-demo">*/}
                        {/*    <DataTable ref={dt} value={customers}*/}
                        {/*               header={headerDataTable} className="p-datatable-customers" dataKey="id" rowHover globalFilter={globalFilter}*/}
                        {/*               selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}*/}
                        {/*               paginator rows={10} emptyMessage="No customers found" currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi"*/}
                        {/*               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}>*/}
                        {/*        <Column selectionMode="multiple" style={{ width: '3em' }} />*/}
                        {/*        <Column field="name" header="Name" body={nameBodyTemplate} sortable filterPlaceholder="Search by name" />*/}
                        {/*        <Column sortField="country.name" filterField="country.name" header="Country" body={countryBodyTemplate} sortable filterMatchMode="contains" />*/}
                        {/*        <Column sortField="representative.name" filterField="representative.name" header="Representative" body={representativeBodyTemplate} sortable />*/}
                        {/*        <Column field="date" header="Date" body={dateBodyTemplate} sortable filterMatchMode="custom"/>*/}
                        {/*        <Column field="status" header="Status" body={statusBodyTemplate} sortable />*/}
                        {/*        <Column field="activity" header="Activity" body={activityBodyTemplate} sortable filterMatchMode="gte" filterPlaceholder="Minimum" />*/}
                        {/*    </DataTable>*/}
                        {/*</div>*/}

                        <h4>{userLogin}</h4>
                        <div className="datatable-doc-demo">
                            <DataTable ref={dt} value={employees}
                                       header={headerDataTable} className="p-datatable-customers" dataKey="id" rowHover globalFilter={globalFilter}
                                       selection={selectedEmployees} onSelectionChange={e => setSelectedEmployees(e.value)}
                                       paginator rows={10} emptyMessage="No customers found" currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi"
                                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}>
                                <Column selectionMode="multiple" style={{width: '3em'}}/>
                                <Column field="id" header="ID" sortable/>
                                <Column field="name" header="Name" sortable/>
                                <Column filed="gender" header="Gender"/>
                                <Column field="birthday" header="Birthday"/>
                                <Column field="address" header="Address"/>
                                <Column body={actionBodyTemplate}/>

                            </DataTable>
                        </div>
                    </div>
                </div>

            </div>
            <dialog className="nes-dialog is-rounded" id="dialog-rounded" open={deleteDialog}>

                <form method="dialog">
                    <p className="nes-text">Rounded dialog</p>
                    <p className="nes-text">Alert: this is a dialog.</p>
                    <menu className="dialog-menu">
                        <button className="nes-btn is-error" onClick={hideDialog}><span className="nes-text">Cancel</span></button>
                        &nbsp;&nbsp;&nbsp;
                        <button className="nes-btn is-success" onClick={deleteAction}><span className="nes-text">OK</span></button>
                    </menu>
                </form>
            </dialog>
            <Dialog visible={showDialog} style={{width: '450px'}} header="Profile Details" modal
                    className="p-fluid" footer={dialogFooter} onHide={hideDialog}
                    contentStyle={{backgroundColor: "#ffdeee"}}
            >
                {<img src={`assets/thuxuan_v.jpg`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className="product-image"/>}
                <div className="p-field">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                        <span className="p-float-label">
                            <InputText id="name" value={nameState} required autoFocus onChange={e => onInputChange(e, 'name')}/>
                            <label htmlFor="name">Name</label>

                            {/*{submitted && !product.name && <small className="p-invalid">Name is required.</small>}*/}
                        </span>
                    </div>
                </div>
                <div className="p-field">
                    <label htmlFor="birthday">Birthday</label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon"><i className="pi pi-calendar"></i></span>
                        <Calendar id="birthday" dateFormat="dd/mm/yy" onChange={e => onInputChange(e, 'birthday')}/>
                    </div>
                </div>

                <div className="p-field">
                    <label className="p-mb-3">Gender</label>
                    <div className="p-formgrid p-grid">
                        <div className="p-field-radiobutton p-col-4">
                            <RadioButton inputId="category1" name="gender" value="1" checked={genderState === '1'} onChange={e => onInputChange(e, 'gender')}/>
                            <label htmlFor="category1">Male</label>
                        </div>
                        <div className="p-field-radiobutton p-col-4">
                            <RadioButton inputId="category2" name="gender" value="2" checked={genderState === '2'} onChange={e => onInputChange(e, 'gender')}/>
                            <label htmlFor="category2">Female</label>
                        </div>
                        <div className="p-field-radiobutton p-col-4">
                            <RadioButton inputId="category3" name="gender" value="3" checked={genderState === '3'} onChange={e => onInputChange(e, 'gender')}/>
                            <label htmlFor="category3">Other</label>
                        </div>
                    </div>
                </div>

                <div className="p-formgrid p-grid">
                    <div className="p-field p-col">
                        <label htmlFor="province">Province</label>
                        <Dropdown value={provinceState} options={province} placeholder="Select" onChange={e => onInputChange(e, 'province')}/>
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="city">City</label>
                        <Dropdown value={cityState} options={city} placeholder="Select City" onChange={e => onInputChange(e, 'city')}/>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={showNesDialog} style={{width: '450px'}} header="Profile Nes" modal
                    className="p-fluid nes-ui" footer={dialogNesFooter} onHide={hideDialog}
                    contentStyle={{backgroundColor: "#ffdeee"}}
            >
                {/*{<img src={`assets/thuxuan_v.jpg`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className="product-image"/>}*/}
                <div className="icon-image">
                    <i className="nes-charmander"/>
                </div>
                <div className="nes-field">
                    <label className="nes-text" htmlFor="inline_field">Name</label>
                    <input type="text" id="inline_field" className="nes-input is-success" placeholder="Enter name"
                           onChange={e => onInputChange(e, 'name')}
                    />
                </div>

                <div className="nes-field">
                    <label className="nes-text" htmlFor="warning_field">Birthday</label>
                    <input type="text" id="warning_field" className="nes-input is-warning" readOnly value={birthdayDefault}/>
                </div>
                <div className="p-grid">
                    <div className="p-col-4">
                        <label className="nes-text" htmlFor="default_select">Month</label>
                        <div className="nes-select">
                            <select required id="month_select" onChange={e => onInputChange(e, 'month')}>
                                <option value="" disabled selected hidden>Select...</option>
                                <option value="01">January</option>
                                <option value="02">February</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-col-4">
                        <label className="nes-text" htmlFor="default_select">Day</label>
                        <div className="nes-select">
                            <select required id="day_select" disabled={!monthState} onChange={e => onInputChange(e, 'day')}>
                                <option value="" disabled selected hidden>Select...</option>
                                {dayList}
                            </select>
                        </div>
                    </div>
                    <div className="p-col-4">
                        <label className="nes-text" htmlFor="default_select">Year</label>
                        <div className="nes-select">
                            <select required id="year_select" onChange={e => onInputChange(e, 'year')}>
                                <option value="" disabled selected hidden>Select...</option>
                                {yearList}
                            </select>
                        </div>
                    </div>
                </div>

                <label className="nes-text" htmlFor="gender-select">Gender</label>
                <div id="gender-select">
                    <label className="nes-gender">
                        <input type="radio" className="nes-radio" name="answer" value="1" onChange={e => onInputChange(e, 'gender')}/>
                        <span>Male</span>
                    </label>
                    <label className="nes-gender">
                        <input type="radio" className="nes-radio" name="answer" value="2" onChange={e => onInputChange(e, 'gender')}/>
                        <span>Female</span>
                    </label>
                    <label className="nes-gender">
                        <input type="radio" className="nes-radio" name="answer" value="3" onChange={e => onInputChange(e, 'gender')}/>
                        <span>Or..</span>
                    </label>
                </div>

                <div>
                    <label className="nes-text" htmlFor="textarea_field">Address</label>
                    <textarea id="textarea_field" className="nes-textarea" onChange={e => onInputChange(e, 'city')}/>
                </div>
            </Dialog>
            <Dialog visible={null} style={{width: '450px'}} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {<span>Are you sure you want to delete the product(s)?</span>}
                </div>
            </Dialog>
        </div>
    )
}
