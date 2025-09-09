/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";
// import styles from "/styles/onboarding.module.css";
import styles from "../../styles/onboarding.module.css";
import { toast } from "react-hot-toast";
import { get, post, put } from "../../utils/api";
import {
  countries,
  industryOptions,
  europeanCountries,
  newCounties,
  currencyOptions,
  paymentStatusList,
  accountMode,
  PaymentMethods,
} from "../../utils/constant";


import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ImageUploader from "../uploadFile/ImageUploader.jsx";
import EmailField from "../common/EmailField";
import GoogleMapsAutocomplete from "../common/GoogleMapsAutocomplete";
const Form = ({ editData, onClose, onSuccess }) => {

  const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    return false;
  }; // const isValidPhone = (number) => /^[6-9]\d{9}$/.test(number);
  const isValidPhone = (number) =>
    /^[0-9]\d{9}$/.test(number) && !/^(\d)\1{9}$/.test(number);

  const initialState = [
    {
      companyName: "",
      industry: null,
      country: null,
      companyAddress: "",
      registrationNumber: "",
      gstNumber: "",
      admin: {
        name: "",
        email: "",
        countryId: "IN",
        countryCode: "+91 - India",
        phone: "",
      },
      countryCode: "+91 - India",
      countryId: "IN",
      contactNumber: "",
      companyImage: "",
      paymentStatus: "",
      paymentAmount: "",
      paymentCurrency: "",
    },
  ];

  const [companyForm, setCompanyForm] = useState([{}]);

  const [form, setForm] = useState({
    companyType: "Individual",
    groupCompanyId: null,
    companyName: "",
    industry: null,
    country: null,
    companyAddress: "",
    registrationNumber: "",
    gstNumber: "",
    admin: {
      name: "",
      email: "",
      countryId: "IN",
      countryCode: "+91 - India",
      phone: "",
    },
    countryCode: "+91 - India",
    countryId: "IN",
    contactNumber: "",
    companyImage: "",
    paymentStatus: "",
    paymentAmount: "",
    paymentCurrency: "",
    email: "",
    accountMode: null,
    paymentMethod: null,
  });

  const [errors, setErrors] = useState({});
  const [verifybtn, setverifybtn] = useState({ email: false, phone: false });
  const [verify, setVerify] = useState({
    phone: false,
    email: false,
    emailMsg: "",
    phoneMsg: "",
  });
  const [TaskAltIcons, setTaskAltIcons] = useState({
    adminPhone: false,
    phone: false,
    email: false,
  });
  const [groupCompanies, setGroupCompanies] = useState([]);

  const [regex, setRegex] = useState({
    gstRegex: null,
    registrationRegex: null,
    key1: "GST/VAT/TIN Number",
    key2: "Registration Number",
  });

  useEffect(() => {
    const { gstRegex, registrationRegex, key1, key2 } = getRegexForCountry(
      form?.country
    );
    setRegex({ gstRegex, registrationRegex, key1, key2 });
  }, [form.country]);

  // console.log(companyForm,"888888888888888888")
  useEffect(() => {
    if (editData && groupCompanies.length > 0) {
      setForm({
        companyType: editData?.companyType || "Individual",
        groupCompanyId: editData?.groupCompanyId || null,
        companyName: editData?.companyName || "",
        industry: editData?.industry || null,
        accountMode: editData?.accountMode || null,
        country: editData?.country || null,
        companyAddress: editData?.companyAddress || "",
        registrationNumber: editData?.registrationNumber || "",
        gstNumber: editData?.gstNumber || "",
        admin: {
          name: editData?.admin?.name || "",
          countryId: editData?.admin?.countryId || "IN",
          countryCode: editData?.admin?.countryCode || "+91 - India",
          phone: editData?.admin?.phone || "",
        },
        email: editData?.email || "",
        countryCode: editData?.countryCode || "+91 - India",
        countryId: editData?.countryId || "IN",
        contactNumber: editData?.contactNumber || "",
        companyImage: editData?.companyImage || "", // You can set this if needed
        paymentStatus:
          editData?.onboardingPayment === true ? "paid" : "pending",
        paymentAmount: editData?.paymentAmount || "",
        paymentCurrency: editData?.paymentCurrency || "",
        paymentMethod: editData?.paymentMethod || null,
      });
      if (editData?.email) {
        setTaskAltIcons((prev) => ({
          ...prev,
          email: true,
        }));
      }
    }
  }, [editData, groupCompanies]);

  useEffect(() => {
    const fetchGroupCompanies = async () => {
      const data = await get("/api/group/company/groupCompanyDropdown");
      if (data?.data?.status == true) {
        setGroupCompanies(data.data.data);
      } else {
        console.error("Failed to fetch group companies");
      }
    };

    fetchGroupCompanies();
  }, []);

  // useEffect(() => {
  //   if (!editData) {
  //     setCompanyForm(initialState);
  //   }
  // }, [form?.companyType, editData]);

  const getRegexForCountry = (selectedCountryName) => {
    const allCountries = europeanCountries.flat();
    const countryInfo = allCountries.find(
      (country) =>
        country?.countryName?.toLowerCase() ===
        (selectedCountryName?.toLowerCase() || "")
    );

    if (!countryInfo) {
      return {
        gstRegex: null,
        registrationRegex: null,
        key1: "GST/VAT/TIN Number",
        key2: "Registration Number",
        gstMaxLength: 20,
        registrationMaxLength: 20,
      };
    }

    // Function to calculate max length from regex
    const getMaxLengthFromRegex = (regexStr) => {
      if (!regexStr) return 20;

      // Handle simple {x} patterns
      const exactMatch = regexStr.match(/\{(\d+)\}/);
      if (exactMatch) return parseInt(exactMatch[1]);

      // Handle {x,y} patterns
      const rangeMatch = regexStr.match(/\{(\d+),\d*\}/);
      if (rangeMatch) return parseInt(rangeMatch[1]);

      if (regexStr.includes("^\\d{15}$")) return 15;
      if (regexStr.includes("^\\d{10}$")) return 10;
      if (regexStr.includes("^\\d{9}$")) return 9;

      // Default fallback
      return 20;
    };

    return {
      gstRegex: countryInfo.key1regex
        ? new RegExp(countryInfo.key1regex)
        : null,
      registrationRegex: countryInfo.key2regex
        ? new RegExp(countryInfo.key2regex)
        : null,
      key1: countryInfo.key1 || "GST/VAT/TIN Number",
      key2: countryInfo.key2 || "Registration Number",
      gstMaxLength: getMaxLengthFromRegex(countryInfo.key1regex),
      registrationMaxLength: getMaxLengthFromRegex(countryInfo.key2regex),
    };
  };

  const handleCommonChange = (eventOrValue, fieldPath) => {
    let value;

    if (eventOrValue && eventOrValue.target) {
      value = eventOrValue.target.value;

      if (fieldPath === "contactNumber" || fieldPath === "admin.phone") {
        value = value.replace(/\D/g, "");
        if (value.length > 10) {
          value = value.substring(0, 10);
        }
      }
    } else {
      value = eventOrValue;
    }

    setForm((prevForm) => {
      const updatedForm = JSON.parse(JSON.stringify(prevForm));
      const keys = fieldPath.split(".");
      let temp = updatedForm;
      for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]];
      }
      temp[keys[keys.length - 1]] = value;

      if (fieldPath === "country") {
        updatedForm.gstNumber = "";
        updatedForm.registrationNumber = "";
      }

      return updatedForm;
    });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (fieldPath.includes(".")) {
        const [parent, child] = fieldPath.split(".");
        if (newErrors[parent]) {
          delete newErrors[parent][child];
        }
      } else {
        delete newErrors[fieldPath];
      }

      if (fieldPath === "country") {
        delete newErrors.gstNumber;
        delete newErrors.registrationNumber;
      }

      return newErrors;
    });
  };

  const handleLocationChange = (value, fieldName) => {
    setForm((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value?.name,
    }));
    // setCoordinates((prevCoordinates) => ({
    //   ...prevCoordinates,
    //   [fieldName === "source" ? "origin" : fieldName]: value?.location,
    // }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    const { email } = form;

    if (!form?.companyType) {
      newErrors.isGroupCompany = "Company Type is required";
    }

    if (form?.companyType === "Group" && !form.groupCompanyId) {
      newErrors.groupCompanyId = "Group Company is required";
    }

    if (isEmpty(form.companyName)) {
      newErrors.companyName = "Company Name is required";
    }

    if (isEmpty(form.industry)) {
      newErrors.industry = "Industry is required";
    }
    if (isEmpty(form.accountMode)) {
      newErrors.accountMode = "AccountMode is required";
    }

    if (isEmpty(form.country)) {
      newErrors.country = "Country is required";
    }

    if (isEmpty(form.registrationNumber)) {
      newErrors.registrationNumber = "Registration Number is required";
    }
    // else if (
    //   regex.registrationRegex &&
    //   !regex.registrationRegex.test(form.registrationNumber)
    // ) {
    //   newErrors.registrationNumber = "Invalid Registration Number format";
    // }

    if (isEmpty(form.gstNumber)) {
      newErrors.gstNumber = "GST Number is required";
    }

    // if (isEmpty(form.companyAddress)) {
    //   newErrors.companyAddress = "Address is required";
    // }

    if (isEmpty(form.contactNumber) || !isValidPhone(form.contactNumber)) {
      newErrors.contactNumber = "Valid phone number is required";
    }

    if (isEmpty(form?.paymentStatus)) {
      newErrors.paymentStatus = "Payment Status is required";
    }

    if (form?.paymentStatus === "pending" && isEmpty(form?.paymentAmount)) {
      newErrors.paymentAmount = "Payment Amount is required";
    }

    if (form?.paymentStatus === "pending" && isEmpty(form?.paymentCurrency)) {
      newErrors.paymentCurrency = "Payment Currency is required";
    }
    if (form?.paymentStatus === "pending" && isEmpty(form?.paymentMethod)) {
      newErrors.paymentMethod = "Payment Mode is required";
    }

    if (isEmpty(form.admin?.name)) {
      newErrors.admin = { ...newErrors.admin, name: "Admin name is required" };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      newErrors.email = "Email Required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (!TaskAltIcons.email) {
      if (verify.email) {
        setVerify((prev) => ({ ...prev, emailMsg: "OTP is required" }));
      }
      if (errors.email) {
        newErrors.email = "Email already registered.";
      } else {
        newErrors.email = "Email Verification Required.";
      }
    }

    if (isEmpty(form.admin?.phone) || !isValidPhone(form.admin.phone)) {
      newErrors.admin = {
        ...newErrors.admin,
        phone: "Valid admin phone is required",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      let response;
      const payload = {
        ...form,
      };
      if (editData && editData._id) {
        response = await put(
          `/api/admin/updateCompany?Id=${editData._id}`,
          payload
        );
      } else {
        response = await post("/api/admin/addCompany", payload);
      }

      if (
        response?.data?.statusCode === 1 ||
        response?.response === "Success"
      ) {
        toast.success(
          editData
            ? "Company updated successfully"
            : "Company added successfully"
        );
        setTimeout(() => {
          onClose();
          onSuccess();
        }, 1000);
      } else {
        const errorData = response?.message;
        console.log("Error Data:", errorData);
        if (Array.isArray(errorData?.commonKeyMsg)) {
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            errorData.commonKeyMsg.forEach(({ key, msg }) => {
              if (key.includes(".")) {
                const keys = key.split(".");
                if (!newErrors[keys[0]]) {
                  newErrors[keys[0]] = {};
                }
                newErrors[keys[0]][keys[1]] = msg;
              } else {
                newErrors[key] = msg;
              }
            });
            return newErrors;
          });
        } else if (errorData?.errorKey && errorData?.message) {
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            const key = errorData.errorKey;
            if (key.includes(".")) {
              const keys = key.split(".");
              if (!newErrors[keys[0]]) {
                newErrors[keys[0]] = {};
              }
              newErrors[keys[0]][keys[1]] = errorData.message;
            } else {
              newErrors[key] = errorData.message;
            }
            return newErrors;
          });
        } else if (errorData.statusCode === 0) {
          toast.error(errorData?.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.log("❌ Error in submit:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  const handleCompanyTypeChange = (e) => {
    const newCompanyType = e.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      companyType: newCompanyType,
      groupCompanyId:
        newCompanyType === "Group" ? prevForm.groupCompanyId : null,
    }));

    // Only reset form if NOT in edit mode
    if (!editData) {
      setCompanyForm(initialState);
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.isGroupCompany;
      return newErrors;
    });
  };

  const handleImageUpload = async (file) => {
    try {
      setForm((prev) => ({ ...prev, companyImage: file }));
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleDeleteImage = () => {
    setForm((prev) => ({ ...prev, companyImage: "" }));
  };

  return (
    <div style={{ width: "100%" }}>
      <Box className={styles.heading_container}>
        <p className={styles.heading}>
          {editData ? "Edit Company" : "Add Company"}
        </p>
      </Box>

      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <TextField
            select
            fullWidth
            label="Company Type"
            value={form?.companyType}
            onChange={handleCompanyTypeChange}
            required
            error={!!errors.isGroupCompany}
            helperText={errors.isGroupCompany}
          >
            <MenuItem value="">Select Company Type</MenuItem>
            <MenuItem value="Group">Group Company</MenuItem>
            <MenuItem value="Individual">Individual Company</MenuItem>
          </TextField>

          {form?.companyType === "Group" ? (
            <Autocomplete
              fullWidth
              options={groupCompanies}
              value={
                groupCompanies.find(
                  (company) => company._id === form.groupCompanyId
                ) || null
              }
              getOptionLabel={(option) => option.groupName}
              onChange={(event, newValue) => {
                setForm((prev) => ({
                  ...prev,
                  groupCompanyId: newValue?._id || null,
                }));
                setErrors((prev) => ({
                  ...prev,
                  groupCompanyId: newValue ? "" : "Group Company is required",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Group Company"
                  placeholder="Select Group Company"
                  required
                  name="groupCompanyId"
                  error={!!errors.groupCompanyId}
                  helperText={errors.groupCompanyId}
                />
              )}
            />
          ) : null}
        </div>

        <div style={{ marginTop: "1rem" }}>
          <Typography variant="h6" gutterBottom>
            Company Details
          </Typography>

          <div
            style={{
              // padding: "1rem",
              // border: "1px solid red",
              marginBottom: "1rem",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={form?.companyName}
                  onChange={(e) => handleCommonChange(e, "companyName")}
                  required
                  error={!!errors?.companyName}
                  helperText={errors?.companyName}
                />
                <Autocomplete
                  options={industryOptions.sort()}
                  value={form?.industry || null}
                  onChange={(e, value) => handleCommonChange(value, "industry")}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Industry"
                      required
                      error={!!errors?.industry}
                      helperText={errors?.industry}
                    />
                  )}
                />

                <Autocomplete
                  options={countries.map((country) => country.label)}
                  value={form.country || null}
                  onChange={(e, value) => handleCommonChange(value, "country")}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      required
                      error={!!errors?.country}
                      helperText={errors?.country}
                    />
                  )}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <TextField
                  fullWidth
                  label={regex.key2 || "Registration Number"}
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={(e) => handleCommonChange(e, "registrationNumber")}
                  required
                  error={!!errors?.registrationNumber}
                  helperText={errors?.registrationNumber}
                />
                <TextField
                  fullWidth
                  label={regex.key1 || "GST/VAT/TIN Number"}
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={(e) => handleCommonChange(e, "gstNumber")}
                  required
                  error={!!errors?.gstNumber}
                  helperText={errors?.gstNumber}
                />

                {/* <TextField
                  fullWidth
                  label={"Company Address"}
                  name="companyAddress"
                  value={form.companyAddress}
                  onChange={(e) => handleCommonChange(e, "companyAddress")}
                  required
                  error={!!errors?.companyAddress}
                  helperText={errors?.companyAddress}
                /> */}

                <GoogleMapsAutocomplete
                  title="companyAddress"
                  placeholder="Company Address"
                  onPlaceSelect={(newValue) =>
                    handleLocationChange(newValue, "companyAddress")
                  }
                  value={form.companyAddress}
                  error={errors?.companyAddress}
                  type={["geocode"]}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <Autocomplete
                  options={newCounties}
                  // key={`${company._id || index}`}
                  fullWidth
                  value={
                    newCounties.find((c) => c.includes(form?.countryCode)) ||
                    null
                  }
                  // getOptionLabel={(option) => `+${option.phone}`}
                  onChange={(event, newValue) => {
                    const input = newValue || "";
                    const match = input?.match(/^([^\s]+)\s+-/);
                    const result = match ? match[1] : "";
                    handleCommonChange(result, "countryCode");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Country Code" />
                  )}
                />
                <TextField
                  fullWidth
                  label="Company Phone"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={(e) => handleCommonChange(e, "contactNumber")}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                  }}
                  required
                  error={!!errors?.contactNumber}
                  helperText={errors?.contactNumber}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Admin Name"
                    name="admin.name"
                    value={form.admin?.name}
                    onChange={(e) => handleCommonChange(e, "admin.name")}
                    required
                    error={!!errors?.admin?.name}
                    helperText={errors?.admin?.name}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <EmailField
                    title={"Email ID"}
                    placeholder="Enter Email"
                    value={form.email}
                    errors={errors?.email}
                    fieldName={"email"}
                    showIcon={TaskAltIcons.email === true}
                    isEditMode={!!editData}
                    originalEmail={editData?.email}
                    {...{
                      setTaskAltIcons,
                      TaskAltIcons,
                      setErrors,
                      setFormData: setForm,
                      element: form.email,
                      formData: form,
                      setVerify,
                      verify,
                      setverifybtn,
                      verifybtn,
                    }}
                  />
                </Grid>
              </Grid>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Autocomplete
                options={newCounties}
                // key={`${company._id || index}-1`}
                fullWidth
                value={
                  newCounties.find((c) =>
                    c.includes(form?.admin.countryCode)
                  ) || null
                }
                // getOptionLabel={(option) => `+${option.phone}`}
                onChange={(event, newValue) => {
                  const input = newValue || "";
                  const match = input?.match(/^([^\s]+)\s+-/);
                  const result = match ? match[1] : "";
                  handleCommonChange(result, "admin.countryCode");
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Country Code" />
                )}
              />
              <TextField
                fullWidth
                label="Admin Phone"
                name="admin.phone"
                value={form.admin?.phone}
                onChange={(e) => handleCommonChange(e, "admin.phone")}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                }}
                required
                error={!!errors?.admin?.phone}
                helperText={errors?.admin?.phone}
              />
              <Autocomplete
                options={accountMode}
                value={form?.accountMode || null}
                onChange={(e, value) =>
                  handleCommonChange(value, "accountMode")
                }
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Account Mode"
                    required
                    error={!!errors?.accountMode}
                    helperText={errors?.accountMode}
                  />
                )}
              />
            </div>

            <Typography variant="h6" gutterBottom style={{ marginTop: "1rem" }}>
              Payment Details
            </Typography>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ width: "32%" }}>
                <FormControl fullWidth required error={!!errors?.paymentStatus}>
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    label="Payment Status"
                    value={form?.paymentStatus || ""}
                    onChange={(e) =>
                      handleCommonChange(e.target.value, "paymentStatus")
                    }
                    disabled={editData == null ? false : true}
                  >
                    {paymentStatusList.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.paymentStatus}</FormHelperText>
                </FormControl>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              {form?.paymentStatus === "pending" && (
                <>
                  <Autocomplete
                    options={PaymentMethods.sort()}
                    value={form?.paymentMethod || null}
                    onChange={(e, value) =>
                      handleCommonChange(value, "paymentMethod")
                    }
                    fullWidth
                    disabled={editData == null ? false : true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="PaymentMethod"
                        required
                        error={!!errors?.paymentMethod}
                        helperText={errors?.paymentMethod}
                      />
                    )}
                  />
                  <TextField
                    fullWidth
                    label="Payment Amount"
                    name="paymentAmount"
                    value={form.paymentAmount}
                    onChange={(e) => handleCommonChange(e, "paymentAmount")}
                    required
                    error={!!errors?.paymentAmount}
                    helperText={errors?.paymentAmount}
                    disabled={editData == null ? false : true}
                  />
                  <Autocomplete
                    options={currencyOptions}
                    value={
                      currencyOptions.find(
                        (option) => option.value === form?.paymentCurrency
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleCommonChange(value?.value || "", "paymentCurrency")
                    }
                    fullWidth
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Payment Currency"
                        required
                        error={!!errors?.paymentCurrency}
                        helperText={errors?.paymentCurrency}
                        disabled={editData == null ? false : true}
                      />
                    )}
                  />
                </>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // marginTop: "1rem",
              }}
            >
              <ImageUploader
                image={form.companyImage}
                onUpload={handleImageUpload}
                onDelete={handleDeleteImage}
              />
            </div>
          </div>
        </div>
        <Grid item xs={12}>
          <Box display="flex" gap="1rem" justifyContent="flex-start" mt={2}>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#1c486b",
                textTransform: "none",
                padding: "6px 24px",
              }}
            >
              {editData ? "Update" : "Submit"}
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", padding: "6px 24px" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </div>
    </div>
  );
};

export default Form;
