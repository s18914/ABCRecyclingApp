import React from 'react'
import DataTable from 'react-data-table-component'

export default function Table(columns, data) {
    return (
      <DataTable
        title="Lista transportów"
        columns={columns}
        data={data}
      />
    );
}