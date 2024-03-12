import React, { useState } from 'react';
import Swal from 'sweetalert2';
import * as api from "../../api/api";

const Edit = ({ items, selectedItem, setItems, setIsEditing, password, isInstitutesEntries }) => {
  const selectedId = selectedItem.id;

  const [name, setName] = useState(selectedItem.name);
  const [id, setId] = useState(selectedItem.id);
  const [coordinateLat, setCoordinateLat] = useState(selectedItem.coordinate.lat);
  const [coordinateLong, setCoordinateLong] = useState(selectedItem.coordinate.long);
  const [countryId, setCountryId] = useState(selectedItem.countryId);
  const [stateId, setStateId] = useState(selectedItem.stateId);

  const handleUpdate = e => {
    e.preventDefault();

    if (!name || !id || !coordinateLat || !coordinateLong || isInstitutesEntries ? !stateId: !countryId) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    let item = {
      name,
      id,
      coordinate: {
        lat: Number(coordinateLat),
        long: Number(coordinateLong),
      },
      countryId,
      stateId
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === selectedId) {
        items.splice(i, 1, item);
        break;
      }
    }

    Swal.fire({
      icon: undefined,
      title: 'Updating item...',
      timer: 1500,
      text: `Updating ${name} data.`,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      didClose: () => {
        setItems(items);
        setIsEditing(false);
      }
    });
    Swal.stopTimer()

    let request;
    if(isInstitutesEntries){
      request = api.uploadInstitutes(items, password)
    } else {
      request = api.uploadValidators(items, password)
    }
    request.then(_ => {
      Swal.resumeTimer()
      Swal.update({icon: 'success', title: 'Updated!', text: `Successfully updated ${name}.`})
      Swal.hideLoading()
    }).catch(error => {
      Swal.update({icon: 'error', showConfirmButton: true, title: 'Error!', text: `${name} have been not updated.`})
      Swal.hideLoading()
      Swal.showValidationMessage(`Request failed: ${error}`);
    })
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit {isInstitutesEntries ? "Institute" : "Validator"}</h1>
        <label htmlFor="firstName">Name</label>
        <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
        />
        <label htmlFor="id">Address</label>
        <input
            disabled
            id="id"
            type="text"
            name="id"
            value={id}
        />
        <label htmlFor="coordinateLat">Coordinate latitude</label>
        <input
            id="coordinateLat"
            type="number"
            name="coordinateLat"
            value={coordinateLat}
            onChange={e => setCoordinateLat(e.target.value)}
        />
        <label htmlFor="coordinateLong">Coordinate longitude</label>
        <input
            id="coordinateLong"
            type="number"
            name="coordinateLong"
            value={coordinateLong}
            onChange={e => setCoordinateLong(e.target.value)}
        />
        {isInstitutesEntries ? (
                <div>
                  <label htmlFor="country">State ID (<a href={'https://de.wikipedia.org/wiki/Amtlicher_Gemeindeschl%C3%BCssel'}
                                                        target={'_blank'}>AGS</a>)</label>
                  <input
                      id="country"
                      type="text"
                      name="country"
                      value={stateId}
                      onChange={e => setStateId(e.target.value)}
                  />
                </div>
        ):
            (
                <div>
                  <label htmlFor="country">Country ID (<a href={'https://en.wikipedia.org/wiki/ISO_3166-1'}
                                                          target={'_blank'}>ISO 3166-1</a>)</label>
                  <input
                      id="country"
                      type="text"
                      name="country"
                      value={countryId}
                      onChange={e => setCountryId(e.target.value)}
                  />
                </div>
            )}

        <div style={{marginTop: '30px'}}>
          <input type="submit" value="Update"/>
          <input
              style={{marginLeft: '12px'}}
              className="muted-button"
              type="button"
              value="Cancel"
              onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Edit;
