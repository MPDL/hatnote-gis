import React from 'react';

const Table = ({ items, handleEdit, handleDelete, isInstitutesEntries }) => {
  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
        <tr>
          <th>Name</th>
          <th>{isInstitutesEntries? "Domain" : "Address"}</th>
          <th>Coordinate (latitude,longitude)</th>
          <th>{isInstitutesEntries ? (<span>State ID (<a href={'https://de.wikipedia.org/wiki/Amtlicher_Gemeindeschl%C3%BCssel'}
                                                           target={'_blank'}>AGS</a>)</span>) : (
              <span>Country ID (<a href={'https://en.wikipedia.org/wiki/ISO_3166-1'}
                                   target={'_blank'}>ISO 3166-1</a>)</span>)}</th>
          <th colSpan={2} className="text-center">
            Actions
          </th>
        </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
              items.map((item, i) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.id}</td>
                    <td>{item.coordinate.lat},{item.coordinate.long}</td>
                    <td>{isInstitutesEntries ? item.stateId : item.countryId}</td>
                    <td className="text-right">
                      <button
                          onClick={() => handleEdit(item.id)}
                          className="button muted-button"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="text-left">
                      <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="button muted-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
              <td colSpan={6}>No items</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
