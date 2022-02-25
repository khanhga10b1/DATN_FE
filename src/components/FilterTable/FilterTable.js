import React from 'react';
import '../../scss/components/_table.scss';
class FilterTable extends React.Component {
  state = {
    nCol: 7
  };
  render() {
    const content =this.props.tableData

    return (
      <div className="row TableComponent">
          <table
            className="table table-bordered table-hover"
            id="personal-pto-request-table">
            <thead>
              <tr>
                {
                  this.props.head.map((head,index) => 
                <th key = {index} className="text-center">{head}</th>
                    )
                }              
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
      </div>
    );
  }
}

export default FilterTable;
