import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { Eye, EyeClosed, Info } from "lucide-react";
import React, { useRef, useState, useEffect, useReducer } from "react";
import { getUser, updateUser, deleteUser } from "../services/Settings";
import { useAuthContext } from "../../authentication";

interface UserProfileEditForm {
  id: string;
  name: string;
  emailAddress: string;
  currency: string;
  password: string;
  confirmPassword: string;
}

interface UserProfileEditFormInputStatusType {
  valid: boolean;
  focused: boolean;
}

interface UserProfileEditFormInputActionType {
  type: string;
  payload: boolean;
}

const userProfileEditFormInputStatusInitialState = {
  valid: true,
  focused: false,
};

const inputStatusReducer = (
  state: UserProfileEditFormInputStatusType,
  action: UserProfileEditFormInputActionType
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

interface UserProfileEditFormErrorsType {
  nameError: string;
  emailAddressError: string;
  currencyError: string;
  passwordError: string;
  confirmPasswordError: string;
  userProfileEditError: string;
}

interface UserProfileEditFormErrorsActionType {
  type: string;
  payload: string;
}

const userProfileEditFormErrorsInitialState = {
  nameError: "",
  emailAddressError: "",
  currencyError: "",
  passwordError: "",
  confirmPasswordError: "",
  userProfileEditError: "",
};

function errorReducer(
  state: UserProfileEditFormErrorsType,
  action: UserProfileEditFormErrorsActionType
) {
  switch (action.type) {
    case "name":
      return { ...state, nameError: action.payload };
    case "emailAddress":
      return { ...state, emailAddressError: action.payload };
    case "currency":
      return { ...state, currencyError: action.payload };
    case "password":
      return { ...state, passwordError: action.payload };
    case "confirmPassword":
      return { ...state, confirmPasswordError: action.payload };
    case "updateProfile":
      return { ...state, userProfileEditError: action.payload };
    default:
      throw new Error();
  }
}

const inputInstructions = {
  nameInstructions:
    "Must be between 2 to 75 characters<br />Only letters allowed",
  emailAddressInstructions:
    'Must be between 3 to 150 characters<br />Letters, numbers and some special characters allowed<br />Allowed special characters: <span aria-label="at symbol">@</span> <span aria-label="dot symbol">.</span> <span aria-label="hyphen">-</span> <span aria-label="underscore symbol">_</span>',
  currencyInstructions: "Select a currency from the dropdown list",
  passwordInstructions:
    'Must contain at least 8 characters<br />Must contain at least 1 upper case letter<br />Must contain at least 1 lower case letter<br />Must contain at least 1 digit<br />Must contain at least 1 of the special characters: <span aria-label="exclamation symbol">!</span> <span aria-label="at symbol">@</span> <span aria-label="hash symbol">#</span> <span aria-label="dollar symbol">$</span> <span aria-label="percent symbol">%</span> <span aria-label="caret symbol">^</span> <span aria-label="ampersand symbol">&</span> <span aria-label="asterisk symbol">*</span> <span aria-label="hyphen symbol">-</span> <span aria-label="underscore symbol">_</span> <span aria-label="dot symbol">.</span> <span aria-label="question mark symbol">?</span>',
  confirmPasswordInstructions: "Must match with the password",
};

export const SettingsPage = () => {
  const { loginStatusState, logOut } = useAuthContext();
  const isUserAuthenticated = !!loginStatusState.userID;

  const [userProfileEditFormState, setUserProfileEditFormState] =
    useState<UserProfileEditForm>({
      id: "",
      name: "",
      emailAddress: "",
      currency: "",
      password: "",
      confirmPassword: "",
    });

  const [loadingIconState, setLoadingIconState] = useState(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const userProfileEditErrorRef = useRef<HTMLParagraphElement | null>(null);
  const nameErrorRef = useRef<HTMLParagraphElement | null>(null);
  const emailAddressErrorRef = useRef<HTMLParagraphElement | null>(null);
  const currencyErrorRef = useRef<HTMLParagraphElement | null>(null);
  const passwordErrorRef = useRef<HTMLParagraphElement | null>(null);
  const confirmPasswordErrorRef = useRef<HTMLParagraphElement | null>(null);

  const [nameInputStatus, dispatchNameInputStatus] = useReducer(
    inputStatusReducer,
    userProfileEditFormInputStatusInitialState
  );
  const [emailAddressInputStatus, dispatchEmailAddressInputStatus] = useReducer(
    inputStatusReducer,
    userProfileEditFormInputStatusInitialState
  );
  const [currencyInputStatus, dispatchCurrencyInputStatus] = useReducer(
    inputStatusReducer,
    userProfileEditFormInputStatusInitialState
  );
  const [passwordInputStatus, dispatchPasswordInputStatus] = useReducer(
    inputStatusReducer,
    userProfileEditFormInputStatusInitialState
  );
  const [confirmPasswordInputStatus, dispatchConfirmPasswordInputStatus] =
    useReducer(inputStatusReducer, userProfileEditFormInputStatusInitialState);

  const [errorMessage, dispatchErrorMessage] = useReducer(
    errorReducer,
    userProfileEditFormErrorsInitialState
  );

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

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const nameRegEx = /^\s*([A-Za-z]{1,}([\.,] |[-']| )?)+[A-Za-z]+\.?\s*$/;
  const emailAddressRegEx =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const currencyRegEx =
    /^(AED|AFN|ALL|AMD|ANG|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BGN|BHD|BIF|BMD|BND|BOB|BRL|BSD|BTN|BWP|BYN|BYR|BZD|CAD|CDF|CHF|CLF|CLP|CNY|COP|CRC|CUC|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GGP|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HRK|HTG|HUF|IDR|ILS|IMP|INR|IQD|IRR|ISK|JEP|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LTL|LVL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRO|MUR|MVR|MWK|MXN|MYR|MZN|NAD|NGN|NIO|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SBD|SCR|SDG|SEK|SGD|SHP|SLL|SOS|SRD|STD|SVC|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TWD|TZS|UAH|UGX|USD|UYU|UZS|VEF|VND|VUV|WST|XAF|XCD|XOF|XPF|YER|ZAR|ZMW|ZWL)$/i;
  const passwordRegEx =
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*\-_.?]).{8,50}$/;

  const isSaveButtonDisabled = useRef(true);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserProfileEditFormState((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    const nameValidationResult = nameRegEx.test(userProfileEditFormState.name);
    dispatchNameInputStatus({ type: "valid", payload: nameValidationResult });
  }, [userProfileEditFormState.name]);

  useEffect(() => {
    const emailAddressValidationResult = emailAddressRegEx.test(
      userProfileEditFormState.emailAddress
    );
    dispatchEmailAddressInputStatus({
      type: "valid",
      payload: emailAddressValidationResult,
    });
  }, [userProfileEditFormState.emailAddress]);

  useEffect(() => {
    const currencyValidationResult = currencyRegEx.test(
      userProfileEditFormState.currency
    );
    dispatchCurrencyInputStatus({
      type: "valid",
      payload: currencyValidationResult,
    });
  }, [userProfileEditFormState.currency]);

  useEffect(() => {
    const passwordValidationResult = passwordRegEx.test(
      userProfileEditFormState.password
    );
    dispatchPasswordInputStatus({
      type: "valid",
      payload: passwordValidationResult,
    });
  }, [userProfileEditFormState.password]);

  useEffect(() => {
    const confirmPasswordValidationResult =
      passwordRegEx.test(userProfileEditFormState.confirmPassword) &&
      userProfileEditFormState.confirmPassword ===
        userProfileEditFormState.password
        ? true
        : false;
    dispatchConfirmPasswordInputStatus({
      type: "valid",
      payload: confirmPasswordValidationResult,
    });
  }, [
    userProfileEditFormState.password,
    userProfileEditFormState.confirmPassword,
  ]);

  useEffect(() => {
    dispatchErrorMessage({ type: "name", payload: "" });
    dispatchErrorMessage({ type: "updateProfile", payload: "" });
  }, [userProfileEditFormState.name]);

  useEffect(() => {
    dispatchErrorMessage({ type: "emailAddress", payload: "" });
    dispatchErrorMessage({ type: "updateProfile", payload: "" });
  }, [userProfileEditFormState.emailAddress]);

  useEffect(() => {
    dispatchErrorMessage({ type: "password", payload: "" });
    dispatchErrorMessage({ type: "updateProfile", payload: "" });
  }, [userProfileEditFormState.password]);

  useEffect(() => {
    dispatchErrorMessage({ type: "currency", payload: "" });
    dispatchErrorMessage({ type: "updateProfile", payload: "" });
  }, [userProfileEditFormState.currency]);

  useEffect(() => {
    dispatchErrorMessage({ type: "confirmPassword", payload: "" });
    dispatchErrorMessage({ type: "updateProfile", payload: "" });
  }, [userProfileEditFormState.confirmPassword]);

  const currentUserName = useRef("");
  const currentUserEmailAddress = useRef("");
  const currentUserCurrency = useRef("");

  const { data: userDetails, error: userDetailsError } = useQuery({
    queryKey: ["user-details"],
    queryFn: getUser,
    enabled: isUserAuthenticated,
  });

  useEffect(() => {
    if (userDetails) {
      setUserProfileEditFormState((prevFormData) => ({
        ...prevFormData,
        id: userDetails.id,
        name: userDetails.name,
        emailAddress: userDetails.email_address,
        currency: userDetails.currency,
      }));
      currentUserName.current = userDetails.name;
      currentUserEmailAddress.current = userDetails.email_address;
      currentUserCurrency.current = userDetails.currency;
    } else if (userDetailsError) {
      console.error(userDetailsError);
      dispatchErrorMessage({
        type: "updateProfile",
        payload: String(userDetailsError),
      });
      userProfileEditErrorRef.current?.focus();
    }
  }, [userDetails, userDetailsError]);

  const isAnyInputFieldEmpty =
    userProfileEditFormState.name === "" ||
    userProfileEditFormState.emailAddress === "" ||
    userProfileEditFormState.currency === ""
      ? true
      : false;
  const isAnyInputFieldInvalid =
    !nameRegEx.test(userProfileEditFormState.name) ||
    !emailAddressRegEx.test(userProfileEditFormState.emailAddress) ||
    !currencyRegEx.test(userProfileEditFormState.currency);
  const isAnyInputFieldValueDifferent =
    userProfileEditFormState.name !== currentUserName.current ||
    userProfileEditFormState.emailAddress !== currentUserEmailAddress.current ||
    userProfileEditFormState.currency !== currentUserCurrency.current;

  useEffect(() => {
    isSaveButtonDisabled.current =
      !isAnyInputFieldValueDifferent ||
      isAnyInputFieldInvalid ||
      isAnyInputFieldEmpty;
  }, [userProfileEditFormState]);

  const handleSave = async () => {
    const nameValidation = () => {
      if (userProfileEditFormState.name === "") {
        dispatchErrorMessage({
          type: "name",
          payload: "Name cannot be empty.",
        });
        dispatchNameInputStatus({ type: "valid", payload: false });
      } else if (!nameRegEx.test(userProfileEditFormState.name)) {
        dispatchErrorMessage({ type: "name", payload: "Invalid first name." });
        dispatchNameInputStatus({ type: "valid", payload: false });
      }
    };
    const emailAddressValidation = () => {
      if (userProfileEditFormState.emailAddress === "") {
        dispatchErrorMessage({
          type: "emailAddress",
          payload: "Email address cannot be empty.",
        });
        dispatchEmailAddressInputStatus({ type: "valid", payload: false });
      } else if (
        !emailAddressRegEx.test(userProfileEditFormState.emailAddress)
      ) {
        dispatchErrorMessage({
          type: "emailAddress",
          payload: "Invalid email address.",
        });
        dispatchEmailAddressInputStatus({ type: "valid", payload: false });
      }
    };
    const currencyValidation = () => {
      if (userProfileEditFormState.currency === "") {
        dispatchErrorMessage({
          type: "currency",
          payload: "Currency cannot be empty",
        });
        dispatchCurrencyInputStatus({ type: "valid", payload: false });
      } else if (!currencyRegEx.test(userProfileEditFormState.currency)) {
        dispatchErrorMessage({
          type: "currency",
          payload: "Invalid currency",
        });
        dispatchCurrencyInputStatus({ type: "valid", payload: false });
      }
    };
    const passwordValidation = () => {
      if (!passwordRegEx.test(userProfileEditFormState.password)) {
        dispatchErrorMessage({ type: "password", payload: "Invalid password" });
        dispatchPasswordInputStatus({ type: "valid", payload: false });
        return false;
      } else return true;
    };
    const confirmPasswordValidation = () => {
      if (
        !(
          passwordRegEx.test(userProfileEditFormState.confirmPassword) &&
          userProfileEditFormState.confirmPassword ===
            userProfileEditFormState.password
        )
      ) {
        dispatchErrorMessage({
          type: "confirmPassword",
          payload: "Confirm password not matching with password",
        });
        dispatchConfirmPasswordInputStatus({ type: "valid", payload: false });
        return false;
      } else return true;
    };
    nameValidation();
    emailAddressValidation();
    currencyValidation();
    const isPasswordInputValid = userProfileEditFormState.password
      ? passwordInputStatus.valid && passwordValidation()
      : true;
    const isConfirmPasswordInputValid = userProfileEditFormState.confirmPassword
      ? confirmPasswordInputStatus.valid && confirmPasswordValidation()
      : true;
    if (
      !nameInputStatus.valid ||
      !emailAddressInputStatus.valid ||
      !currencyInputStatus.valid ||
      !isPasswordInputValid ||
      !isConfirmPasswordInputValid
    ) {
      dispatchErrorMessage({ type: "updateProfile", payload: "Invalid data" });
      return;
    }
    if (
      nameInputStatus.valid &&
      emailAddressInputStatus.valid &&
      currencyInputStatus.valid &&
      isPasswordInputValid &&
      isConfirmPasswordInputValid
    ) {
      try {
        setLoadingIconState(true);
        const userProfileEditFormData = JSON.stringify(
          userProfileEditFormState
        );
        const userProfileUpdate = await updateUser(userProfileEditFormData);
        if (userProfileUpdate) {
          if (
            userProfileUpdate.emailAddress !== currentUserEmailAddress.current
          ) {
            toast.success(
              "Your profile has been successfully updated. Please log in with the new email address."
            );
            logOut();
          }
          setUserProfileEditFormState({
            id: userProfileUpdate.id,
            name: userProfileUpdate.name,
            emailAddress: userProfileUpdate.emailAddress,
            currency: userProfileUpdate.currency,
            password: "",
            confirmPassword: "",
          });
          currentUserName.current = userProfileUpdate.name;
          currentUserEmailAddress.current = userProfileUpdate.emailAddress;
          currentUserCurrency.current = userProfileUpdate.currency;
          dispatchErrorMessage({
            type: "updateProfile",
            payload: "",
          });
          toast.success("Your profile has been successfully updated.");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error) {
            console.error(error);
            const errorMessage = error.response?.data.message
              ? error.response?.data.message
              : error.message;
            dispatchErrorMessage({
              type: "updateProfile",
              payload: errorMessage,
            });
          }
        }
        userProfileEditErrorRef.current?.focus();
      } finally {
        setLoadingIconState(false);
      }
    }
  };

  const [displayDeleteDialogBox, setDisplayDeleteDialogBox] = useState(false);

  const handleDelete = () => {
    const deleteUserAccount = async () => {
      try {
        setLoadingIconState(true);
        const userDelete = await deleteUser();
        if (userDelete === "User and all related data deleted successfully") {
          dispatchErrorMessage({
            type: "updateProfile",
            payload: "",
          });
          toast.success("Your account has been deleted successfully.");
          logOut();
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(error);
          const errorMessage = error.response?.data.message
            ? error.response?.data.message
            : error.message;
          dispatchErrorMessage({
            type: "updateProfile",
            payload: errorMessage,
          });
        }
        userProfileEditErrorRef.current?.focus();
      } finally {
        setLoadingIconState(false);
      }
    };

    deleteUserAccount();
  };

  return (
    <div className="w-full min-h-full flex flex-col font-lato">
      <div className="w-full h-full flex flex-col text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl">
        <h3 className="mx-auto mt-4 mb-[1%] w-full h-[9%] text-center text-[1.25em] font-lato font-[500]">
          Update your profile
        </h3>
        {errorMessage.userProfileEditError && (
          <p
            ref={userProfileEditErrorRef}
            className="mx-auto my-[2%] pl-[0.25%] pr-[0.15%] py-[0.15%] w-full lg:w-[80%] rounded-[0.35em] bg-[#fcb2a2] border-[2px] border-[#ff0000] text-[#000000] leading-[1.2] text-[0.55em]"
            aria-live="assertive"
          >
            {errorMessage.userProfileEditError}
          </p>
        )}
        <form
          className="mt-[1%] mb-[1%] mx-0 md:mx-auto p-5 w-full lg:w-[80%] rounded-3xl bg-gray-100 text-[1.75rem] font-inter"
          method="POST"
        >
          <div className="relative">
            <input
              id="update-profile-form__name"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-[0.5em] text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                userProfileEditFormState.name !== "" &&
                userProfileEditFormState.name !== currentUserName.current
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
              value={userProfileEditFormState.name}
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
              aria-describedby="update-profile-form__name-requirements"
            />
            <label
              lang="en"
              className="absolute text-[0.5em] text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="update-profile-form__name"
            >
              Update your name
            </label>
          </div>
          {userProfileEditFormState.name &&
            nameInputStatus.focused &&
            !nameInputStatus.valid && (
              <p
                id="update-profile-form__name-requirements"
                className="m-0 pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#748696] text-[#ffffff] leading-[1.2] text-[0.55em]"
              >
                <Info />
                {parse(inputInstructions.nameInstructions)}
              </p>
            )}
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
              id="update-profile-form__email-address"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-[0.5em] text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                userProfileEditFormState.emailAddress !== "" &&
                userProfileEditFormState.emailAddress !==
                  currentUserEmailAddress.current
                  ? emailAddressInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="emailAddress"
              type="email"
              maxLength={150}
              value={userProfileEditFormState.emailAddress}
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
              aria-describedby="update-profile-form__email-address-requirements"
            />
            <label
              lang="en"
              className="absolute text-[0.5em] text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="update-profile-form__email-address"
            >
              Update your email address
            </label>
          </div>
          {userProfileEditFormState.emailAddress &&
            emailAddressInputStatus.focused &&
            !emailAddressInputStatus.valid && (
              <p
                id="update-profile-form__email-address-requirements"
                className="m-0 pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#748696] text-[#ffffff] leading-[1.2] text-[0.55em]"
              >
                <Info />
                {parse(inputInstructions.emailAddressInstructions)}
              </p>
            )}
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
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="update-profile-form__currency"
            >
              Update your default currency{" "}
            </label>
            <select
              id="update-profile-form__currency"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                userProfileEditFormState.currency !== "" &&
                userProfileEditFormState.currency !==
                  currentUserCurrency.current
                  ? currencyInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="currency"
              value={userProfileEditFormState.currency}
              onChange={handleInputChange}
              onFocus={() =>
                dispatchCurrencyInputStatus({ type: "focus", payload: true })
              }
              onBlur={() =>
                dispatchCurrencyInputStatus({ type: "focus", payload: false })
              }
              required={true}
              autoComplete="off"
              aria-invalid={currencyInputStatus.valid ? "false" : "true"}
              aria-describedby="update-profile-form__currency-requirements"
            >
              <option value="">Select an option</option>
              <option value="AED" data-value="united arab emirates dirham">
                AED - United Arab Emirates Dirham
              </option>
              <option value="AFN" data-value="afghan afghani">
                AFN - Afghan Afghani
              </option>
              <option value="ALL" data-value="albanian lek">
                ALL - Albanian Lek
              </option>
              <option value="AMD" data-value="armenian dram">
                AMD - Armenian Dram
              </option>
              <option value="ANG" data-value="netherlands antillean guilder">
                ANG - Netherlands Antillean Guilder
              </option>
              <option value="AOA" data-value="angolan kwanza">
                AOA - Angolan Kwanza
              </option>
              <option value="ARS" data-value="argentine peso">
                ARS - Argentine Peso
              </option>
              <option value="AUD" data-value="australian dollar">
                AUD - Australian Dollar
              </option>
              <option value="AWG" data-value="aruban florin">
                AWG - Aruban Florin
              </option>
              <option value="AZN" data-value="azerbaijani manat">
                AZN - Azerbaijani Manat
              </option>
              <option
                value="BAM"
                data-value="bosnia-herzegovina convertible mark"
              >
                BAM - Bosnia-Herzegovina Convertible Mark
              </option>
              <option value="BBD" data-value="barbadian dollar">
                BBD - Barbadian Dollar
              </option>
              <option value="BDT" data-value="bangladeshi taka">
                BDT - Bangladeshi Taka
              </option>
              <option value="BGN" data-value="bulgarian lev">
                BGN - Bulgarian Lev
              </option>
              <option value="BHD" data-value="bahraini dinar">
                BHD - Bahraini Dinar
              </option>
              <option value="BIF" data-value="burundian franc">
                BIF - Burundian Franc
              </option>
              <option value="BMD" data-value="bermudan dollar">
                BMD - Bermudan Dollar
              </option>
              <option value="BND" data-value="brunei dollar">
                BND - Brunei Dollar
              </option>
              <option value="BOB" data-value="bolivian boliviano">
                BOB - Bolivian Boliviano
              </option>
              <option value="BRL" data-value="brazilian real">
                BRL - Brazilian Real
              </option>
              <option value="BSD" data-value="bahamian dollar">
                BSD - Bahamian Dollar
              </option>
              <option value="BTN" data-value="bhutanese ngultrum">
                BTN - Bhutanese Ngultrum
              </option>
              <option value="BWP" data-value="botswanan pula">
                BWP - Botswanan Pula
              </option>
              <option value="BYN" data-value="new belarusian ruble">
                BYN - New Belarusian Ruble
              </option>
              <option value="BYR" data-value="belarusian ruble">
                BYR - Belarusian Ruble
              </option>
              <option value="BZD" data-value="belize dollar">
                BZD - Belize Dollar
              </option>
              <option value="CAD" data-value="canadian dollar">
                CAD - Canadian Dollar
              </option>
              <option value="CDF" data-value="congolese franc">
                CDF - Congolese Franc
              </option>
              <option value="CHF" data-value="swiss franc">
                CHF - Swiss Franc
              </option>
              <option value="CLF" data-value="chilean unit of account (uf)">
                CLF - Chilean Unit of Account (UF)
              </option>
              <option value="CLP" data-value="chilean peso">
                CLP - Chilean Peso
              </option>
              <option value="CNY" data-value="chinese yuan">
                CNY - Chinese Yuan
              </option>
              <option value="COP" data-value="colombian peso">
                COP - Colombian Peso
              </option>
              <option value="CRC" data-value="costa rican colón">
                CRC - Costa Rican Colón
              </option>
              <option value="CUC" data-value="cuban convertible peso">
                CUC - Cuban Convertible Peso
              </option>
              <option value="CUP" data-value="cuban peso">
                CUP - Cuban Peso
              </option>
              <option value="CVE" data-value="cape verdean escudo">
                CVE - Cape Verdean Escudo
              </option>
              <option value="CZK" data-value="czech republic koruna">
                CZK - Czech Republic Koruna
              </option>
              <option value="DJF" data-value="djiboutian franc">
                DJF - Djiboutian Franc
              </option>
              <option value="DKK" data-value="danish krone">
                DKK - Danish Krone
              </option>
              <option value="DOP" data-value="dominican peso">
                DOP - Dominican Peso
              </option>
              <option value="DZD" data-value="algerian dinar">
                DZD - Algerian Dinar
              </option>
              <option value="EGP" data-value="egyptian pound">
                EGP - Egyptian Pound
              </option>
              <option value="ERN" data-value="eritrean nakfa">
                ERN - Eritrean Nakfa
              </option>
              <option value="ETB" data-value="ethiopian birr">
                ETB - Ethiopian Birr
              </option>
              <option value="EUR" data-value="euro">
                EUR - Euro
              </option>
              <option value="FJD" data-value="fijian dollar">
                FJD - Fijian Dollar
              </option>
              <option value="FKP" data-value="falkland islands pound">
                FKP - Falkland Islands Pound
              </option>
              <option value="GBP" data-value="british pound sterling">
                GBP - British Pound Sterling
              </option>
              <option value="GEL" data-value="georgian lari">
                GEL - Georgian Lari
              </option>
              <option value="GGP" data-value="guernsey pound">
                GGP - Guernsey Pound
              </option>
              <option value="GHS" data-value="ghanaian cedi">
                GHS - Ghanaian Cedi
              </option>
              <option value="GIP" data-value="gibraltar pound">
                GIP - Gibraltar Pound
              </option>
              <option value="GMD" data-value="gambian dalasi">
                GMD - Gambian Dalasi
              </option>
              <option value="GNF" data-value="guinean franc">
                GNF - Guinean Franc
              </option>
              <option value="GTQ" data-value="guatemalan quetzal">
                GTQ - Guatemalan Quetzal
              </option>
              <option value="GYD" data-value="guyanaese dollar">
                GYD - Guyanaese Dollar
              </option>
              <option value="HKD" data-value="hong kong dollar">
                HKD - Hong Kong Dollar
              </option>
              <option value="HNL" data-value="honduran lempira">
                HNL - Honduran Lempira
              </option>
              <option value="HRK" data-value="croatian kuna">
                HRK - Croatian Kuna
              </option>
              <option value="HTG" data-value="haitian gourde">
                HTG - Haitian Gourde
              </option>
              <option value="HUF" data-value="hungarian forint">
                HUF - Hungarian Forint
              </option>
              <option value="IDR" data-value="indonesian rupiah">
                IDR - Indonesian Rupiah
              </option>
              <option value="ILS" data-value="israeli new sheqel">
                ILS - Israeli New Sheqel
              </option>
              <option value="IMP" data-value="manx pound">
                IMP - Manx Pound
              </option>
              <option value="INR" data-value="indian rupee">
                INR - Indian Rupee
              </option>
              <option value="IQD" data-value="iraqi dinar">
                IQD - Iraqi Dinar
              </option>
              <option value="IRR" data-value="iranian rial">
                IRR - Iranian Rial
              </option>
              <option value="ISK" data-value="icelandic króna">
                ISK - Icelandic Króna
              </option>
              <option value="JEP" data-value="jersey pound">
                JEP - Jersey Pound
              </option>
              <option value="JMD" data-value="jamaican dollar">
                JMD - Jamaican Dollar
              </option>
              <option value="JOD" data-value="jordanian dinar">
                JOD - Jordanian Dinar
              </option>
              <option value="JPY" data-value="japanese yen">
                JPY - Japanese Yen
              </option>
              <option value="KES" data-value="kenyan shilling">
                KES - Kenyan Shilling
              </option>
              <option value="KGS" data-value="kyrgystani som">
                KGS - Kyrgystani Som
              </option>
              <option value="KHR" data-value="cambodian riel">
                KHR - Cambodian Riel
              </option>
              <option value="KMF" data-value="comorian franc">
                KMF - Comorian Franc
              </option>
              <option value="KPW" data-value="north korean won">
                KPW - North Korean Won
              </option>
              <option value="KRW" data-value="south korean won">
                KRW - South Korean Won
              </option>
              <option value="KWD" data-value="kuwaiti dinar">
                KWD - Kuwaiti Dinar
              </option>
              <option value="KYD" data-value="cayman islands dollar">
                KYD - Cayman Islands Dollar
              </option>
              <option value="KZT" data-value="kazakhstani tenge">
                KZT - Kazakhstani Tenge
              </option>
              <option value="LAK" data-value="laotian kip">
                LAK - Laotian Kip
              </option>
              <option value="LBP" data-value="lebanese pound">
                LBP - Lebanese Pound
              </option>
              <option value="LKR" data-value="sri lankan rupee">
                LKR - Sri Lankan Rupee
              </option>
              <option value="LRD" data-value="liberian dollar">
                LRD - Liberian Dollar
              </option>
              <option value="LSL" data-value="lesotho loti">
                LSL - Lesotho Loti
              </option>
              <option value="LTL" data-value="lithuanian litas">
                LTL - Lithuanian Litas
              </option>
              <option value="LVL" data-value="latvian lats">
                LVL - Latvian Lats
              </option>
              <option value="LYD" data-value="libyan dinar">
                LYD - Libyan Dinar
              </option>
              <option value="MAD" data-value="moroccan dirham">
                MAD - Moroccan Dirham
              </option>
              <option value="MDL" data-value="moldovan leu">
                MDL - Moldovan Leu
              </option>
              <option value="MGA" data-value="malagasy ariary">
                MGA - Malagasy Ariary
              </option>
              <option value="MKD" data-value="macedonian denar">
                MKD - Macedonian Denar
              </option>
              <option value="MMK" data-value="myanma kyat">
                MMK - Myanmar Kyat
              </option>
              <option value="MNT" data-value="mongolian tugrik">
                MNT - Mongolian Tugrik
              </option>
              <option value="MOP" data-value="macanese pataca">
                MOP - Macanese Pataca
              </option>
              <option value="MRO" data-value="mauritanian ouguiya">
                MRO - Mauritanian Ouguiya
              </option>
              <option value="MUR" data-value="mauritian rupee">
                MUR - Mauritian Rupee
              </option>
              <option value="MVR" data-value="maldivian rufiyaa">
                MVR - Maldivian Rufiyaa
              </option>
              <option value="MWK" data-value="malawian kwacha">
                MWK - Malawian Kwacha
              </option>
              <option value="MXN" data-value="mexican peso">
                MXN - Mexican Peso
              </option>
              <option value="MYR" data-value="malaysian ringgit">
                MYR - Malaysian Ringgit
              </option>
              <option value="MZN" data-value="mozambican metical">
                MZN - Mozambican Metical
              </option>
              <option value="NAD" data-value="namibian dollar">
                NAD - Namibian Dollar
              </option>
              <option value="NGN" data-value="nigerian naira">
                NGN - Nigerian Naira
              </option>
              <option value="NIO" data-value="nicaraguan córdoba">
                NIO - Nicaraguan Córdoba
              </option>
              <option value="NOK" data-value="norwegian krone">
                NOK - Norwegian Krone
              </option>
              <option value="NPR" data-value="nepalese rupee">
                NPR - Nepalese Rupee
              </option>
              <option value="NZD" data-value="new zealand dollar">
                NZD - New Zealand Dollar
              </option>
              <option value="OMR" data-value="omani rial">
                OMR - Omani Rial
              </option>
              <option value="PAB" data-value="panamanian balboa">
                PAB - Panamanian Balboa
              </option>
              <option value="PEN" data-value="peruvian nuevo sol">
                PEN - Peruvian Nuevo Sol
              </option>
              <option value="PGK" data-value="papua new guinean kina">
                PGK - Papua New Guinean Kina
              </option>
              <option value="PHP" data-value="philippine peso">
                PHP - Philippine Peso
              </option>
              <option value="PKR" data-value="pakistani rupee">
                PKR - Pakistani Rupee
              </option>
              <option value="PLN" data-value="polish zloty">
                PLN - Polish Zloty
              </option>
              <option value="PYG" data-value="paraguayan guarani">
                PYG - Paraguayan Guarani
              </option>
              <option value="QAR" data-value="qatari rial">
                QAR - Qatari Rial
              </option>
              <option value="RON" data-value="romanian leu">
                RON - Romanian Leu
              </option>
              <option value="RSD" data-value="serbian dinar">
                RSD - Serbian Dinar
              </option>
              <option value="RUB" data-value="russian ruble">
                RUB - Russian Ruble
              </option>
              <option value="RWF" data-value="rwandan franc">
                RWF - Rwandan Franc
              </option>
              <option value="SAR" data-value="saudi riyal">
                SAR - Saudi Riyal
              </option>
              <option value="SBD" data-value="solomon islands dollar">
                SBD - Solomon Islands Dollar
              </option>
              <option value="SCR" data-value="seychellois rupee">
                SCR - Seychellois Rupee
              </option>
              <option value="SDG" data-value="sudanese pound">
                SDG - Sudanese Pound
              </option>
              <option value="SEK" data-value="swedish krona">
                SEK - Swedish Krona
              </option>
              <option value="SGD" data-value="singapore dollar">
                SGD - Singapore Dollar
              </option>
              <option value="SHP" data-value="saint helena pound">
                SHP - Saint Helena Pound
              </option>
              <option value="SLL" data-value="sierra leonean leone">
                SLL - Sierra Leonean Leone
              </option>
              <option value="SOS" data-value="somali shilling">
                SOS - Somali Shilling
              </option>
              <option value="SRD" data-value="surinamese dollar">
                SRD - Surinamese Dollar
              </option>
              <option value="STD" data-value="são tomé and príncipe dobra">
                STD - São Tomé and Príncipe Dobra
              </option>
              <option value="SVC" data-value="salvadoran colón">
                SVC - Salvadoran Colón
              </option>
              <option value="SYP" data-value="syrian pound">
                SYP - Syrian Pound
              </option>
              <option value="SZL" data-value="swazi lilangeni">
                SZL - Swazi Lilangeni
              </option>
              <option value="THB" data-value="thai baht">
                THB - Thai Baht
              </option>
              <option value="TJS" data-value="tajikistani somoni">
                TJS - Tajikistani Somoni
              </option>
              <option value="TMT" data-value="turkmenistani manat">
                TMT - Turkmenistani Manat
              </option>
              <option value="TND" data-value="tunisian dinar">
                TND - Tunisian Dinar
              </option>
              <option value="TOP" data-value="tongan paʻanga">
                TOP - Tongan Paʻanga
              </option>
              <option value="TRY" data-value="turkish lira">
                TRY - Turkish Lira
              </option>
              <option value="TTD" data-value="trinidad and tobago dollar">
                TTD - Trinidad and Tobago Dollar
              </option>
              <option value="TWD" data-value="new taiwan dollar">
                TWD - New Taiwan Dollar
              </option>
              <option value="TZS" data-value="tanzanian shilling">
                TZS - Tanzanian Shilling
              </option>
              <option value="UAH" data-value="ukrainian hryvnia">
                UAH - Ukrainian Hryvnia
              </option>
              <option value="UGX" data-value="ugandan shilling">
                UGX - Ugandan Shilling
              </option>
              <option value="USD" data-value="united states dollar">
                USD - United States Dollar
              </option>
              <option value="UYU" data-value="uruguayan peso">
                UYU - Uruguayan Peso
              </option>
              <option value="UZS" data-value="uzbekistan som">
                UZS - Uzbekistan Som
              </option>
              <option value="VEF" data-value="venezuelan bolívar fuerte">
                VEF - Venezuelan Bolívar Fuerte
              </option>
              <option value="VND" data-value="vietnamese dong">
                VND - Vietnamese Dong
              </option>
              <option value="VUV" data-value="vanuatu vatu">
                VUV - Vanuatu Vatu
              </option>
              <option value="WST" data-value="samoan tala">
                WST - Samoan Tala
              </option>
              <option value="XAF" data-value="cfa franc beac">
                XAF - CFA Franc BEAC
              </option>
              <option value="XCD" data-value="east caribbean dollar">
                XCD - East Caribbean Dollar
              </option>
              <option value="XOF" data-value="cfa franc bceao">
                XOF - CFA Franc BCEAO
              </option>
              <option value="XPF" data-value="cfp franc">
                XPF - CFP Franc
              </option>
              <option value="YER" data-value="yemeni rial">
                YER - Yemeni Rial
              </option>
              <option value="ZAR" data-value="south african rand">
                ZAR - South African Rand
              </option>
              <option value="ZMW" data-value="zambian kwacha">
                ZMW - Zambian Kwacha
              </option>
              <option value="ZWL" data-value="zimbabwean dollar">
                ZWL - Zimbabwean Dollar
              </option>
            </select>
          </div>
          {userProfileEditFormState.currency &&
            currencyInputStatus.focused &&
            !currencyInputStatus.valid && (
              <p
                id="update-profile-form__currency-requirements"
                className="m-0 pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#748696] text-[#ffffff] leading-[1.2] text-[0.55em]"
              >
                <Info />
                {parse(inputInstructions.currencyInstructions)}
              </p>
            )}
          {errorMessage.currencyError && (
            <p
              ref={currencyErrorRef}
              className="ml-[0] mr-[0] my-[2%] pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#fcb2a2] border-[2px] border-[#ff0000] text-[#000000] leading-[1.2] text-[0.55em]"
              aria-live="assertive"
            >
              {errorMessage.currencyError}
            </p>
          )}
          <div className="relative">
            <input
              id="update-profile-form__password"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-[0.5em] text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                userProfileEditFormState.password !== ""
                  ? passwordInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="password"
              type={passwordVisibilityStatus}
              maxLength={50}
              value={userProfileEditFormState.password}
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
              aria-describedby="update-profile-form__password-requirements"
            />
            <label
              lang="en"
              className="absolute text-[0.5em] text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="update-profile-form__password"
            >
              Update your password
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
          {userProfileEditFormState.password &&
            passwordInputStatus.focused &&
            !passwordInputStatus.valid && (
              <p
                id="update-profile-form__password-requirements"
                className="m-0 pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#748696] text-[#ffffff] leading-[1.2] text-[0.55em]"
              >
                <Info />
                {parse(inputInstructions.passwordInstructions)}
              </p>
            )}
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
              id="update-profile-form__confirm-password"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-[0.5em] text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                userProfileEditFormState.confirmPassword !== ""
                  ? confirmPasswordInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="confirmPassword"
              type={confirmPasswordVisibilityStatus}
              maxLength={50}
              value={userProfileEditFormState.confirmPassword}
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
              aria-describedby="update-profile-form__confirm-password-requirements"
            />
            <label
              lang="en"
              className="absolute text-[0.5em] text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="update-profile-form__confirm-password"
            >
              Confirm new password
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
          {userProfileEditFormState.confirmPassword &&
            confirmPasswordInputStatus.focused &&
            !confirmPasswordInputStatus.valid && (
              <p
                id="update-profile-form__confirm-password-requirements"
                className="m-0 pl-[0.25%] pr-[0.15%] py-[0.15%] w-full rounded-[0.35em] bg-[#748696] text-[#ffffff] leading-[1.2] text-[0.55em]"
              >
                <Info />
                {parse(inputInstructions.confirmPasswordInstructions)}
              </p>
            )}
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
          <div className="mt-[4%] flex flex-row justify-between space-x-2">
            <button
              type="button"
              onClick={() => setDisplayDeleteDialogBox(true)}
              className="px-5 py-2.5 me-2 mb-2 text-white bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 font-medium rounded-full text-[0.5em]"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className={`mb-2 px-5 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-[0.5em] text-center ${
                isSaveButtonDisabled.current
                  ? "!bg-[#c8c8c8] !text-[#dcdcdc] !border-[none]"
                  : ""
              }`}
              lang="en"
              name="save"
              type="button"
              disabled={isSaveButtonDisabled.current ? true : false}
            >
              <i></i>Save
            </button>
          </div>
        </form>
      </div>
      {displayDeleteDialogBox && (
        <div className="z-4 fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
              viewBox="0 0 320.591 320.591"
              onClick={() => setDisplayDeleteDialogBox(false)}
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>

            <div className="my-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 fill-red-500 inline"
                viewBox="0 0 286.054 286.054"
              >
                <path
                  fill="#e2574c"
                  d="M143.027 0C64.04 0 0 64.04 0 143.027c0 78.996 64.04 143.027 143.027 143.027 78.996 0 143.027-64.022 143.027-143.027C286.054 64.04 222.022 0 143.027 0zm0 259.236c-64.183 0-116.209-52.026-116.209-116.209S78.844 26.818 143.027 26.818s116.209 52.026 116.209 116.209-52.026 116.209-116.209 116.209zm.009-196.51c-10.244 0-17.995 5.346-17.995 13.981v79.201c0 8.644 7.75 13.972 17.995 13.972 9.994 0 17.995-5.551 17.995-13.972V76.707c-.001-8.43-8.001-13.981-17.995-13.981zm0 124.997c-9.842 0-17.852 8.01-17.852 17.86 0 9.833 8.01 17.843 17.852 17.843s17.843-8.01 17.843-17.843c-.001-9.851-8.001-17.86-17.843-17.86z"
                  data-original="#e2574c"
                />
              </svg>

              <h4 className="text-lg text-gray-800 font-semibold mt-6">
                Your account and all your notes will be deleted permanently!
              </h4>
              <p className="text-[0.5em] text-gray-500 mt-2">
                Are you sure you want to proceed?
              </p>
            </div>

            <div className="flex max-sm:flex-col gap-4">
              <button
                type="button"
                onClick={() => setDisplayDeleteDialogBox(false)}
                className="px-5 py-2.5 rounded-lg w-full tracking-wide text-gray-800 text-[0.5em] border-none outline-none bg-gray-200 hover:bg-gray-300"
              >
                I am not sure
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-lg w-full tracking-wide text-white text-[0.5em] border-none outline-none bg-red-500 hover:bg-red-600"
              >
                Yes, delete my account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
