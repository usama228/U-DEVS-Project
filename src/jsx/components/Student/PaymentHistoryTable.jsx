import React,{useState} from 'react';
import {Link} from 'react-router-dom';


const tableData = [
    {date:'03 March 2023', amount:'50,036', status:'Complete'},
    {date:'07 May 2023', amount:'40,010', status:'Canceled'},
    {date:'05 Apr 2023', amount:'30,050', status:'Complete'},
    {date:'10 June 2023', amount:'20,070', status:'Canceled'},
    {date:'03 March 2023', amount:'50,036', status:'Complete'},
    {date:'07 May 2023', amount:'40,010', status:'Canceled'},
    {date:'05 Apr 2023', amount:'30,050', status:'Complete'},
    {date:'10 June 2023', amount:'20,070', status:'Canceled'},
    {date:'05 July 2023', amount:'30,050', status:'Complete'},
];

const PaymentHistoryTable = () => {
    const [currentPage , setCurrentPage] = useState(1);  
    const recordsPage = 6;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;   
    const records = tableData.slice(firstIndex, lastIndex);
    const npage = Math.ceil(tableData.length / recordsPage)
    const number = [...Array(npage + 1).keys()].slice(1)
    function prePage (){
        if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
        }
    }
    function changeCPage (id){
        setCurrentPage(id);
    }
    function nextPage (){
        if(currentPage !== npage){
            setCurrentPage(currentPage + 1)
        }
    }
    return (
        
        <div className="table-responsive basic-tbl">
            <div id="example-payment_wrapper" className="dataTables_wrapper no-footer">
                <table id="example-payment" className="display w-100 dataTable" >
                    <thead>
                        <tr>
                            <th>Payment Number</th>
                            <th>Date & Time</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((item, ind)=>(
                            <tr key={ind}>
                                <td>
                                    <div className="d-flex align-items-center">	
                                        <div className="icon-box  icon-box-sm bg-danger">
                                            <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M25.0004 1.33333C25.013 1.24043 25.013 1.14624 25.0004 1.05333C24.9888 0.975052 24.9664 0.898765 24.9337 0.826666C24.8985 0.761503 24.8584 0.699103 24.8137 0.64C24.763 0.555671 24.7001 0.479292 24.6271 0.413333L24.4671 0.32C24.3901 0.262609 24.3046 0.21762 24.2137 0.186666H23.9471C23.8658 0.107993 23.7709 0.0447434 23.6671 0H17.0004C16.6468 0 16.3076 0.140476 16.0576 0.390525C15.8075 0.640573 15.6671 0.979711 15.6671 1.33333C15.6671 1.68696 15.8075 2.02609 16.0576 2.27614C16.3076 2.52619 16.6468 2.66667 17.0004 2.66667H20.7737L15.4404 8.94667L9.68039 5.52C9.40757 5.35773 9.0858 5.29813 8.77296 5.3519C8.46011 5.40567 8.17671 5.56929 7.97373 5.81333L1.30706 13.8133C1.19479 13.9481 1.1102 14.1036 1.05815 14.2711C1.00609 14.4386 0.987577 14.6147 1.00368 14.7893C1.01978 14.9639 1.07017 15.1337 1.15198 15.2888C1.23378 15.4439 1.34538 15.5814 1.48039 15.6933C1.72028 15.8921 2.02219 16.0006 2.33373 16C2.52961 16.0003 2.72315 15.9575 2.9006 15.8745C3.07804 15.7915 3.23503 15.6705 3.36039 15.52L9.29373 8.4L14.9871 11.8133C15.2571 11.9735 15.575 12.0332 15.8848 11.982C16.1945 11.9308 16.4763 11.7719 16.6804 11.5333L22.3337 4.93333V8C22.3337 8.35362 22.4742 8.69276 22.7242 8.94281C22.9743 9.19286 23.3134 9.33333 23.6671 9.33333C24.0207 9.33333 24.3598 9.19286 24.6099 8.94281C24.8599 8.69276 25.0004 8.35362 25.0004 8V1.33333Z" fill="#FCFCFC"/>
                                            </svg>
                                        </div>	
                                        <div className="ms-3">
                                            <h6 className="mb-0 font-w600">#{ind+12345678}</h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span>{item.date}, 13:45 PM</span>
                                </td>
                                <td>
                                    <span className="doller font-w600"> $ {item.amount}</span>
                                </td>
                                <td className="pe-3">
                                    <span className={`font-w600 text-${item.status === "Canceled" ? 'danger' : 'success'} `}>{item.status}</span>
                                </td>
                            </tr>
                        ))}                                        
                    </tbody>
                </table>
                <div className="d-sm-flex text-center justify-content-between align-items-center">                           
                    <div className='dataTables_info'>
                        Showing {lastIndex-recordsPage + 1} to{" "}
                        {tableData.length < lastIndex ? tableData.length : lastIndex}
                        {" "}of {tableData.length} entries
                    </div>
                    <div
                        className="dataTables_paginate paging_simple_numbers justify-content-center"
                        id="example-student_wrapper"
                    >
                        <Link
                            className="paginate_button previous disabled"
                            to="#"                                        
                            onClick={prePage}
                        >
                            <i className="fa-solid fa-angle-left" />
                        </Link>
                        <span>                                      
                            {number.map((n , i )=>(
                                <Link className={`paginate_button ${currentPage === n ? 'current' :  '' } `} key={i}                                            
                                    onClick={()=>changeCPage(n)}
                                > 
                                    {n}                                                

                                </Link>
                            ))}
                        </span>
                        <Link
                            className="paginate_button next"
                            to="#"                                        
                            onClick={nextPage}
                        >
                            <i className="fa-solid fa-angle-right" />
                        </Link>
                    </div>
                </div>   
            </div>
        </div>
    );
};

export default PaymentHistoryTable;