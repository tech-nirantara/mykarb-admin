/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button, Switch, TextField } from "@mui/material";
import { get, del } from "@/utils/api";
import DataGridWrapper from "@/utils/dataGridWrapper.jsx";
import styles from "@/styles/onboarding.module.css";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Form from "../component/Company/CompanyForm.jsx";
import Layout from "../layout/Layout.jsx";
import DeleteConfirmationDialog from "../layout/DeleteConfirmationDialog.jsx";

const CompanyOnboarding = () => {
  const [companies, setCompanies] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountMode, setAccountMode] = useState("Demo");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 500); // Debounce delay of 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [page, pageSize, searchQuery, accountMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await get(
        `api/admin/getAllCompanies?page=${
          page + 1
        }&limit=${pageSize}&search=${searchQuery}&accountMode=${accountMode}`
      );
      setCompanies(data?.data?.data);
      setRowCount(data?.data?.totalCount);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    setPage(0); // Reset to the first page when searching
  };

  const handleAddClick = (formOpen) => {
    setSelectedCompany(null); // Clear any selected company
    setFormOpen(!formOpen);
    setEditData(null); // Reset form data when adding a new company
  };

  const handleUpdateClick = (params) => {
    setSelectedCompany(params.row); // Set the selected company's data
    setEditData(params.row);
    setFormOpen(true);
  };

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCompany?._id) return;

    try {
      setLoading(true);
      await del(`api/admin/deleteCompany?Id=${selectedCompany._id}`);
      setCompanies(companies.filter((c) => c._id !== selectedCompany._id));
      setOpenDeleteDialog(false);
      setSelectedCompany(null);
      loadData(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedCompany(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditData(null);
    setSelectedCompany(null);
  };

  const columns = [
    { field: "companyName", headerName: "Company Name", flex: 3 },
    { field: "industry", headerName: "Industry", flex: 3 },
    { field: "companyAddress", headerName: "Company Address", flex: 3 },
    { field: "gstNumber", headerName: "GST Number", flex: 2 },
    {
      field: "active",
      headerName: "Active",
      flex: 1.25,
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row?.active}
            onChange={() => handleDeleteClick(params.row)}
            color="primary"
          />
        );
      },
    },

    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          key={`update-${params.id}`}
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleUpdateClick(params)}
        />,
        // <GridActionsCellItem
        //   key={`delete-${params.id}`}
        //   icon={<DeleteIcon />}
        //   label="Delete"
        //   onClick={() => handleDeleteClick(params.row)}
        // />,
      ],
    },
  ];

  const rows = companies?.map((company) => ({
    id: company._id,
    ...company,
  }));

  const handleSuccess = () => {
    loadData();
  };

  return (
    <>
      <Layout>
        <Box className={styles.heading_container}>
          <p className={styles.heading}>Company List</p>
          {!formOpen && (
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: "300px" }}
            />
          )}
        </Box>

        <Box
          className={styles.button_container}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* {!formOpen && (
            <Box display="flex" gap={2}>
              <Button
                variant={accountMode === "Demo" ? "contained" : "outlined"}
                sx={{
                  backgroundColor:
                    accountMode === "Demo" ? "#1c486b" : "transparent",
                  color: accountMode === "Demo" ? "#fff" : "#1c486b",
                  textTransform: "none",
                  border: "",
                }}
                onClick={() => setAccountMode("Demo")}
              >
                Demo
              </Button>
              <Button
                variant={accountMode === "Live" ? "contained" : "outlined"}
                sx={{
                  backgroundColor:
                    accountMode === "Live" ? "#1c486b" : "transparent",
                  color: accountMode === "Live" ? "#fff" : "#1c486b",
                  textTransform: "none",
                }}
                onClick={() => setAccountMode("Live")}
              >
                Live
              </Button>
            </Box>
          )} */}

          {/* Right side button */}
          <Button
            variant="contained"
            onClick={() => handleAddClick(formOpen)}
            endIcon={formOpen ? <VisibilityIcon /> : <AddIcon />}
            sx={{ backgroundColor: "#1c486b", textTransform: "none" }}
          >
            {formOpen ? "View Company" : "Add Company"}
          </Button>
        </Box>

        {formOpen ? (
          <Form
            editData={editData}
            onClose={handleFormClose}
            onSuccess={handleSuccess}
          />
        ) : (
          <DataGridWrapper
            rows={rows}
            columns={columns}
            loading={loading}
            paginationModel={{ page, pageSize }}
            onPaginationChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            rowCount={rowCount}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={loading}
          heading={
            (selectedCompany?.active ? "Deactivate" : "Activate") + " Company ?"
          }
          subHeading={`Are you sure you want to ${
            selectedCompany?.active ? "deactivate" : "activate"
          } ${selectedCompany?.companyName}?`}
          buttonText={selectedCompany?.active ? "Deactivate" : "Activate"}
        />
      </Layout>
    </>
  );
};

export default CompanyOnboarding;
