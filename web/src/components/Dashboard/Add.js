import React, { useState } from 'react';
import Swal from 'sweetalert2';
import * as api from "../../api/api";
import {uploadInstitutes} from "../../api/api";

const Add = ({ items, setItems, setIsAdding, password, isInstitutesEntries }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [coordinateLat, setCoordinateLat] = useState('');
  const [coordinateLong, setCoordinateLong] = useState('');
  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');

  const handleAdd = e => {
    e.preventDefault();

    if (!name || !id || !coordinateLat || !coordinateLong || isInstitutesEntries ? !stateId: !countryId) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    if (items.find(item => item.id === id) !== undefined) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Id already exists. Choose an unique one.',
        showConfirmButton: true,
      });
    }

    let newItem = {
      name,
      id,
      coordinate: {
        lat: Number(coordinateLat),
        long: Number(coordinateLong)
      },
      countryId,
      stateId
    };
    items.push(newItem);

    Swal.fire({
      icon: undefined,
      title: 'Adding item...',
      timer: 1500,
      text: `Adding ${name} data.`,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      didClose: () => {
        setItems(items);
        setIsAdding(false);
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
      Swal.update({icon: 'success', title: 'Added!', text: `Successfully added ${name}.`})
      Swal.hideLoading()
    }).catch(error => {
      Swal.update({icon: 'error', showConfirmButton: true, title: 'Error!', text: `${name} have been not added.`})
      Swal.hideLoading()
      Swal.showValidationMessage(`Request failed: ${error}`);
    })
  };

  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <h1>{isInstitutesEntries ? "Add Institute" : "Add Validator"}</h1>
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
            id="id"
            type="text"
            name="id"
            value={id}
            onChange={e => setId(e.target.value)}
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
        {isInstitutesEntries ?
            (<div><label htmlFor="state">State ID (<a href={'https://de.wikipedia.org/wiki/Amtlicher_Gemeindeschl%C3%BCssel'}
                                                      target={'_blank'}>AGS</a>)</label>
            <input
                id="state"
                type="text"
                name="state"
                value={stateId}
                onChange={e => setStateId(e.target.value)}
            /></div>):
            (<div><label htmlFor="country">Country ID (<a href={'https://en.wikipedia.org/wiki/ISO_3166-1'}
                                                          target={'_blank'}>ISO 3166-1</a>)</label>
              <input
          id="country"
          type="text"
          name="country"
          value={countryId}
        onChange={e => setCountryId(e.target.value)}
      /></div>)}

        <div style={{marginTop: '30px'}}>
          <input type="submit" value="Add"/>
          <input
              style={{marginLeft: '12px'}}
              className="muted-button"
              type="button"
              value="Cancel"
              onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;
