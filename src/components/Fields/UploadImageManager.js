import React, { useState } from 'react';

import { FileManager, Grid } from "components";
import get from "lodash/get";

import { ReactComponent as DeleteIcon } from "./icons/delete.svg";
import cx from "classnames";
import { time, helpers } from "services";

const UploadImageManager = ({ isMulti, isDocument = false, limit = 1, label, field, form: { touched, errors, setFieldValue, values }, className }) => {
    const [visible, setVisible] = useState(false);

    const removeHandler = selected => {
        setFieldValue(field.name, values[field.name].filter(item => item.id !== selected.id))
    };

    const classNames = cx("upload-photos", touched[field.name] && errors[field.name] && "has-error", className);
    return (
        <>
            <FileManager
                addImage={({ selected }) => {
                    if (isMulti) {
                        setFieldValue(field.name, [...values[field.name], selected])
                    } else {
                        setFieldValue(field.name, [selected])
                    }
                }}
                onCancel={() => {
                    setVisible(false)
                }}
                visible={visible}
                isDocument={isDocument}
            />
            <div className={classNames}>
                {label && <div className="ant-label">{label}</div>}
                <div className="preview-list">
                    {isDocument ? (
                        <div className="w-100p">
                            <Grid.Row gutter={5} wrap>
                                {values[field.name].map((item, i) => (
                                    <Grid.Column xs={12} gutter={5} key={i}>
                                        <div className="doc-file pad-0 mb-10" key={i}>
                                            <div className="doc-file__item">
                                                <div className="delete-btn" onClick={() => removeHandler(item)}>
                                                    <DeleteIcon height={22} width={22} />
                                                </div>
                                                <div className="doc-file__ext">{get(item, 'ext')}</div>
                                                <div className="doc-file__content">
                                                    <div className="doc-file__title">{get(item, 'title')}</div>
                                                    <div className="d-flex fs-12">
                                                        <div className="w-50p pr-10 d-flex">
                                                            {/*<div className="fw-500">Размер:</div>*/}
                                                            <div className="">{helpers.formatBytes(get(item, 'size'))}</div>
                                                        </div>
                                                        <div className="w-50p pl-10 d-flex">
                                                            {/*<div className="fw-500">Дата:</div>*/}
                                                            <div className="">{time.to(get(item, 'created_at'))}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid.Column>
                                ))}
                            </Grid.Row>
                        </div>
                    ) : (
                        <>
                            {values[field.name].map((item, i) => (
                                <div className="preview-item" key={get(item, 'id', `${i}`)}>
                                    <div className="delete-btn" onClick={() => removeHandler(item)}>
                                        <DeleteIcon height={22} width={22} />
                                    </div>
                                    <img src={get(item, 'thumbnails.small.src')} alt="" />
                                </div>
                            ))}
                        </>
                    )}


                    {limit > values[field.name].length && (
                        <div
                            className="add-image-btn"
                            onClick={() => setVisible(true)}
                        >
                            Загрузите
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default UploadImageManager;
