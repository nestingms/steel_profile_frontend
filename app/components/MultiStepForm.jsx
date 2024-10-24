"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  // Formik form handler
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      file: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required."),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required."),
      file: Yup.mixed().required("Please upload a file."),
    }),
    onSubmit: (values) => {
      // Prepare form data to send to the server
      const formData = new FormData();
      formData.append("fullname", values.fullName);
      formData.append("email", values.email);
      formData.append("file", values.file);

      // Simulate sending the request
      fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            toast.success("File uploaded successfully!");
          } else {
            toast.error("Error uploading the file.");
          }
        })
        .catch((e) => {
          console.log(e);

          toast.error("Network error, try again.");
        });
    },
  });

  const handleNext = async () => {
    const errors = await formik.validateForm();
    if (!validateStep()) {
      return;
    }

    if (step == 2 && errors.email) {
      toast.error("Enter a valid email address.");
      return;
    }

    // Proceed to the next step if no validation errors
    if (!Object.keys(errors).length || step != 3) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const validateStep = () => {
    if (step === 1 && !formik.values.fullName.trim()) {
      toast.error("Full Name is required.");
      formik.setFieldError("fullName", "Full Name is required.");
      return false;
    } else if (step === 2 && !formik.values.email.trim()) {
      toast.error("Email is required or enter valid email.");
      formik.setFieldError("email", "Email is required.");
      return false;
    } else if (step === 3 && !formik.values.file) {
      toast.error("Please upload file.");
      formik.setFieldError("file", "Please upload a file.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    formik.setFieldValue("file", e.target.files[0]);
  };

  const getProgressPercentage = () => {
    return Math.floor(((step - 1) / 3) * 100);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins">
      <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-xl transition-all duration-[1.5s] ease-in-out transform hover:scale-105 animate-fade-in">
        {/* Progress Bar and Percentage */}
        <div className="text-center mb-6">
          <div className="text-gray-700 font-semibold text-lg mb-2">
            {getProgressPercentage()}% Completed
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {formik.errors[formik.values[step]] && (
          <div className="text-red-500 text-center mb-4 font-semibold">
            {formik.errors[formik.values[step]]}
          </div>
        )}

        {/* Form Step Rendering */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
              What&apos;s your full name?
            </h2>
            <input
              type="text"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              placeholder="Full Name"
              className="w-full p-5 mb-6 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out"
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white py-3 px-12 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-110 hover:shadow-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
              What&apos;s your email?
            </h2>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Email"
              className="w-full p-5 mb-6 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out"
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white py-3 px-12 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-110 hover:shadow-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
              Upload your file
            </h2>
            <div className="flex items-center justify-center w-full mb-4">
              <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide border border-blue-300 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12V4a1 1 0 10-2 0v8H4a1 1 0 100 2h12a1 1 0 100-2h-5V4a1 1 0 10-2 0v8H9z" />
                </svg>
                <span className="mt-2 text-lg">Choose File</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {formik.values.file && (
              <p className="text-center text-gray-600 text-lg">
                Selected file:{" "}
                <span className="font-semibold">{formik.values.file.name}</span>
              </p>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                onClick={formik.handleSubmit}
                className="bg-blue-500 text-white py-3 px-12 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-110 hover:shadow-lg"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">
              Thanks for submitting!
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              We will send the report to your email shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
