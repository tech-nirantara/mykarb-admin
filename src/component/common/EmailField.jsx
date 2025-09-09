/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  styled,
  Box,
  Typography,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import VerifyOtp from "./VerifyOtp";
import InputField from "./InputField";
import { api, post } from "../../utils/api";
import { formatTime } from "./formatTime";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "55px",
  },
}));

const EmailField = ({
  title,
  value,
  fieldName,
  placeholder,
  element,
  setFormData,
  formData,
  showIcon,
  setErrors,
  errors,
  disable,
  verify,
  setVerify,
  verifybtn,
  setverifybtn,
  TaskAltIcons,
  setTaskAltIcons,
  isEditMode = false,
  originalEmail = null,
}) => {
  const [otp, setOTP] = useState({ email: null });
  const [timerEmail, setTimerEmail] = useState(120);
  const [timerActive, setTimerActive] = useState({ email: false });
  const [verifyBtn, setVerifybtn] = useState(false);

  // Timer logic for OTP countdown
  useEffect(() => {
    if (timerActive.email && timerEmail > 0) {
      const timer = setInterval(() => {
        setTimerEmail((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setTimerActive((prev) => ({ ...prev, email: false }));
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timerActive.email, timerEmail]);

  // Handle email input change
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setTaskAltIcons((prevState) => ({ ...prevState, email: false }));
    setVerify((prevState) => ({ ...prevState, email: false, emailMsg: "" }));
    setverifybtn((prevState) => ({ ...prevState, email: false }));
    setTimerEmail(120);

    setErrors((prevState) => ({
      ...prevState,
      email: "",
    }));
    setOTP((prevState) => ({
      ...prevState,
      email: "", // Update the OTP value
    }));

    setFormData((prevState) => ({
      ...prevState,
      [name]: trimmedValue,
    }));

    if (element?.email === formData.email) {
      setTaskAltIcons((prev) => ({ ...prev, email: true }));
      return;
    }
    // In edit mode, check if email matches original email
    if (isEditMode && trimmedValue === originalEmail) {
      setTaskAltIcons((prevState) => ({ ...prevState, email: true }));
      setverifybtn((prevState) => ({ ...prevState, email: false }));
      return;
    }
    // if (value === element?.email) {
    //   setTaskAltIcons((prevState) => ({ ...prevState, email: true }));
    //   return;
    // }
    if (emailPattern.test(trimmedValue)) {
      setverifybtn((prevState) => ({ ...prevState, email: true }));
    }
  };

  const handleVerifyEmail = async (time) => {
    if (time > 0) {
      setverifybtn((prevState) => ({ ...prevState, email: false }));
      setTimerActive((prevState) => ({ ...prevState, email: true }));
      setErrors((prevState) => ({ ...prevState, email: "" }));

      try {
        await post(`/auth/sendOtpToEmail`, {
          email: formData.email,
          module: "Purchase",
        }).then((res) => {
          if (res?.data?.statusCode) {
            setVerify((prevState) => ({
              ...prevState,
              email: true,
              emailMsg: "",
            }));
          } else {
            setErrors((prevState) => ({
              ...prevState,
              email: res?.message?.message,
            }));
          }
        });
      } catch (err) {
        if (err.response?.data?.statusCode === false) {
          setErrors((prevState) => ({
            ...prevState,
            email: "Email already registered.",
          }));
        }
      }
    } else {
      setVerify((prevState) => ({ ...prevState, email: false }));
      setverifybtn((prevState) => ({ ...prevState, email: false }));
    }
  };

  const handleResend = () => {
    setTimerEmail(120); // Reset time to 120 seconds
    setTimerActive((prevState) => ({ ...prevState, email: true })); // Start the timer
    handleVerifyEmail(120); // Call the email verification function
  };

  const handleOTPVerify = async (e) => {
    const { value } = e.target;

    const isNumeric = /^\d+$/.test(value) || value === ""; // Allow empty string to support deletion

    if (isNumeric && value.length <= 4) {
      setVerify((prevState) => ({ ...prevState, emailMsg: "" }));
      setOTP((prevState) => ({
        ...prevState,
        email: value, // Update the OTP value
      }));
      if (value.length === 4) {
        await post(`/auth/verifyOtpForEmail`, {
          email: formData.email,
          otp: value,
        })
          .then((res) => {
            if (res?.data?.statusCode) {
              setVerify((prevState) => ({
                ...prevState,
                email: false,
                emailMsg: "",
              }));
              setverifybtn((prevState) => ({ ...prevState, email: false }));
              setTaskAltIcons((prevState) => ({ ...prevState, email: true }));
              setErrors((prevState) => ({ ...prevState, email: "" }));
              setVerifybtn(false);
            } else {
              setVerify((prevState) => ({
                ...prevState,
                emailMsg: "Invalid OTP",
              }));

              setTaskAltIcons((prevState) => ({ ...prevState, email: false }));
            }
          })
          .catch((err) => {
            setVerify((prevState) => ({
              ...prevState,
              emailMsg: "Invalid OTP",
            }));

            setTaskAltIcons((prevState) => ({ ...prevState, email: false }));
          });
      }
    }
  };

  useEffect(() => {
    if (formData.email === originalEmail) {
      setVerifybtn(false);
    }
  }, [formData.email, originalEmail]);

  return (
    <Box>
      {/* <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
        {title}
      </Typography> */}
      <CustomTextField
        variant="outlined"
        fullWidth
        value={value}
        required
        // placeholder={placeholder}
        label={placeholder}
        name={fieldName}
        disabled={disable}
        onChange={handleEmailChange}
        InputProps={{
          endAdornment: (TaskAltIcons.email ||
            (isEditMode && value === originalEmail)) && (
            <TaskAltIcon sx={{ color: "green" }} />
          ),
        }}
        error={errors}
      />
      {errors && (
        <Typography variant="body2" color="#D34040">
          {errors}
        </Typography>
      )}
      {verifybtn.email && formData?.email !== "" && (
        <VerifyOtp
          handleChange={() => {
            handleVerifyEmail(120);
            setVerifybtn(true);
          }}
          text="Verify"
        />
      )}

      {verifyBtn ? (
        <Box>
          <InputField
            value={otp.email}
            handleChange={handleOTPVerify}
            fieldName="otpEmail"
            placeholder="Enter OTP"
            title="Enter OTP For Email"
          />
          <Typography variant="body2" color="#D34040">
            {verify.emailMsg}
          </Typography>
          {timerActive.email ? (
            <Typography sx={{ textAlign: "right" }}>
              {formatTime(timerEmail)}
            </Typography>
          ) : (
            <VerifyOtp handleChange={handleResend} text="Resend" />
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default EmailField;
