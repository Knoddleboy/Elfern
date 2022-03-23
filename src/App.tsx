import React, { useState } from "react";
import readFile from "@utils/readFile";

import Titlebar from "@components/Titlebar";
import RulesSection from "@components/RulesSection";
import Modal from "@components/Modal";
import Settings from "@components/Settings";

import "./App.scss";

const App: React.FC = () => {
    const [modalState, setModalState] = useState(false);

    return (
        <React.Fragment>
            <Titlebar />
            <div
                className="App w-full bg-green-primary overflow-hidden"
                style={{ height: "calc(100vh - 1.5rem)" }}
            >
                {modalState && (
                    <Modal
                        isOpen={modalState}
                        toggleModal={setModalState}
                        displayData={readFile("src/assets/data/rules.md")}
                    />
                )}
                <RulesSection toggleModal={setModalState} />
                <Settings />
            </div>
        </React.Fragment>
    );
};

export default App;