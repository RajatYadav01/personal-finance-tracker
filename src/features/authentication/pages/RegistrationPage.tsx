import axios from "axios";
import parse from "html-react-parser";
import { EyeClosed, Eye, Info } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router";
import { useState, useEffect, useReducer, useRef } from "react";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import { register } from "../services/User";

interface RegistrationFormType {
  name: string;
  emailAddress: string;
  currency: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormInputStatusType {
  valid: boolean;
  focused: boolean;
}

interface RegistrationFormInputActionType {
  type: string;
  payload: boolean;
}

const registrationFormInputStatusInitialState = {
  valid: true,
  focused: false,
};

const inputStatusReducer = (
  state: RegistrationFormInputStatusType,
  action: RegistrationFormInputActionType
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

interface RegistrationFormErrorsType {
  nameError: string;
  emailAddressError: string;
  currencyError: string;
  passwordError: string;
  confirmPasswordError: string;
  registrationError: string;
}

interface RegistrationFormErrorsActionType {
  type: string;
  payload: string;
}

const registrationFormErrorsInitialState = {
  nameError: "",
  emailAddressError: "",
  currencyError: "",
  passwordError: "",
  confirmPasswordError: "",
  registrationError: "",
};

function errorReducer(
  state: RegistrationFormErrorsType,
  action: RegistrationFormErrorsActionType
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
    case "registration":
      return { ...state, registrationError: action.payload };
    default:
      throw new Error();
  }
}

const inputInstructions = {
  nameInstructions:
    "Must be between 2 to 75 characters<br />Only letters allowed",
  emailAddressInstructions:
    "Must be between 3 to 150 characters<br />Letters, numbers and some special characters allowed<br />Allowed special characters: <span aria-label='at symbol'>@</span> <span aria-label='dot symbol'>.</span> <span aria-label='hyphen'>-</span> <span aria-label='underscore symbol'>_</span>",
  currencyInstructions: "Select a currency from the dropdown list",
  passwordInstructions:
    "Must contain at least 8 characters<br />Must contain at least 1 upper case letter<br />Must contain at least 1 lower case letter<br />Must contain at least 1 digit<br />Must contain at least 1 of the special characters: <span aria-label='exclamation symbol'>!</span> <span aria-label='at symbol'>@</span> <span aria-label='hash symbol'>#</span> <span aria-label='dollar symbol'>$</span> <span aria-label='percent symbol'>%</span> <span aria-label='caret symbol'>^</span> <span aria-label='ampersand symbol'>&</span> <span aria-label='asterisk symbol'>*</span> <span aria-label='hyphen symbol'>-</span> <span aria-label='underscore symbol'>_</span> <span aria-label='dot symbol'>.</span> <span aria-label='question mark symbol'>?</span>",
  confirmPasswordInstructions: "Must match with the password",
};

export const RegistrationPage = () => {
  const [registrationFormState, setRegistrationFormState] =
    useState<RegistrationFormType>({
      name: "",
      emailAddress: "",
      currency: "",
      password: "",
      confirmPassword: "",
    });

  const [loadingIconState, setLoadingIconState] = useState(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const registrationErrorRef = useRef<HTMLParagraphElement | null>(null);
  const nameErrorRef = useRef<HTMLParagraphElement | null>(null);
  const emailAddressErrorRef = useRef<HTMLParagraphElement | null>(null);
  const currencyErrorRef = useRef<HTMLParagraphElement | null>(null);
  const passwordErrorRef = useRef<HTMLParagraphElement | null>(null);
  const confirmPasswordErrorRef = useRef<HTMLParagraphElement | null>(null);

  const [nameInputStatus, dispatchNameInputStatus] = useReducer(
    inputStatusReducer,
    registrationFormInputStatusInitialState
  );
  const [emailAddressInputStatus, dispatchEmailAddressInputStatus] = useReducer(
    inputStatusReducer,
    registrationFormInputStatusInitialState
  );
  const [currencyInputStatus, dispatchCurrencyInputStatus] = useReducer(
    inputStatusReducer,
    registrationFormInputStatusInitialState
  );
  const [passwordInputStatus, dispatchPasswordInputStatus] = useReducer(
    inputStatusReducer,
    registrationFormInputStatusInitialState
  );
  const [confirmPasswordInputStatus, dispatchConfirmPasswordInputStatus] =
    useReducer(inputStatusReducer, registrationFormInputStatusInitialState);

  const [errorMessage, dispatchErrorMessage] = useReducer(
    errorReducer,
    registrationFormErrorsInitialState
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

  const isRegistrationButtonDisabled =
    !nameInputStatus.valid ||
    !emailAddressInputStatus.valid ||
    !passwordInputStatus.valid ||
    !confirmPasswordInputStatus.valid;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setRegistrationFormState((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    const nameValidationResult = nameRegEx.test(registrationFormState.name);
    dispatchNameInputStatus({ type: "valid", payload: nameValidationResult });
  }, [registrationFormState.name]);

  useEffect(() => {
    const emailAddressValidationResult = emailAddressRegEx.test(
      registrationFormState.emailAddress
    );
    dispatchEmailAddressInputStatus({
      type: "valid",
      payload: emailAddressValidationResult,
    });
  }, [registrationFormState.emailAddress]);

  useEffect(() => {
    const currencyValidationResult = currencyRegEx.test(
      registrationFormState.currency
    );
    dispatchCurrencyInputStatus({
      type: "valid",
      payload: currencyValidationResult,
    });
  }, [registrationFormState.currency]);

  useEffect(() => {
    const passwordValidationResult = passwordRegEx.test(
      registrationFormState.password
    );
    dispatchPasswordInputStatus({
      type: "valid",
      payload: passwordValidationResult,
    });
  }, [registrationFormState.password]);

  useEffect(() => {
    const confirmPasswordValidationResult =
      passwordRegEx.test(registrationFormState.confirmPassword) &&
      registrationFormState.confirmPassword === registrationFormState.password
        ? true
        : false;
    dispatchConfirmPasswordInputStatus({
      type: "valid",
      payload: confirmPasswordValidationResult,
    });
  }, [registrationFormState.password, registrationFormState.confirmPassword]);

  useEffect(() => {
    dispatchErrorMessage({ type: "name", payload: "" });
    dispatchErrorMessage({ type: "registration", payload: "" });
  }, [registrationFormState.name]);

  useEffect(() => {
    dispatchErrorMessage({ type: "emailAddress", payload: "" });
    dispatchErrorMessage({ type: "registration", payload: "" });
  }, [registrationFormState.emailAddress]);

  useEffect(() => {
    dispatchErrorMessage({ type: "currency", payload: "" });
    dispatchErrorMessage({ type: "registration", payload: "" });
  }, [registrationFormState.currency]);

  useEffect(() => {
    dispatchErrorMessage({ type: "password", payload: "" });
    dispatchErrorMessage({ type: "registration", payload: "" });
  }, [registrationFormState.password]);

  useEffect(() => {
    dispatchErrorMessage({ type: "confirmPassword", payload: "" });
    dispatchErrorMessage({ type: "registration", payload: "" });
  }, [registrationFormState.confirmPassword]);

  const navigate = useNavigate();

  const handleRegistration = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const nameValidation = () => {
      if (registrationFormState.name === "") {
        dispatchErrorMessage({
          type: "name",
          payload: "Name cannot be empty.",
        });
        dispatchNameInputStatus({ type: "valid", payload: false });
      } else if (!nameRegEx.test(registrationFormState.name)) {
        dispatchErrorMessage({ type: "name", payload: "Invalid name." });
        dispatchNameInputStatus({ type: "valid", payload: false });
      }
    };
    const emailAddressValidation = () => {
      if (registrationFormState.emailAddress === "") {
        dispatchErrorMessage({
          type: "emailAddress",
          payload: "Email address cannot be empty.",
        });
        dispatchEmailAddressInputStatus({ type: "valid", payload: false });
      } else if (!emailAddressRegEx.test(registrationFormState.emailAddress)) {
        dispatchErrorMessage({
          type: "emailAddress",
          payload: "Invalid email address.",
        });
        dispatchEmailAddressInputStatus({ type: "valid", payload: false });
      }
    };
    const currencyValidation = () => {
      if (registrationFormState.currency === "") {
        dispatchErrorMessage({
          type: "currency",
          payload: "Currency cannot be empty",
        });
        dispatchCurrencyInputStatus({ type: "valid", payload: false });
      } else if (!currencyRegEx.test(registrationFormState.currency)) {
        dispatchErrorMessage({
          type: "currency",
          payload: "Invalid currency",
        });
        dispatchCurrencyInputStatus({ type: "valid", payload: false });
      }
    };
    const passwordValidation = () => {
      if (registrationFormState.password === "") {
        dispatchErrorMessage({
          type: "password",
          payload: "Password cannot be empty.",
        });
        dispatchPasswordInputStatus({ type: "valid", payload: false });
      } else if (!passwordRegEx.test(registrationFormState.password)) {
        dispatchErrorMessage({
          type: "password",
          payload: "Invalid password.",
        });
        dispatchPasswordInputStatus({ type: "valid", payload: false });
      }
    };
    const confirmPasswordValidation = () => {
      if (registrationFormState.confirmPassword === "") {
        dispatchErrorMessage({
          type: "confirmPassword",
          payload: "Confirm password cannot be empty.",
        });
        dispatchConfirmPasswordInputStatus({ type: "valid", payload: false });
      } else if (
        !(
          passwordRegEx.test(registrationFormState.confirmPassword) &&
          registrationFormState.confirmPassword ===
            registrationFormState.password
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
    currencyValidation();
    passwordValidation();
    confirmPasswordValidation();
    if (
      !nameInputStatus.valid ||
      !emailAddressInputStatus.valid ||
      !currencyInputStatus.valid ||
      !passwordInputStatus.valid ||
      !confirmPasswordInputStatus.valid
    ) {
      dispatchErrorMessage({ type: "registration", payload: "Invalid data" });
      return;
    }
    if (
      nameInputStatus.valid &&
      emailAddressInputStatus.valid &&
      currencyInputStatus.valid &&
      passwordInputStatus.valid &&
      confirmPasswordInputStatus.valid
    ) {
      try {
        setLoadingIconState(true);
        const registrationFormData = JSON.stringify({
          user: registrationFormState,
        });
        const userRegistration = await register(registrationFormData);
        if (userRegistration === "Registration successful") {
          toast.success("Your account has been successfully created.");
          toast.success("Log in to your new account.");
          setRegistrationFormState({
            name: "",
            emailAddress: "",
            currency: "",
            password: "",
            confirmPassword: "",
          });
          navigate("/login");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error) {
            console.error(error);
            const errorMessage = error.response?.data.message
              ? error.response?.data.message
              : error.message;
            dispatchErrorMessage({
              type: "registration",
              payload: errorMessage,
            });
          }
        }
        registrationErrorRef.current?.focus();
      } finally {
        setLoadingIconState(false);
      }
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-gradient-to-br from-blue-50 to-white font-lato">
      <Header pageType="Registration" />
      <div className="w-full h-full flex flex-col text-[1.25rem] md:text-[2rem] lg:text-[2.25rem]">
        <h3 className="mx-auto mt-4 mb-[1%] w-full h-[9%] text-[#646464] text-center text-[1em] font-lato font-[500]">
          Create account
        </h3>
        {errorMessage.registrationError && (
          <p
            ref={registrationErrorRef}
            className="mx-auto my-[2%] pl-[0.25%] pr-[0.15%] py-[0.15%] w-full lg:w-[80%] rounded-[0.35em] bg-[#fcb2a2] border-[2px] border-[#ff0000] text-[#000000] leading-[1.2] text-[0.55em]"
            aria-live="assertive"
          >
            {errorMessage.registrationError}
          </p>
        )}
        <form
          className="mt-[1%] mb-[1%] mx-0 md:mx-auto p-5 w-full lg:w-[80%] h-[50%] lg:h-[60%] rounded-3xl bg-gray-200 text-[1.75rem] font-inter"
          onSubmit={handleRegistration}
          method="POST"
        >
          <div className="relative">
            <input
              id="registration-form__name"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                registrationFormState.name !== ""
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
              value={registrationFormState.name}
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
              aria-describedby="registration-form__name-requirements"
            />
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="registration-form__name"
            >
              Enter your name
            </label>
          </div>
          {registrationFormState.name &&
            nameInputStatus.focused &&
            !nameInputStatus.valid && (
              <p
                id="registration-form__name-requirements"
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
              id="registration-form__email-address"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                registrationFormState.emailAddress !== ""
                  ? emailAddressInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="emailAddress"
              type="email"
              maxLength={150}
              value={registrationFormState.emailAddress}
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
              aria-describedby="registration-form__email-address-requirements"
            />
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="registration-form__email-address"
            >
              Enter your email address
            </label>
          </div>
          {registrationFormState.emailAddress &&
            emailAddressInputStatus.focused &&
            !emailAddressInputStatus.valid && (
              <p
                id="registration-form__email-address-requirements"
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
              htmlFor="registration-form__currency"
            >
              Choose your default currency{" "}
            </label>
            <select
              id="registration-form__currency"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                registrationFormState.currency !== ""
                  ? currencyInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="currency"
              value={registrationFormState.currency}
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
              aria-describedby="registration-form__currency-requirements"
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
          {registrationFormState.currency &&
            currencyInputStatus.focused &&
            !currencyInputStatus.valid && (
              <p
                id="registration-form__currency-requirements"
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
              id="registration-form__password"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                registrationFormState.password !== ""
                  ? passwordInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="password"
              type={passwordVisibilityStatus}
              maxLength={50}
              value={registrationFormState.password}
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
              aria-describedby="registration-form__password-requirements"
            />
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="registration-form__password"
            >
              Create new password
            </label>
            <span className="absolute inset-y-0 end-0 flex items-center z-1 px-2 cursor-pointer text-[0.6em]">
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
          {registrationFormState.password &&
            passwordInputStatus.focused &&
            !passwordInputStatus.valid && (
              <p
                id="registration-form__password-requirements"
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
              id="registration-form__confirm-password"
              className={`mt-[2%] mb-[1%] focus:outline-[none] focus:active:opacity-100 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                registrationFormState.confirmPassword !== ""
                  ? confirmPasswordInputStatus.valid
                    ? "!border-[2px] !border-[#0bd40b]"
                    : "!border-[2px] !border-[#ff0000]"
                  : ""
              }`}
              lang="en"
              name="confirmPassword"
              type={confirmPasswordVisibilityStatus}
              maxLength={50}
              value={registrationFormState.confirmPassword}
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
              aria-describedby="registration-form__confirm-password-requirements"
            />
            <label
              lang="en"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              htmlFor="registration-form__confirm-password"
            >
              Confirm password
            </label>
            <span className="absolute inset-y-0 end-0 flex items-center z-1 px-2 cursor-pointer text-[0.6em]">
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
          {registrationFormState.confirmPassword &&
            confirmPasswordInputStatus.focused &&
            !confirmPasswordInputStatus.valid && (
              <p
                id="registration-form__confirm-password-requirements"
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
          <button
            className={`mt-[6%] ml-[40%] lg:ml-[45%] me-2 mb-2 p-1.5 md:p-2.5 w-[25%] md:w-[20%] lg:w-[15%] text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full font-medium text-[0.5em] text-center ${
              isRegistrationButtonDisabled
                ? "!bg-[#c8c8c8] !text-[#dcdcdc] !border-[none]"
                : ""
            }`}
            lang="en"
            name="signup"
            type="submit"
            disabled={isRegistrationButtonDisabled ? true : false}
          >
            <i></i>REGISTER
          </button>
        </form>
        <div className="flex flex-row items-center mx-auto my-8 h-[9%]">
          <h4 className="flex-[1_1_auto] flex justify-end m-0 p-[0] h-full text-right text-[#646464] font-medium text-[0.7em]">
            Already have an account?
          </h4>
          <Link
            className="overflow-hidden flex-[1_1_auto] flex justify-start relative pl-3 h-full text-[#2d9ef6] no-underline font-medium text-[0.7em] leading-loose rounded [transition:letter-spacing_0.2s,_box-shadow_0.1s,_transform_0.1s,_background-color_0.2s_ease-out] hover:underline"
            to="/login"
          >
            Log in
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
