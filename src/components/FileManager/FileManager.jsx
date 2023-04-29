import React, {useState} from 'react';
import "./style.scss";
import {Modal} from "components";

import FMFolders from "./components/fmFolders";
import FMList from "./components/fmList";
import FMListMulti from "./components/fmListMulti";
import FMSettings from "./components/fmSettings";

const FileManager = ({
                         addImage,
                         visible = false,
                         onCancel = () => {},
                         isDocument,
                         isMulti
                     }) => {
    const [isLoading, setLoading] = useState(false);
    const [size, setSize] = useState('low');

    const [selected, setSelected] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const [activeFolder, setActiveFolder] = useState(null);
    const [filterType, setFilterType] = useState(isDocument ? 'documents' : 'images');

    return(
        <Modal.Default
            header="File Manager"
            toggle={visible}
            setToggle={onCancel}
            className="file-manager file-manager-modal z-index-1"
            okText={"Добавить"}
            exitBtn={true}
            cancelText="Назад"
            onOk={() => {
                if(isMulti){
                    addImage(selectedItems);
                }else{
                    addImage(selected);
                }
                onCancel();
                setTimeout(() => {
                    setSelected(null);
                    setSelectedItems([]);
                }, 300)
            }}
        >
            {visible && (
                <div className="fm-block">
                    <FMFolders {...{setActiveFolder, activeFolder}}/>
                    {isMulti ? (
                        <FMListMulti {...{
                            selectedItems,
                            setSelectedItems,
                            filterType,
                            activeFolder,
                            setLoading,
                            isLoading,
                        }}/>
                    ) : (
                        <FMList {...{
                            isMulti,
                            selected,
                            setSelected,
                            filterType,
                            activeFolder,
                            setLoading,
                            isLoading,
                        }}/>
                    )}
                    <FMSettings {...{size, setSize, selected, filterType, setFilterType}}/>
                </div>
            )}
        </Modal.Default>
    )
};

export default FileManager;
