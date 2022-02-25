import React, { useState, useEffect } from "react";
import styled from "styled-components";

import "../../scss/components/_dropdown.scss";
import Feather from "../Feather";
import { nonAccentVietnamese } from "../../utils/stringUtil";

const Panel = styled.ul``;

export default function Dropdown({
  options,
  disabled = false,
  placeholder = "Select item",
  defaultValue = {},
  onChange = () => {},
  onRef = React.createRef(),
  className = "",
  value = null,
  ...props
}) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [dd_options, setOptions] = useState(options);
  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    const filterOptions = (event) => {
      if (displayMenu && event.keyCode >= 48 && event.keyCode <= 90)
        setOptions(
          options.filter((o) =>
            nonAccentVietnamese(o.value.toLocaleLowerCase()).startsWith(
              event.key
            )
          )
        );
      else setOptions(options);
    };
    window.addEventListener("keydown", filterOptions);

    return () => {
      window.removeEventListener("keydown", filterOptions);
    };
  }, [displayMenu]);

  const selectedProps = selected
    ? options.find((opt) => opt.value === selected.value)
    : {};
  return (
    <div
      {...props}
      onClick={() => (!disabled ? setDisplayMenu(true) : {})}
      className={`dropdown ${disabled ? "dropdown--disabled" : ""} ${
        displayMenu && selected ? "dropdown--chosen" : ""
      } ${className}`}
      tabIndex="0"
      style={{ background: selectedProps?.bg }}
      onBlur={() => setDisplayMenu(false)}
      ref={onRef}
    >
      <div
        className={`dropdown__selected`}
        style={{ color: selectedProps?.color }}
      >
        {selected && selected.label ? (
          <div className="text-break">{selected?.label}</div>
        ) : (
          <div className="placeholder">{placeholder}</div>
        )}
        <Feather
          name={`${"ChevronDown"}`}
          className={`arrow_icon ${displayMenu ? "arrow_icon--rotate" : ""}`}
        />
      </div>

      {displayMenu && !disabled && (
        <Panel
          // nottoggle={'true'}
          className="dropdown__menu"
        >
          {dd_options?.map((opt) => (
            <li
              // nottoggle={'true'}
              className={`dropdown__item ${
                selected ? (selected.value === opt.value ? "active" : "") : ""
              }`}
              key={opt.value}
              onClick={() => {
                setTimeout(() => {
                  onChange(opt);
                  setSelected(opt);
                  setDisplayMenu(false);
                }, 100);
              }}
            >
              <span>{opt.label}</span>
            </li>
          ))}
        </Panel>
      )}
    </div>
  );
}
