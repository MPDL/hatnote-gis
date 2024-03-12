import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import * as api from "../../api/api";

const Dashboard = ({ setIsAuthenticated, password }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInstitutesEntries, setIsInstitutesEntries] = useState(false);

  useEffect(() => {
    Swal.fire({
      icon: undefined,
      title: 'Loading items...',
      text: `Loading items.`,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    handleLoadData(isInstitutesEntries)
  }, [password]);

  const handleLoadData = (isInstitutesEntries) => {
    let request;
    if (isInstitutesEntries){
      request = api.getInstitutes(password)
    } else {
      request = api.getValidators(password)
    }
    request.then(data => {
      setItems(data)
      Swal.close()
    }).catch(error => {
      Swal.update({icon: 'error', showConfirmButton: true, title: 'Error!', text: `Items could not be loaded.`})
      Swal.hideLoading()
      Swal.showValidationMessage(`Request failed: ${error}`);
    })
  }

  const handleEdit = id => {
    const [item] = items.filter(item => item.id === id);

    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleDelete = (id,name) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        Swal.fire({
          icon: undefined,
          title: 'Removing item...',
          timer: 1500,
          text: `Removing ${name} data.`,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });
        Swal.stopTimer()

        const itemsCopy = items.filter(item => item.id !== id);
        let request;
        if (isInstitutesEntries){
          console.log(password)
          request = api.uploadInstitutes(itemsCopy, password)
        } else {
          request = api.uploadValidators(itemsCopy, password)
        }
        request.then(_ => {
          Swal.resumeTimer()
          Swal.update({icon: 'success', title: 'Removed!', text: `Successfully removed ${name}.`})
          Swal.hideLoading()
          setItems(itemsCopy);
        }).catch(error => {
          Swal.update({icon: 'error', showConfirmButton: true, title: 'Error!', text: `${name} have been not removed.`})
          Swal.hideLoading()
          Swal.showValidationMessage(`Request failed: ${error}`);
        })
      }
    });
  };

  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header
              setIsAdding={setIsAdding}
              setIsAuthenticated={setIsAuthenticated}
              setIsInstitutesEntries={setIsInstitutesEntries}
              isInstitutesEntries={isInstitutesEntries}
              handleLoadData={handleLoadData}
          />
          <Table
              items={items}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              isInstitutesEntries={isInstitutesEntries}
          />
        </>
      )}
      {isAdding && (
        <Add
            items={items}
            setItems={setItems}
            setIsAdding={setIsAdding}
            password={password}
            isInstitutesEntries={isInstitutesEntries}
        />
      )}
      {isEditing && (
        <Edit
            items={items}
            selectedItem={selectedItem}
            setItems={setItems}
            setIsEditing={setIsEditing}
            password={password}
            isInstitutesEntries={isInstitutesEntries}
        />
      )}
    </div>
  );
};

export default Dashboard;
