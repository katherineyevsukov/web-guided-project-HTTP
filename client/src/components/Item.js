import React, { useEffect, useState } from 'react';
import { Route, NavLink } from 'react-router-dom';
import axios from 'axios';

import ItemDescription from './ItemDescription';
import ItemShipping from './ItemShipping';

const Modal = (props)=> {
  const handleYes =()=>{
    props.yesFunc();
  }

  const handleNo =()=>{
    props.noFunc();
  }

  return (<div className="modal"> 
    <h1>{props.title}</h1> 
    <button onClick={handleYes}>Yes</button> <button onClick={handleNo}>No</button>
  </div>);
}

function Item(props) {
  const [item, setItem] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { id } = props.match.params;

  useEffect(()=>{
    axios.get(`http://localhost:3333/items/${id}`)
      .then(res=>{
        setItem(res.data);
      });
  }, []);

  if (!item) {
    return <h2>Loading item data...</h2>;
  }

  const handleEdit = ()=> {
    //TO Do an edit:
    //1. Capture a edit click.
    //2. Redirect to update form page.
    props.history.push(`/item-update/${item.id}`);
    //to be continued in UpdateForm.js
  }

  //To Do a delete
  //1. Capture a click on the delete button
  //2. Do a delete axios call on the current item.
  //3. Update local state to reflect the deleted item
  //4. Redirect to item list page.
  const handleDelete = ()=> {
    setShowModal(true);
  }

  const handleYesFunc = ()=> {
    axios.delete(`http://localhost:3333/items/${item.id}`)
      .then(resp=> {
        props.setItems(resp.data);
        props.history.push('/item-list');
      })
  }

  const handleNoFunc = ()=> {
    setShowModal(false);
  }

  return (
    <div className="item-wrapper">
      <div className="item-header">
        <div className="image-wrapper">
          <img src={item.imageUrl} alt={item.name} />
        </div>
        <div className="item-title-wrapper">
          <h2>{item.name}</h2>
          <h4>${item.price}</h4>
        </div>
      </div>
      <nav className="item-sub-nav">
        <NavLink exact to={`/item-list/${item.id}`}>
          the story
        </NavLink>
        <NavLink to={`/item-list/${item.id}/shipping`}>shipping</NavLink>
      </nav>
      <Route
        exact
        path="/item-list/:id"
        render={props => <ItemDescription {...props} item={item} />}
      />
      <Route
        path="/item-list/:id/shipping"
        render={props => <ItemShipping {...props} item={item} />}
      />
      <button onClick={handleEdit} className="md-button">
        Edit
      </button>
      <button onClick={handleDelete} className="md-button">
        Delete
      </button>
      {
        showModal && (<Modal title={"Are you sure you want to delete?"} yesFunc={handleYesFunc} noFunc={handleNoFunc}/>)
      } 
    </div>
  );
}

export default Item;
