import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { EyeClosed, Eye } from "lucide-react";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import { resetPassword } from "../services/User";

interface ResetPasswordFormType {
  name: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormErrorsType {
  nameError: string;
  emailAddressError: string;
  passwordError: string;
  confirmPasswordError: string;
  resetPasswordError: string;
}

interface ResetPasswordFormErrorsActionType {
  type: string;
  payload: string;
}

interface ResetPasswordFormInputStatusType {
  valid: boolean;
  focused: boolean;
}

interface ResetPasswordFormInputActionType {
  type: string;
  payload: boolean;
}

const resetPasswordFormInputStatusInitialState = {
  valid: true,
  focused: false,
};

const inputStatusReducer = (
  state: ResetPasswordFormInputStatusType,
  action: ResetPasswordFormInputActionType
) => {
  switch (action.type) {
    case "focus":
      return { ...state, focused: action.payload };
    case "valid":
      return { ...state, valid: action.payload };
    default:
      throw new Error();
  }
};

const resetPasswordFormErrorsInitialState = {
  nameError: "",
  emailAddressError: "",
  passwordError: "",
  confirmPasswordError: "",
  resetPasswordError: "",
};

const errorReducer = (
  state: ResetPasswordFormErrorsType,
  action: ResetPasswordFormErrorsActionType
) => {
  switch (action.type) {
    case "name":
      return { ...state, nameError: action.payload };
    case "emailAddress":
      return { ...state, emailAddressError: action.payload };
    case "password":
      return { ...state, passwordError: action.payload };
    case "confirmPassword":
      return { ...state, confirmPasswordError: action.payload };
    case "resetPassword":
      return { ...state, resetPasswordError: action.payload };
    default:
      throw new Error();
  }
};

export const ResetPasswordPage = () => {
  const [resetPasswordFormState, setResetPasswordFormState] =
    useState<ResetPasswordFormType>({
      name: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    });

  const [loadingIconState, setLoadingIconState] = useState(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const resetPasswordErrorRef = useRef<HTMLParagraphElement | null>(null);
  const nameErrorRef = useRef<HTMLParagraphElement | null>(null);
  const emailAddressErrorRef = useRef<HTMLParagraphElement | null>(null);
  const passwordErrorRef = useRef<HTMLParagraphElement | null>(null);
  const confirmPasswordErrorRef = useRef<HTMLParagraphElement | null>(null);

  const [nameInputStatus, dispatchNameInputStatus] = useReducer(
    inputStatusReducer,
    resetPasswordFormInputStatusInitialState
  );
  const [emailAddressInputStatus, dispatchEmailAddressInputStatus] = useReducer(
    inputStatusReducer,
    resetPasswordFormInputStatusInitialState
  );
  const [passwordInputStatus, dispatchPasswordInputStatus] = useReducer(
    inputStatusReducer,
    resetPasswordFormInputStatusInitialState
  );
  const [confirmPasswordInputStatus, dispatchConfirmPasswordInputStatus] =
    useReducer(inputStatusReducer, resetPasswordFormInputStatusInitialState);

  const [passwordVisibilityStatus, dispatchPasswordVisibilityStatus] =
    useState("password");
  const [
    confirmPasswordVisibilityStatus,
    dispatchConfirmPasswordVisibilityStatus,
  ] = useState("password");

  const togglePasswordVisibilityStatus = (inputFieldName: string) => {
    if (
      inputFieldName === "password" &&
      passwordVisibilityStatus === "password"
    )
      dispatchPasswordVisibilityStatus("text");
    else if (inputFieldName === "text" && passwordVisibilityStatus === "text")
      dispatchPasswordVisibilityStatus("password");
  };

  const toggleConfirmPasswordVisibilityStatus = (inputFieldName: string) => {
    if (
      inputFieldName === "password" &&
      confirmPasswordVisibilityStatus === "password"
    )
      dispatchConfirmPasswordVisibilityStatus("text");
    else if (
      inputFieldName === "text" &&
      confirmPasswordVisibilityStatus === "text"
    )
      dispatchConfirmPasswordVisibilityStatus("password");
  };

  const [errorMessage, dispatchErrorMessage] = useReducer(
    errorReducer,
    resetPasswordFormErrorsInitialState
  );

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const nameRegEx = /^\s*([A-Za-z]{1,}([\.,] |[-']| )?)+[A-Za-z]+\.?\s*$/;
  const emailAddressRegEx =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const passwordRegEx =
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*\-_.?]).{8,50}$/;

  const isResetPasswordButtonDisabled =
    !nameInputStatus.valid ||
    !emailAddressInputStatus.valid ||
    !passwordInputStatus.valid ||
    !confirmPasswordInputStatus.valid;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordFormState((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    const nameValidationResult = nameRegEx.test(resetPasswordFormState.name);
    dispatchNameInputStatus({
      type: "valid",
      payload: nameValidationResult,
    });
  }, [resetPasswordFormState.name]);

  useEffect(() => {
    const emailAddressValidationResult = emailAddressRegEx.test(
      resetPasswordFormState.emailAddress
    );
    dispatchEmailAddressInputStatus({
      type: "valid",
      payload: emailAddressValidationResult,
    });
  }, [resetPasswordFormState.emailAddress]);

  useEffect(() => {
    const passwordValidationResult = passwordRegEx.test(
      resetPasswordFormState.password
    );
    dispatchPasswordInputStatus({
      type: "valid",
      payload: passwordValidationResult,
    });
  }, [resetPasswordFormState.password]);

  useEffect(() => {
    const confirmPasswordValidationResult =
      passwordRegEx.test(resetPasswordFormState.confirmPassword) &&
      resetPasswordFormState.confirmPassword === resetPasswordFormState.password
        ? true
        : false;
    dispatchConfirmPasswordInputStatus({
      type: "valid",
      payload: confirmPasswordValidationResult,
    });
  }, [resetPasswordFormState.password, resetPasswordFormState.confirmPassword]);

  useEffect(() => {
    dispatchErrorMessage({ type: "name", payload: "" });
    dispatchErrorMessage({ type: "resetPassword", payload: "" });
  }, [resetPasswordFormState.name]);

  useEffect(() => {
    dispatchErrorMessage({ type: "emailAddress", payload: "" });
    dispatchErrorMessage({ type: "resetPassword", payload: "" });
  }, [resetPasswordFormState.emailAddress]);

  useEffect(() => {
    dispatchErrorMessage({ type: "password", payload: "" });
    dispatchErrorMessage({ type: "resetPassword", payload: "" });
  }, [resetPasswordFormState.password]);

  useEffect(() => {
    dispatchErrorMessage({ type: "confirmPassword", payload: "" });
    dispatchErrorMessage({ type: "resetPassword", payload: "" });
  }, [resetPasswordFormState.confirmPassword]);

  const navigate = useNavigate();

  const handleResetPassword = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const nameValidation = () => {
      if (resetPasswordFormState.name === "") {
        dispatchErrorMessage({
          type: "name",
          payload: "Name cannot be empty.",
        });
        dispatchNameInputStatus({ type: "valid", payload: false });
      } else if (!nameRegEx.test(resetPasswordFormState.name)) {
        dispatchErrorMessage({ type: "name", payload: "Invalid name." });
        dispatchNameInputStatus({ type: "valid", payload: false });
      }
    };
    const emailAddressValidation = () => {
      if (resetPasswordFormState.emailAddress === "") {
        dispatchErrorMessage({
          type: "emailAddress",
          payload: "Email address cannot be empty.",
        });
        dispatchEmailAddressInputStatus({ type: "valid", payload: false });
      } else if (!emailAddressRegEx.test(resetPasswordFormState.emailAddress)) {
        dispatchErrorMessage({
          type: "emailAddress",
          payload: "Invalid email address.",
        });
        dispatchEmailAddressInputStatus({ type: "valid", payload: false });
      }
    };
    const passwordValidation = () => {
      if (resetPasswordFormState.password === "") {
        dispatchErrorMessage({
          type: "password",
          payload: "Password cannot be empty.",
        });
        dispatchPasswordInputStatus({ type: "valid", payload: false });
      } else if (!passwordRegEx.test(resetPasswordFormState.password)) {
        dispatchErrorMessage({
          type: "password",
          payload: "Invalid password.",
        });
        dispatchPasswordInputStatus({ type: "valid", payload: false });
      }
    };
    const confirmPasswordValidation = () => {
      if (resetPasswordFormState.confirmPassword === "") {
        dispatchErrorMessage({
          type: "confirmPassword",
          payload: "Confirm password cannot be empty.",
        });
        dispatchConfirmPasswordInputStatus({ type: "valid", payload: false });
      } else if (
        !(
          passwordRegEx.test(resetPasswordFormState.confirmPassword) &&
          resetPasswordFormState.confirmPassword ===
            resetPasswordFormState.password
        )
      ) {
        dispatchErrorMessage({
          type: "confirmPassword",
          payload: "Confirm password not matching with password.",
        });
        dispatchConfirmPasswordInputStatus({ type: "valid", payload: false });
      }
    };
    nameValidation();
    emailAddressValidation();
    passwordValidation();
    confirmPasswordValidation();
    if (
      !nameInputStatus.valid ||
      !emailAddressInputStatus.valid ||
      !passwordInputStatus.valid ||
      !confirmPasswordInputStatus.valid
    ) {
      dispatchErrorMessage({ type: "resetPassword", payload: "Invalid data" });
      return;
    }
    if (
      nameInputStatus.valid &&
      emailAddressInputStatus.valid &&
      passwordInputStatus.valid &&
      confirmPasswordInputStatus.valid
    ) {
      try {
        setLoadingIconState(true);
        const resetPasswordFormData = JSON.stringify(resetPasswordFormState);
        const userResetPassword = await resetPassword(resetPasswordFormData);
        if (userResetPassword === "Password has been reset successfully") {
          dispatchErrorMessage({
            type: "resetPassword",
            payload: "",
          });
          navigate("/login");
          toast.success("Password has been reset successfully.");
          toast.success("You can now log in with the new password.");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error) {
            console.error(error);
            const errorMessage = error.response?.data.message
              ? error.response?.data.message
              : error.message;
            dispatchErrorMessage({
              type: "resetPassword",
              payload: errorMessage,
            });
          }
        }
        resetPasswordErrorRef.current?.focus();
      } finally {
        setLoadingIconState(false);
      }
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-gradient-to-br from-blue-50 to-white font-lato">
      <Header pageType="Reset Password" />
      <div className="w-full h-full flex flex-col text-[1.25rem] md:text-[2rem] lg:text-[2.25rem]">
        <h3 className="mx-auto mt-4 mb-[1%] w-full h-[9%] text-[#646464] text-center text-[1em] font-lato font-[500]">
          Reset password
        </h3>
        {errorMessage.resetPasswordError && (
          <p
            ref={resetPasswordErrorRef}
            className="mx-auto my-[2%] pl-[0.25%] pr-[0.15%] py-[0.15%] w-full lg:w-[80%] rounded-[0.35em] bg-[#fcb2a2] border-[2px] border-[#ff0000] text-[#000000] leading-[1.2] text-[0.55em]"
            aria-live="assertive"
          >
            {errorMessage.resetPasswordError}
          </p>
        )}
        <form
          className="mt-[1%] mb-[1%] mx-0 md:mx-auto p-5 w-full lg:w-[80%] h-[40%] rounded-3xl bg-gray-200 text-[1.75rem] font-inter"
          onSubmit={handleResetPassword}
          method="POST"
        >
          <div className="relative">
            <input
              id="reset-password-form__name"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                resetPasswordFormState.name !== ""
                  ? nameInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="name"
              ref={nameInputRef}
              type="text"
              maxLength={75}
              value={resetPasswordFormState.name}
              onChange={handleInputChange}
              onFocus={() =>
                dispatchNameInputStatus({ type: "focus", payload: true })
              }
              onBlur={() =>
                dispatchNameInputStatus({ type: "focus", payload: false })
              }
              required={true}
              autoComplete="off"
              aria-invalid={nameInputStatus.valid ? "false" : "true"}
            />
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="reset-password-form__name"
            >
              Enter your name
            </label>
          </div>
          {errorMessage.nameError && (
            <p
              ref={nameErrorRef}
              className="ml-[0] mr-[0] my-[2%] pl-[0.25%] pr-[0.0.555%] py-[0.15%] w-full rounded-[0.35em] bg-[#fcb2a2] border-[2px] border-[#ff0000] text-[#000000] leading-[1.2] text-[0.55em]"
              aria-live="assertive"
            >
              {errorMessage.nameError}
            </p>
          )}
          <div className="relative">
            <input
              id="reset-password-form__email-address"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                resetPasswordFormState.emailAddress !== ""
                  ? emailAddressInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="emailAddress"
              type="email"
              maxLength={150}
              value={resetPasswordFormState.emailAddress}
              onChange={handleInputChange}
              onFocus={() =>
                dispatchEmailAddressInputStatus({
                  type: "focus",
                  payload: true,
                })
              }
              onBlur={() =>
                dispatchEmailAddressInputStatus({
                  type: "focus",
                  payload: false,
                })
              }
              required={true}
              autoComplete="off"
              aria-invalid={emailAddressInputStatus.valid ? "false" : "true"}
              aria-describedby="reset-password-form__emailAddressRequirements"
            />
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="reset-password-form__email-address"
            >
              Enter your email address
            </label>
          </div>
          {errorMessage.emailAddressError && (
            <p
              ref={emailAddressErrorRef}
              className="ml-[0] mr-[0] my-[2%] pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#fcb2a2] border-[2px] border-[#ff0000] text-[#000000] leading-[1.2] text-[0.55em]"
              aria-live="assertive"
            >
              {errorMessage.emailAddressError}
            </p>
          )}
          <div className="relative">
            <input
              id="reset-password-form__password"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                resetPasswordFormState.password !== ""
                  ? passwordInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="password"
              type={passwordVisibilityStatus}
              maxLength={14}
              value={resetPasswordFormState.password}
              onChange={handleInputChange}
              onFocus={() =>
                dispatchPasswordInputStatus({ type: "focus", payload: true })
              }
              onBlur={() =>
                dispatchPasswordInputStatus({ type: "focus", payload: false })
              }
              required={true}
              autoComplete="off"
              aria-invalid={passwordInputStatus.valid ? "false" : "true"}
            />
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="reset-password-form__password"
            >
              Enter new password
            </label>
            <span className="absolute inset-y-0 end-0 flex items-center z-1 px-3 cursor-pointer text-[0.6em]">
              {passwordVisibilityStatus === "password" ? (
                <EyeClosed
                  className="h-4 w-4"
                  onClick={() => togglePasswordVisibilityStatus("password")}
                />
              ) : (
                <Eye
                  className="h-4 w-4"
                  onClick={() => togglePasswordVisibilityStatus("text")}
                />
              )}
            </span>
          </div>
          {errorMessage.passwordError && (
            <p
              ref={passwordErrorRef}
              className="ml-[0] mr-[0] my-[2%] pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#fcb2a2] border-[2px] border-[#ff0000] text-[#000000] leading-[1.2] text-[0.55em]"
              aria-live="assertive"
            >
              {errorMessage.passwordError}
            </p>
          )}
          <div className="relative">
            <input
              id="reset-password-form__confirm-password"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                resetPasswordFormState.confirmPassword !== ""
                  ? confirmPasswordInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="confirmPassword"
              type={confirmPasswordVisibilityStatus}
              maxLength={14}
              value={resetPasswordFormState.confirmPassword}
              onChange={handleInputChange}
              onFocus={() =>
                dispatchConfirmPasswordInputStatus({
                  type: "focus",
                  payload: true,
                })
              }
              onBlur={() =>
                dispatchConfirmPasswordInputStatus({
                  type: "focus",
                  payload: false,
                })
              }
              required={true}
              autoComplete="off"
              aria-invalid={confirmPasswordInputStatus.valid ? "false" : "true"}
            />
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="reset-password-form__confirm-password"
            >
              Confirm password
            </label>
            <span className="absolute inset-y-0 end-0 flex items-center z-1 px-3 cursor-pointer text-[0.6em]">
              {confirmPasswordVisibilityStatus === "password" ? (
                <EyeClosed
                  className="h-4 w-4"
                  onClick={() =>
                    toggleConfirmPasswordVisibilityStatus("password")
                  }
                />
              ) : (
                <Eye
                  className="h-4 w-4"
                  onClick={() => toggleConfirmPasswordVisibilityStatus("text")}
                />
              )}
            </span>
          </div>
          {errorMessage.confirmPasswordError && (
            <p
              ref={confirmPasswordErrorRef}
              className="ml-[0] mr-[0] my-[2%] pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#fcb2a2] border-[2px] border-[#ff0000] text-[#000000] leading-[1.2] text-[0.55em]"
              aria-live="assertive"
            >
              {errorMessage.confirmPasswordError}
            </p>
          )}
          {loadingIconState && (
            <div role="status" className="mx-auto w-8">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <button
            className={`mt-[6%] ml-[40%] lg:ml-[45%] me-2 mb-2 p-1.5 md:p-2.5 w-[25%] md:w-[20%] lg:w-[15%] text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full font-medium text-[0.5em] text-center ${
              isResetPasswordButtonDisabled
                ? "!bg-[#c8c8c8] !text-[#dcdcdc] !border-[none]"
                : ""
            }`}
            lang="en"
            name="resetPassword"
            type="submit"
            disabled={isResetPasswordButtonDisabled ? true : false}
          >
            <i></i>RESET
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};
