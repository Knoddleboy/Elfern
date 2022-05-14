import React, { useState, useRef } from "react";

import AudioClick from "@components/AudioClick";
import { APPLICATION_MEDIA } from "@constants/global";

import "./Switch.scss";

interface ISwitch {
    size?: number;
    onChange?: () => void;
    defaultChecked?: boolean;
}

const Switch: React.FC<ISwitch> = ({ size, onChange, defaultChecked }) => {
    const [switchState, setSwitchState] = useState(defaultChecked || false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = () => {
        setSwitchState((prevState) => !prevState);
        if (onChange) onChange();
    };

    return (
        <AudioClick sound={APPLICATION_MEDIA.click}>
            <div
                className={`switch-root ${
                    switchState ? "switch-checked" : ""
                } relative z-0 cursor-pointer overflow-hidden`}
                style={{
                    width: size ? 2 * size + "rem" : "2.5rem",
                    height: size ? size + "rem" : "1.25rem",
                }}
            >
                <div
                    className={`switch-base
                absolute top-0 left-0 z-1
                rounded-full select-none
                inline-flex items-center
                bg-white-normal cursor-pointer`}
                >
                    <input
                        type="checkbox"
                        className="absolute w-[300%] h-full top-0 -left-full opacity-0 cursor-[inherit] z-[1]"
                        ref={inputRef}
                        onChange={handleChange}
                        tabIndex={0}
                    />
                    <div
                        className={`switch-thumb rounded-full cursor-[inherit]`}
                        style={{
                            width: size ? `calc(${size}rem - 3px)` : "calc(1.25rem - 3px)",
                            height: size ? `calc(${size}rem - 3px)` : "calc(1.25rem - 3px)",
                        }}
                    ></div>
                </div>
                <div className={`switch-track w-full h-full rounded-full cursor-pointer -z-[1]`}></div>
            </div>
        </AudioClick>
    );
};

export default Switch;