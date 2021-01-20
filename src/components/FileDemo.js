import React, { useRef, useState, useEffect } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from "xlsx";
import { EventService } from '../service/EventService';
import './FileDemo.scss'
import { Card } from 'primereact/card';

export function FileDemo() {

    const toast = useRef(null);
    const [dataTable, setDataTable] = useState(null)
    const [file, setFile] = useState(null)

    const eventService = new EventService();

    const onUpload = (e) => {
        console.log(e)
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }
    const onRemove = (e) => {
        setFile(null);
        setDataTable(null);
    }
    const onClear = (e) => {
        setFile(null);
        setDataTable(null);
    }

    const onCheckFile = (f) => {
        if (f && f.name && !f.name.endsWith('.xlsx')) {
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'Please select Excel file to upload.' });
        }
    }

    const onBasicUpload = (e) => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }
    
    const onSelected = (e) => {
        toast.current.show({ severity: 'info', summary: 'Selected', detail: 'Excel file was selected.' });
        const f = e.files[0];
        setFile(f);
        if (f && f.name && f.name.endsWith('.xlsx')) {
            var reader = new FileReader();
            reader.onload = (e) => {
                var data = e.target.result;
                var workbook = XLSX.read(data, {type: 'binary'});
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Sheet1']);
                var json_object = JSON.stringify(XL_row_object);
                console.log(XL_row_object);
                setDataTable(XL_row_object);
            };
            reader.onerror = function(ex) {
                console.log(ex);
            };
            reader.readAsBinaryString(f);
            console.log(reader);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'Please select Excel file to upload.' });
        }
       
    }

    const renderColumns = (dataTable && Object.keys(dataTable[0]).map(item => {
            return <Column field={item} header={item && item.toUpperCase()} sortable/>
       }));
    
    return (
        <div>
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card">
                        <h5>Advanced</h5>
                        <FileUpload maxFileSize={1000000}
                            emptyTemplate={<p className="p-m-0"></p>} 
                            customUpload uploadHandler={onUpload} onSelect={onSelected} multiple={false} accept=".xlsx"
                            emptyTemplate={<p className="p-m-0">Drag and drop files to here to upload.</p>}
                            onValidationFail={onCheckFile} onRemove={onRemove} onClear={onClear}
                            />
                        <br/>
                        {dataTable && <Card>
                                        <DataTable value={dataTable}
                                         paginator rows={10} currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi"
                                        >
                                        {renderColumns}
                                        </DataTable>
                                     </Card>
                        }
                        <h5>Basic</h5>
                        <FileUpload mode="basic" maxFileSize={1000000} customUpload uploadHandler={onBasicUpload}
 />
                    </div>
                </div>
            </div>
        </div>
    )
}