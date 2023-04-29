import React, {useEffect, useState} from 'react';
import {Button} from "components";
import get from "lodash/get";
import EntityActions from "modules/entity/actions";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import { useNotification } from "hooks";
import Select from 'react-select';

const FmSettings = ({size, setSize, selected, filterType, setFilterType}) => {
  const [fileTitle, setFileTitle] = useState(get(selected, 'title', ""));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFileTitle(get(selected, 'title'));
  }, [get(selected, 'title')]);

  const {t} = useTranslation();
  const dispatch = useDispatch();
  const { notification } = useNotification();

  const changeFileName = () => {
    dispatch(EntityActions.Form.request({
      method: 'put',
      entity: 'files',
      name: `allFiles-${filterType}`,
      url: `/filemanager/${selected.id}`,
      primaryKey: "id",
      id: selected.id,
      values: {title: fileTitle},
      updateData: true,
      normalizeData: data => data,
      cb: {
        success: () => {
          notification("Успешно", {
            type: "success"
          });
        },
        error: () => {
          notification("", {
            type: "danger"
          });
        },
        finally: () => {
          // this.setState({ loading: false });
        }
      }
    }))
  };

  const deleteFile = () => {
    setLoading(true);
    dispatch(EntityActions.Form.request({
      method: "delete",
      entity: 'files',
      name: `allFiles-${filterType}`,
      url: `/filemanager/${selected.id}`,
      primaryKey: "id",
      id: selected.id,
      deleteData: true,
      cb: {
        success: () => {
          notification("Успешно удалено", {
            type: "success"
          });
        },
        error: () => {
          notification("", {
            type: "danger"
          });
        },
        finally: () => {
          setLoading(false)
        }
      }
    }))
  };

  const onEnter = (event) => {
    if (event.keyCode === 13) {
      changeFileName();
    }
  };

  const onBlur = (value) => {
    if(get(selected, 'title') !== value){
      changeFileName()
    }
  };

  const filterOptions = [
    {value: 'images', label: 'Картинки'},
    {value: 'documents', label: 'Документы'},
  ]
  const sizeOptions = [
    {value: 'normal', label: 'Большой'},
    {value: 'low', label: 'Средный'},
    {value: 'small', label: 'Маленький'},
  ]
  const valueFilter = filterOptions.find(f => f.value === filterType)
  const valueSize = sizeOptions.find(s => s.value === size)
  return (
    <div className="fm-settings">

      <div style={{marginBottom: '20px'}}>
        <div className="label">Фильтр</div>
        <Select
            className="basic-single"
            classNamePrefix="select"
            value={valueFilter}
            isSearchable={true}
            name="color"
            options={filterOptions}
            onChange={option => setFilterType(option.value)}
        />
      </div>
      <div style={{marginBottom: '20px'}}>
        <div className="label">Размер картинки</div>
        <Select
            className="basic-single"
            classNamePrefix="select"
            value={valueSize}
            isSearchable={true}
            name="color"
            options={sizeOptions}
            onChange={option => setSize(option.value)}
        />
      </div>
      {selected && (
        <>
          <div style={{marginBottom: "30px"}}>
            <div className="label">Переименовать названия</div>
            <input
                name="alt"
                className={`form-control`}
                value={fileTitle}
                placeholder="текст"
                onChange={e => setFileTitle(e.target.value)}
                onBlur={(e) => onBlur(e.target.value)}
                onKeyDown={(e) => onEnter(e) }
            />
          </div>
          <div className="delete-image">
            <div className="label">Так же можете удалить картинку.</div>
            <Button.Default
                type="danger"
                buttonType="html"
                loading={loading}
                onClick={() => deleteFile()}
            >
              {t("Удалить")}
            </Button.Default>
          </div>
        </>
      )}
    </div>
  );
};

export default FmSettings;
