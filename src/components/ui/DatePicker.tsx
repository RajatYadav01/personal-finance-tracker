import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input from "./Input";

interface DatePickerProps {
  selected?: Date;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date;
  endDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
      placeholder="Select date"
    />
  )
);

CustomInput.displayName = "CustomInput";

export default function DatePicker({
  selected,
  onChange,
  placeholderText = "Select date",
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  minDate,
  maxDate,
}: DatePickerProps) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      customInput={<CustomInput />}
      placeholderText={placeholderText}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      maxDate={maxDate}
      className="w-full"
    />
  );
}
