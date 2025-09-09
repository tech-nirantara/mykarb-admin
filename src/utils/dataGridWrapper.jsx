import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataGridWrapper = ({ 
  rows = [], 
  columns = [], 
  loading = false, 
  paginationModel = { page: 0, pageSize: 10 },
  onPaginationChange,
  rowCount = 0,
  ...props 
}) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        pageSizeOptions={[5, 10, 25, 50]}
        rowCount={rowCount}
        paginationMode="server"
        disableRowSelectionOnClick
        {...props}
      />
    </div>
  );
};

export default DataGridWrapper;