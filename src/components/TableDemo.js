import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomerService } from '../service/CustomerService';
import './TableDemo.scss';
import './../layout/flags/flags.css'
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import * as XLSX from "xlsx";


export function TableDemo() {

    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const isMounted = useRef(false);
    const customerService = new CustomerService();

    useEffect(() => {
        isMounted.current = true;
        customerService.getCustomersMedium().then(data => {
            setCustomers(data)
        });
    }, []);

    const renderHeader = () => {
        return (
            <div className="table-header">
                List of Customers                    
                
                <span>
                    <Button onClick={exportData}>Export Excel</Button> 
                    &nbsp;&nbsp;&nbsp;
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search" />
                    </span>
                </span>
            </div>
        );
    }

    const activityBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={rowData.activity} showValue={true} />
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
        let { name, code } = rowData.country;

        return (
            <React.Fragment>
                <span className="p-column-title">Country</span>
                <span class={"flag flag-"+ code} style={{width: "28px", height: "19px"}}></span>
                <span style={{ verticalAlign: 'middle', marginLeft: '.5em' }}>{name}</span>
            </React.Fragment>
        );
    }

    const representativeBodyTemplate = (rowData) => {
        const src = "assets/demo/images/avatar/" + rowData.representative.image;

        return (
            <React.Fragment>
                <span className="p-column-title">Representative</span>
                <img alt={rowData.representative.name} src={src} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle', marginLeft: '.5em' }}>{rowData.representative.name}</span>
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

    const headerDataTable = renderHeader();

    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card">
                    <h4>Default</h4>
                    <div className="datatable-doc-demo">
                        <DataTable ref={dt} value={customers}
                            header={headerDataTable} className="p-datatable-customers" dataKey="id" rowHover globalFilter={globalFilter}
                            selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                            paginator rows={10} emptyMessage="No customers found" currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}>
                            <Column selectionMode="multiple" style={{ width: '3em' }} />
                            <Column field="name" header="Name" body={nameBodyTemplate} sortable filterPlaceholder="Search by name" />
                            <Column sortField="country.name" filterField="country.name" header="Country" body={countryBodyTemplate} sortable filterMatchMode="contains" />
                            <Column sortField="representative.name" filterField="representative.name" header="Representative" body={representativeBodyTemplate} sortable />
                            <Column field="date" header="Date" body={dateBodyTemplate} sortable filterMatchMode="custom"/>
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                            <Column field="activity" header="Activity" body={activityBodyTemplate} sortable filterMatchMode="gte" filterPlaceholder="Minimum" />
                        </DataTable>
                    </div>
                </div>
            </div>
           
        </div>
    )
}