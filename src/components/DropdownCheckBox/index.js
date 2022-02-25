import React, { useEffect, useState } from "react";
import Feather from "../Feather";
import "../../scss/components/_drcheckbox.scss";
import Checkbox from "../CheckBox";
import { useOnClickOutside } from "../../utils/onClickOutside";

const DropdownCheckBox = ({
  defaultValue = null,
  options = [],
  placeholder = "",
  onRef = React.createRef(),
  onChildRef = React.createRef(),
  holdChild = true,
  handleChange = () => {},
  multiple = false,
  ...props
}) => {
  const [viewMode, setViewMode] = useState(true);
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  const showOptionsPanel = (e) => {
    setViewMode(!viewMode);
  };

  useOnClickOutside(onRef, () => setViewMode(true));

  return (
    <div className="drop-checkbox" ref={onRef}>
      <div className="idle" onClick={showOptionsPanel}>
        <div className="selected-items">
          {selected &&
            selected.map((val) => (
              <div className="item" key={val.value}>
                <span>{val.label}</span>
                <Feather
                  name="X"
                  onClick={(val) => {
                    const temp = [...selected];
                    const index = temp.findIndex((t) => t.value === val.value);
                    temp.splice(index, 1);
                    setSelected(temp);
                    handleChange(multiple ? temp : temp[0]);
                  }}
                />
              </div>
            ))}
        </div>
        <Feather name={`${"ChevronDown"}`} className={"arrow_icon"} />
      </div>
      {!viewMode && (
        <div
          className="panel"
          ref={onChildRef}
          onClick={() => (!holdChild ? setViewMode(true) : {})}
        >
          <ul className="panel__checkbox-list">
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`${
                  selected
                    ? selected.findIndex((e) => e.value === opt.value) !== -1
                      ? "selected"
                      : ""
                    : ""
                }`}
              >
                <Checkbox
                  checked={
                    selected
                      ? selected.findIndex((e) => e.value === opt.value) !== -1
                      : false
                  }
                  onChange={() => {
                    if (!multiple) {
                      setSelected([opt]);
                      setViewMode(!viewMode);
                      handleChange(opt);
                      return;
                    }
                    if (!selected) {
                      setSelected([opt]);
                      handleChange([opt]);
                      return;
                    }
                    const index = selected.findIndex(
                      (e) => e.value === opt.value
                    );
                    if (index === -1) {
                      setSelected([...selected, opt]);
                      handleChange([...selected, opt]);
                    } else {
                      const temp = [...selected];
                      temp.splice(index, 1);
                      setSelected(temp);
                      handleChange(temp);
                    }
                  }}
                />
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownCheckBox;
